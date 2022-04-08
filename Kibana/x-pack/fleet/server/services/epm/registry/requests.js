"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchUrl = fetchUrl;
exports.getFetchOptions = getFetchOptions;
exports.getResponse = getResponse;
exports.getResponseStream = getResponseStream;

var _nodeFetch = _interopRequireWildcard(require("node-fetch"));

var _pRetry = _interopRequireDefault(require("p-retry"));

var _streams = require("../streams");

var _app_context = require("../../app_context");

var _errors = require("../../../errors");

var _proxy = require("./proxy");

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// not sure what to call this function, but we're not exporting it


async function registryFetch(url) {
  const response = await (0, _nodeFetch.default)(url, getFetchOptions(url));

  if (response.ok) {
    return response;
  } else {
    // 4xx & 5xx responses
    const {
      status,
      statusText,
      url: resUrl
    } = response;
    const message = `'${status} ${statusText}' error response from package registry at ${resUrl || url}`;
    const responseError = new _errors.RegistryResponseError(message, status);
    throw new _pRetry.default.AbortError(responseError);
  }
}

async function getResponse(url, retries = 5) {
  try {
    // we only want to retry certain failures like network issues
    // the rest should only try the one time then fail as they do now
    const response = await (0, _pRetry.default)(() => registryFetch(url), {
      factor: 2,
      retries,
      onFailedAttempt: error => {
        // we only want to retry certain types of errors, like `ECONNREFUSED` and other operational errors
        // and let the others through without retrying
        //
        // throwing in onFailedAttempt will abandon all retries & fail the request
        // we only want to retry system errors, so re-throw for everything else
        if (!isSystemError(error)) {
          throw error;
        }
      }
    });
    return response;
  } catch (error) {
    // isSystemError here means we didn't succeed after max retries
    if (isSystemError(error)) {
      throw new _errors.RegistryConnectionError(`Error connecting to package registry: ${error.message}`);
    } // don't wrap our own errors


    if (error instanceof _errors.RegistryError) {
      throw error;
    } else {
      throw new _errors.RegistryError(error);
    }
  }
}

async function getResponseStream(url, retries) {
  const res = await getResponse(url, retries);
  return res.body;
}

async function fetchUrl(url, retries) {
  return getResponseStream(url, retries).then(_streams.streamToString);
} // node-fetch throws a FetchError for those types of errors and
// "All errors originating from Node.js core are marked with error.type = 'system'"
// https://github.com/node-fetch/node-fetch/blob/master/docs/ERROR-HANDLING.md#error-handling-with-node-fetch


function isFetchError(error) {
  return error instanceof _nodeFetch.FetchError || error.name === 'FetchError';
}

function isSystemError(error) {
  return isFetchError(error) && error.type === 'system';
}

function getFetchOptions(targetUrl) {
  const options = {
    headers: {
      'User-Agent': `Kibana/${_app_context.appContextService.getKibanaVersion()} node-fetch`
    }
  };
  const proxyUrl = (0, _proxy.getRegistryProxyUrl)();

  if (!proxyUrl) {
    return options;
  }

  const logger = _app_context.appContextService.getLogger();

  logger.debug(`Using ${proxyUrl} as proxy for ${targetUrl}`);
  options.agent = (0, _proxy.getProxyAgent)({
    proxyUrl,
    targetUrl
  });
  return options;
}