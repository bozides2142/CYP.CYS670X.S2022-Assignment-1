"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDefaultMetricsCharts = getDefaultMetricsCharts;

var _cpu = require("./shared/cpu");

var _memory = require("./shared/memory");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getDefaultMetricsCharts({
  environment,
  kuery,
  serviceName,
  setup,
  start,
  end
}) {
  return Promise.all([(0, _cpu.getCPUChartData)({
    environment,
    kuery,
    setup,
    serviceName,
    start,
    end
  }), (0, _memory.getMemoryChartData)({
    environment,
    kuery,
    setup,
    serviceName,
    start,
    end
  })]);
}