"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.throwIfSubActionIsNotSupported = exports.prepareIncident = exports.getPushedDate = exports.createServiceError = void 0;

var _config = require("./config");

var _axios_utils = require("../lib/axios_utils");

var i18n = _interopRequireWildcard(require("./translations"));

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


const prepareIncident = (useOldApi, incident) => useOldApi ? incident : Object.entries(incident).reduce((acc, [key, value]) => ({ ...acc,
  [`${_config.FIELD_PREFIX}${key}`]: value
}), {});

exports.prepareIncident = prepareIncident;

const createErrorMessage = errorResponse => {
  if (errorResponse == null) {
    return 'unknown: errorResponse was null';
  }

  const {
    error
  } = errorResponse;
  return error != null ? `${error === null || error === void 0 ? void 0 : error.message}: ${error === null || error === void 0 ? void 0 : error.detail}` : 'unknown: no error in error response';
};

const createServiceError = (error, message) => {
  var _error$response;

  return new Error((0, _axios_utils.getErrorMessage)(i18n.SERVICENOW, `${message}. Error: ${error.message} Reason: ${createErrorMessage((_error$response = error.response) === null || _error$response === void 0 ? void 0 : _error$response.data)}`));
};

exports.createServiceError = createServiceError;

const getPushedDate = timestamp => {
  if (timestamp != null) {
    return new Date((0, _axios_utils.addTimeZoneToDate)(timestamp)).toISOString();
  }

  return new Date().toISOString();
};

exports.getPushedDate = getPushedDate;

const throwIfSubActionIsNotSupported = ({
  api,
  subAction,
  supportedSubActions,
  logger
}) => {
  if (!api[subAction]) {
    const errorMessage = `[Action][ExternalService] Unsupported subAction type ${subAction}.`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  if (!supportedSubActions.includes(subAction)) {
    const errorMessage = `[Action][ExternalService] subAction ${subAction} not implemented.`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }
};

exports.throwIfSubActionIsNotSupported = throwIfSubActionIsNotSupported;