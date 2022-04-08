"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mlPluginServerMock = void 0;

var _jobs_service = require("./shared_services/providers/__mocks__/jobs_service");

var _anomaly_detectors = require("./shared_services/providers/__mocks__/anomaly_detectors");

var _system = require("./shared_services/providers/__mocks__/system");

var _modules = require("./shared_services/providers/__mocks__/modules");

var _results_service = require("./shared_services/providers/__mocks__/results_service");

var _alerting_service = require("./shared_services/providers/__mocks__/alerting_service");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createSetupContract = () => ({
  jobServiceProvider: (0, _jobs_service.createJobServiceProviderMock)(),
  anomalyDetectorsProvider: (0, _anomaly_detectors.createAnomalyDetectorsProviderMock)(),
  mlSystemProvider: (0, _system.createMockMlSystemProvider)(),
  modulesProvider: (0, _modules.createModulesProviderMock)(),
  resultsServiceProvider: (0, _results_service.createResultsServiceProviderMock)(),
  alertingServiceProvider: (0, _alerting_service.createAlertingServiceProviderMock)()
});

const createStartContract = () => jest.fn();

const mlPluginServerMock = {
  createSetupContract,
  createStartContract
};
exports.mlPluginServerMock = mlPluginServerMock;