"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EnterpriseSearchRequestHandler = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _querystring = _interopRequireDefault(require("querystring"));

var _constants = require("../../common/constants");

var _enterprise_search_http_agent = require("./enterprise_search_http_agent");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * This helper lib creates a single standard DRY way of handling
 * Enterprise Search API requests.
 *
 * This handler assumes that it will essentially just proxy the
 * Enterprise Search API request, so the request body and request
 * parameters are simply passed through.
 */


class EnterpriseSearchRequestHandler {
  constructor({
    config,
    log
  }) {
    (0, _defineProperty2.default)(this, "enterpriseSearchUrl", void 0);
    (0, _defineProperty2.default)(this, "log", void 0);
    (0, _defineProperty2.default)(this, "headers", {});
    this.log = log;
    this.enterpriseSearchUrl = config.host;
  }

  createRequest({
    path,
    params = {},
    hasJsonResponse = true,
    hasValidData = () => true
  }) {
    return async (_context, request, response) => {
      try {
        // Set up API URL
        const encodedPath = this.encodePathParams(path, request.params);
        const queryParams = { ...request.query,
          ...params
        };
        const queryString = !this.isEmptyObj(queryParams) ? `?${_querystring.default.stringify(queryParams)}` : '';
        const url = encodeURI(this.enterpriseSearchUrl) + encodedPath + queryString; // Set up API options

        const options = {
          method: request.route.method,
          headers: {
            Authorization: request.headers.authorization,
            ..._constants.JSON_HEADER
          },
          body: this.getBodyAsString(request.body),
          agent: _enterprise_search_http_agent.entSearchHttpAgent.getHttpAgent()
        }; // Call the Enterprise Search API

        const apiResponse = await (0, _nodeFetch.default)(url, options); // Handle response headers

        this.setResponseHeaders(apiResponse); // Handle unauthenticated users / authentication redirects

        if (apiResponse.status === 401 || apiResponse.url.endsWith('/login') || apiResponse.url.endsWith('/ent/select')) {
          return this.handleAuthenticationError(response);
        } // Handle 400-500+ responses from the Enterprise Search server


        const {
          status
        } = apiResponse;

        if (status >= 500) {
          if (this.headers[_constants.READ_ONLY_MODE_HEADER] === 'true') {
            // Handle 503 read-only mode errors
            return this.handleReadOnlyModeError(response);
          } else {
            // Handle unexpected server errors
            return this.handleServerError(response, apiResponse, url);
          }
        } else if (status >= 400) {
          return this.handleClientError(response, apiResponse);
        } // Check returned data


        let responseBody;

        if (hasJsonResponse) {
          const json = await apiResponse.json();

          if (!hasValidData(json)) {
            return this.handleInvalidDataError(response, url, json);
          } // Intercept data that is meant for the server side session


          const {
            _sessionData,
            ...responseJson
          } = json;

          if (_sessionData) {
            this.setSessionData(_sessionData);
            responseBody = responseJson;
          } else {
            responseBody = json;
          }
        } else {
          responseBody = apiResponse.body;
        } // Pass successful responses back to the front-end


        return response.custom({
          statusCode: status,
          headers: this.headers,
          body: responseBody
        });
      } catch (e) {
        // Catch connection errors
        return this.handleConnectionError(response, e);
      }
    };
  }
  /**
   * There are a number of different expected incoming bodies that we handle & pass on to Enterprise Search for ingestion:
   * - Standard object data (should be JSON stringified)
   * - Empty (should be passed as undefined and not as an empty obj)
   * - Raw buffers (passed on as a string, occurs when using the `skipBodyValidation` lib helper)
   */


  getBodyAsString(body) {
    if (Buffer.isBuffer(body)) return body.toString();
    if (this.isEmptyObj(body)) return undefined;
    return JSON.stringify(body);
  }
  /**
   * This path helper is similar to React Router's generatePath, but much simpler &
   * does not use regexes. It enables us to pass a static '/foo/:bar/baz' string to
   * createRequest({ path }) and have :bar be automatically replaced by the value of
   * request.params.bar.
   * It also (very importantly) wraps all URL request params with encodeURIComponent(),
   * which is an extra layer of encoding required by the Enterprise Search server in
   * order to correctly & safely parse user-generated IDs with special characters in
   * their names - just encodeURI alone won't work.
   */


  encodePathParams(path, params) {
    const hasParams = path.includes(':');

    if (!hasParams) {
      return path;
    } else {
      return path.split('/').map(pathPart => {
        const isParam = pathPart.startsWith(':');

        if (!isParam) {
          return pathPart;
        } else {
          const pathParam = pathPart.replace(':', '');
          return encodeURIComponent(params[pathParam]);
        }
      }).join('/');
    }
  }
  /**
   * Attempt to grab a usable error body from Enterprise Search - this isn't
   * always possible because some of our internal endpoints send back blank
   * bodies, and sometimes the server sends back Ruby on Rails error pages
   */


