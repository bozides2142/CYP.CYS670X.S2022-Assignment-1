"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendEmailGraphApi = sendEmailGraphApi;

var _jsonStringifySafe = _interopRequireDefault(require("json-stringify-safe"));

var _axios = _interopRequireDefault(require("axios"));

var _axios_utils = require("./axios_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-expect-error missing type def


const MICROSOFT_GRAPH_API_HOST = 'https://graph.microsoft.com/v1.0';

async function sendEmailGraphApi(sendEmailOptions, logger, configurationUtilities) {
  const {
    options,
    headers,
    messageHTML,
    graphApiUrl
  } = sendEmailOptions;

  const axiosInstance = _axios.default.create(); // POST /users/{id | userPrincipalName}/sendMail


  const res = await (0, _axios_utils.request)({
    axios: axiosInstance,
    url: `${graphApiUrl !== null && graphApiUrl !== void 0 ? graphApiUrl : MICROSOFT_GRAPH_API_HOST}/users/${options.routing.from}/sendMail`,
    method: 'post',
    logger,
    data: getMessage(options, messageHTML),
    headers,
    configurationUtilities,
    validateStatus: () => true
  });

  if (res.status === 202) {
    return res.data;
  }

  const errString = (0, _jsonStringifySafe.default)(res.data);
  logger.warn(`error thrown sending Microsoft Exchange email for clientID: ${sendEmailOptions.options.transport.clientId}: ${errString}`);
  throw new Error(errString);
}

function getMessage(emailOptions, messageHTML) {
  const {
    routing,
    content
  } = emailOptions;
  const {
    to,
    cc,
    bcc
  } = routing;
  const {
    subject
  } = content;
  return {
    message: {
      subject,
      body: {
        contentType: 'HTML',
        content: messageHTML
      },
      toRecipients: to.map(toAddr => ({
        emailAddress: {
          address: toAddr
        }
      })),
      ccRecipients: cc.map(ccAddr => ({
        emailAddress: {
          address: ccAddr
        }
      })),
      bccRecipients: bcc.map(bccAddr => ({
        emailAddress: {
          address: bccAddr
        }
      }))
    }
  };
}