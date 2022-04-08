"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMetricsSubClient = void 0;

var _get_case_metrics = require("./get_case_metrics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Creates the interface for retrieving metrics for cases.
 *
 * @ignore
 */


const createMetricsSubClient = (clientArgs, casesClient) => {
  const casesSubClient = {
    getCaseMetrics: params => (0, _get_case_metrics.getCaseMetrics)(params, casesClient, clientArgs)
  };
  return Object.freeze(casesSubClient);
};

exports.createMetricsSubClient = createMetricsSubClient;