  async getErrorResponseBody(apiResponse) {
    const {
      statusText
    } = apiResponse;
    const contentType = apiResponse.headers.get('content-type') || ''; // Default response

    let body = {
      message: statusText,
      attributes: {
        errors: [statusText]
      }
    };

    try {
      if (contentType.includes('application/json')) {
        // Try parsing body as JSON
        const json = await apiResponse.json(); // Some of our internal endpoints return either an `error` or `errors` key,
        // which can both return either a string or array of strings ¯\_(ツ)_/¯

        const errors = json.error || json.errors || [statusText];
        body = {
          message: errors.toString(),
          attributes: {
            errors: Array.isArray(errors) ? errors : [errors]
          }
        };
      } else {
        // Try parsing body as text/html
        const text = await apiResponse.text();

        if (text) {
          body = {
            message: text,
            attributes: {
              errors: [text]
            }
          };
        }
      }
    } catch {// Fail silently
    }

    return body;
  }
  /**
   * Error response helpers
   */


  async handleClientError(response, apiResponse) {
    const {
      status
    } = apiResponse;
    const body = await this.getErrorResponseBody(apiResponse);
    return response.customError({
      statusCode: status,
      headers: this.headers,
      body
    });
  }

  async handleServerError(response, apiResponse, url) {
    const {
      status
    } = apiResponse;
    const {
      message
    } = await this.getErrorResponseBody(apiResponse); // Don't expose server errors to the front-end, as they may contain sensitive stack traces

    const errorMessage = 'Enterprise Search encountered an internal server error. Please contact your system administrator if the problem persists.';
    this.log.error(`Enterprise Search Server Error ${status} at <${url}>: ${message}`);
    return response.customError({
      statusCode: 502,
      headers: this.headers,
      body: errorMessage
    });
  }

  handleReadOnlyModeError(response) {
    const errorMessage = 'Enterprise Search is in read-only mode. Actions that create, update, or delete information are disabled.';
    this.log.error(`Cannot perform action: ${errorMessage}`);
    return response.customError({
      statusCode: 503,
      headers: this.headers,
      body: errorMessage
    });
  }

  handleInvalidDataError(response, url, json) {
    const errorMessage = 'Invalid data received from Enterprise Search';
    this.log.error(`Invalid data received from <${url}>: ${JSON.stringify(json)}`);
    return response.customError({
      statusCode: 502,
      headers: this.headers,
      body: errorMessage
    });
  }

  handleConnectionError(response, e) {
    const errorMessage = `Error connecting to Enterprise Search: ${(e === null || e === void 0 ? void 0 : e.message) || e.toString()}`;
    const headers = { ...this.headers,
      [_constants.ERROR_CONNECTING_HEADER]: 'true'
    };
    this.log.error(errorMessage);
    if (e instanceof Error) this.log.debug(e.stack);
    return response.customError({
      statusCode: 502,
      headers,
      body: errorMessage
    });
  }
  /**
   * Note: Kibana auto logs users out when it receives a 401 response, so we want to catch and
   * return 401 responses from Enterprise Search as a 502 so Kibana sessions aren't interrupted
   */


  handleAuthenticationError(response) {
    const errorMessage = 'Cannot authenticate Enterprise Search user';
    const headers = { ...this.headers,
      [_constants.ERROR_CONNECTING_HEADER]: 'true'
    };
    this.log.error(errorMessage);
    return response.customError({
      statusCode: 502,
      headers,
      body: errorMessage
    });
  }
  /**
   * Set response headers
   *
   * Currently just forwards the read-only mode header, but we can expand this
   * in the future to pass more headers from Enterprise Search as we need them
   */


  setResponseHeaders(apiResponse) {
    const readOnlyMode = apiResponse.headers.get(_constants.READ_ONLY_MODE_HEADER);
    this.headers[_constants.READ_ONLY_MODE_HEADER] = readOnlyMode;
  }
  /**
   * Extract Session Data
   *
   * In the future, this will set the keys passed back from Enterprise Search
   * into the Kibana login session.
   * For now we'll explicity look for the Workplace Search OAuth token package
   * and stuff it into a cookie so it can be picked up later when we proxy the
   * OAuth callback.
   */


  setSessionData(sessionData) {
    if (sessionData.wsOAuthTokenPackage) {
      const anHourFromNow = new Date(Date.now());
      anHourFromNow.setHours(anHourFromNow.getHours() + 1);
      const cookiePayload = `${_constants.ENTERPRISE_SEARCH_KIBANA_COOKIE}=${sessionData.wsOAuthTokenPackage};`;
      const cookieRestrictions = `Path=/; Expires=${anHourFromNow.toUTCString()}; SameSite=Lax; HttpOnly`;
      this.headers['set-cookie'] = `${cookiePayload} ${cookieRestrictions}`;
    }
  }
  /**
   * Misc helpers
   */


  isEmptyObj(obj) {
    return Object.keys(obj).length === 0;
  }

}

exports.EnterpriseSearchRequestHandler = EnterpriseSearchRequestHandler;