"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.throwIfResponseIsNotValid = exports.request = exports.patch = exports.getErrorMessage = exports.createAxiosResponse = exports.addTimeZoneToDate = void 0;

var _lodash = require("lodash");

var _get_custom_agents = require("./get_custom_agents");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const request = async ({
  axios,
  url,
  logger,
  method = 'get',
  data,
  configurationUtilities,
  ...rest
}) => {
  const {
    httpAgent,
    httpsAgent
  } = (0, _get_custom_agents.getCustomAgents)(configurationUtilities, logger, url);
  const {
    maxContentLength,
    timeout
  } = configurationUtilities.getResponseSettings();
  return await axios(url, { ...rest,
    method,
    data: data !== null && data !== void 0 ? data : {},
    // use httpAgent and httpsAgent and set axios proxy: false, to be able to handle fail on invalid certs
    httpAgent,
    httpsAgent,
    proxy: false,
    maxContentLength,
    timeout
  });
};

exports.request = request;

const patch = async ({
  axios,
  url,
  data,
  logger,
  configurationUtilities
}) => {
  return request({
    axios,
    url,
    logger,
    method: 'patch',
    data,
    configurationUtilities
  });
};

exports.patch = patch;

const addTimeZoneToDate = (date, timezone = 'GMT') => {
  return `${date} ${timezone}`;
};

exports.addTimeZoneToDate = addTimeZoneToDate;

const getErrorMessage = (connector, msg) => {
  return `[Action][${connector}]: ${msg}`;
};

exports.getErrorMessage = getErrorMessage;

const throwIfResponseIsNotValid = ({
  res,
  requiredAttributesToBeInTheResponse = []
}) => {
  var _res$headers$content;

  const requiredContentType = 'application/json';
  const contentType = (_res$headers$content = res.headers['content-type']) !== null && _res$headers$content !== void 0 ? _res$headers$content : 'undefined';
  const data = res.data;
  /**
   * Check that the content-type of the response is application/json.
   * Then includes is added because the header can be application/json;charset=UTF-8.
   */

  if (!contentType.includes(requiredContentType)) {
    throw new Error(`Unsupported content type: ${contentType} in ${res.config.method} ${res.config.url}. Supported content types: ${requiredContentType}`);
  }
  /**
   * Check if the response is a JS object (data != null && typeof data === 'object')
   * in case the content type is application/json but for some reason the response is not.
   * Empty responses (204 No content) are ignored because the typeof data will be string and
   * isObjectLike will fail.
   * Axios converts automatically JSON to JS objects.
   */


  if (!(0, _lodash.isEmpty)(data) && !(0, _lodash.isObjectLike)(data)) {
    throw new Error('Response is not a valid JSON');
  }

  if (requiredAttributesToBeInTheResponse.length > 0) {
    const requiredAttributesError = new Error(`Response is missing at least one of the expected fields: ${requiredAttributesToBeInTheResponse.join(',')}`);
    /**
     * If the response is an array and requiredAttributesToBeInTheResponse
     * are not empty then we thrown an error assuming that the consumer
     * expects an object response and not an array.
     */

    if (Array.isArray(data)) {
      throw requiredAttributesError;
    }

    requiredAttributesToBeInTheResponse.forEach(attr => {
      // Check only for undefined as null is a valid value
      if (data[attr] === undefined) {
        throw requiredAttributesError;
      }
    });
  }
};

exports.throwIfResponseIsNotValid = throwIfResponseIsNotValid;

const createAxiosResponse = res => ({
  data: {},
  status: 200,
  statusText: 'OK',
  headers: {
    ['content-type']: 'application/json'
  },
  config: {
    method: 'GET',
    url: 'https://example.com'
  },
  ...res
});

exports.createAxiosResponse = createAxiosResponse;