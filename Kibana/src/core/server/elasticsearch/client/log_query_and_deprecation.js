"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getErrorMessage = getErrorMessage;
exports.getRequestDebugMeta = getRequestDebugMeta;
exports.instrumentEsQueryAndDeprecationLogger = void 0;

var _buffer = require("buffer");

var _querystring = require("querystring");

var _elasticsearch = require("@elastic/elasticsearch");

var _numeral = _interopRequireDefault(require("@elastic/numeral"));

var _get_ecs_response_log = require("./get_ecs_response_log");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const convertQueryString = qs => {
  if (qs === undefined || typeof qs === 'string') {
    return qs !== null && qs !== void 0 ? qs : '';
  }

  return (0, _querystring.stringify)(qs);
};

function ensureString(body) {
  if (typeof body === 'string') return body;
  if (_buffer.Buffer.isBuffer(body)) return '[buffer]';
  if ('readable' in body && body.readable && typeof body._read === 'function') return '[stream]';
  return JSON.stringify(body);
}
/**
 * Returns a debug message from an Elasticsearch error in the following format:
 * [error type] error reason
 */


function getErrorMessage(error) {
  if (error instanceof _elasticsearch.errors.ResponseError) {
    var _errorBody$error, _errorBody$error$reas, _errorBody$error2;

    const errorBody = error.meta.body;
    return `[${errorBody === null || errorBody === void 0 ? void 0 : (_errorBody$error = errorBody.error) === null || _errorBody$error === void 0 ? void 0 : _errorBody$error.type}]: ${(_errorBody$error$reas = errorBody === null || errorBody === void 0 ? void 0 : (_errorBody$error2 = errorBody.error) === null || _errorBody$error2 === void 0 ? void 0 : _errorBody$error2.reason) !== null && _errorBody$error$reas !== void 0 ? _errorBody$error$reas : error.message}`;
  }

  return `[${error.name}]: ${error.message}`;
}

function getContentLength(headers) {
  const contentLength = headers && headers['content-length'];

  if (contentLength) {
    const val = parseInt(contentLength, 10);
    return !isNaN(val) ? val : undefined;
  }
}
/**
 * returns a string in format:
 *
 * status code
 * method URL
 * request body
 *
 * so it could be copy-pasted into the Dev console
 */


function getResponseMessage(event, bytesMsg) {
  const errorMeta = getRequestDebugMeta(event);
  const body = errorMeta.body ? `\n${errorMeta.body}` : '';
  return `${errorMeta.statusCode}${bytesMsg}\n${errorMeta.method} ${errorMeta.url}${body}`;
}
/**
 * Returns stringified debug information from an Elasticsearch request event
 * useful for logging in case of an unexpected failure.
 */


function getRequestDebugMeta(event) {
  const params = event.meta.request.params; // definition is wrong, `params.querystring` can be either a string or an object

  const querystring = convertQueryString(params.querystring);
  return {
    url: `${params.path}${querystring ? `?${querystring}` : ''}`,
    body: params.body ? `${ensureString(params.body)}` : '',
    method: params.method,
    statusCode: event.statusCode
  };
}
/** HTTP Warning headers have the following syntax:
 * <warn-code> <warn-agent> <warn-text> (where warn-code is a three digit number)
 * This function tests if a warning comes from an Elasticsearch warn-agent
 * */


const isEsWarning = warning => /\d\d\d Elasticsearch-/.test(warning);

const instrumentEsQueryAndDeprecationLogger = ({
  logger,
  client,
  type
}) => {
  const queryLogger = logger.get('query', type);
  const deprecationLogger = logger.get('deprecation');
  client.diagnostic.on('response', (error, event) => {
    if (event) {
      const bytes = getContentLength(event.headers);
      const bytesMsg = bytes ? ` - ${(0, _numeral.default)(bytes).format('0.0b')}` : '';
      const meta = (0, _get_ecs_response_log.getEcsResponseLog)(event, bytes);
      let queryMsg = '';

      if (error) {
        if (error instanceof _elasticsearch.errors.ResponseError) {
          queryMsg = `${getResponseMessage(event, bytesMsg)} ${getErrorMessage(error)}`;
        } else {
          queryMsg = getErrorMessage(error);
        }
      } else {
        queryMsg = getResponseMessage(event, bytesMsg);
      }

      queryLogger.debug(queryMsg, meta);

      if (event.warnings && event.warnings.filter(isEsWarning).length > 0) {
        var _Error$stack;

        // Plugins can explicitly mark requests as originating from a user by
        // removing the `'x-elastic-product-origin': 'kibana'` header that's
        // added by default. User requests will be shown to users in the
        // upgrade assistant UI as an action item that has to be addressed
        // before they upgrade.
        // Kibana requests will be hidden from the upgrade assistant UI and are
        // only logged to help developers maintain their plugins
        const requestOrigin = (event.meta.request.params.headers != null && event.meta.request.params.headers['x-elastic-product-origin']) === 'kibana' ? 'kibana' : 'user'; // Strip the first 5 stack trace lines as these are irrelavent to finding the call site

        const stackTrace = (_Error$stack = new Error().stack) === null || _Error$stack === void 0 ? void 0 : _Error$stack.split('\n').slice(5).join('\n');
        deprecationLogger.debug(`Elasticsearch deprecation: ${event.warnings}\nOrigin:${requestOrigin}\nStack trace:\n${stackTrace}\nQuery:\n${queryMsg}`);
      }
    }
  });
};

exports.instrumentEsQueryAndDeprecationLogger = instrumentEsQueryAndDeprecationLogger;