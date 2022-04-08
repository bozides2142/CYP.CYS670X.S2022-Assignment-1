"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createExternalServiceITOM = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _axios_utils = require("../lib/axios_utils");

var _service = require("./service");

var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getAddEventURL = url => `${url}/api/global/em/jsonv2`;

const createExternalServiceITOM = (credentials, logger, configurationUtilities, serviceConfig) => {
  const snService = (0, _service.createExternalService)(credentials, logger, configurationUtilities, serviceConfig);
  const {
    username,
    password
  } = credentials.secrets;

  const axiosInstance = _axios.default.create({
    auth: {
      username,
      password
    }
  });

  const addEvent = async params => {
    try {
      const res = await (0, _axios_utils.request)({
        axios: axiosInstance,
        url: getAddEventURL(snService.getUrl()),
        logger,
        method: 'post',
        data: {
          records: [params]
        },
        configurationUtilities
      });
      snService.checkInstance(res);
    } catch (error) {
      throw (0, _utils.createServiceError)(error, `Unable to add event`);
    }
  };

  return {
    addEvent,
    getChoices: snService.getChoices
  };
};

exports.createExternalServiceITOM = createExternalServiceITOM;