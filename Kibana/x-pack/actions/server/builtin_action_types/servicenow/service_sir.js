"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createExternalServiceSIR = void 0;

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


const getAddObservableToIncidentURL = (url, incidentID) => `${url}/api/x_elas2_sir_int/elastic_api/incident/${incidentID}/observables`;

const getBulkAddObservableToIncidentURL = (url, incidentID) => `${url}/api/x_elas2_sir_int/elastic_api/incident/${incidentID}/observables/bulk`;

const createExternalServiceSIR = (credentials, logger, configurationUtilities, serviceConfig) => {
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

  const _addObservable = async (data, url) => {
    snService.checkIfApplicationIsInstalled();
    const res = await (0, _axios_utils.request)({
      axios: axiosInstance,
      url,
      logger,
      method: 'post',
      data,
      configurationUtilities
    });
    snService.checkInstance(res);
    return res.data.result;
  };

  const addObservableToIncident = async (observable, incidentID) => {
    try {
      return await _addObservable(observable, getAddObservableToIncidentURL(snService.getUrl(), incidentID));
    } catch (error) {
      throw (0, _utils.createServiceError)(error, `Unable to add observable to security incident with id ${incidentID}`);
    }
  };

  const bulkAddObservableToIncident = async (observables, incidentID) => {
    try {
      return await _addObservable(observables, getBulkAddObservableToIncidentURL(snService.getUrl(), incidentID));
    } catch (error) {
      throw (0, _utils.createServiceError)(error, `Unable to add observables to security incident with id ${incidentID}`);
    }
  };

  return { ...snService,
    addObservableToIncident,
    bulkAddObservableToIncident
  };
};

exports.createExternalServiceSIR = createExternalServiceSIR;