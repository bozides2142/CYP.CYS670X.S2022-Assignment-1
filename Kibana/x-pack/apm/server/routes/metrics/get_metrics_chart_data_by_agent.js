"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMetricsChartDataByAgent = getMetricsChartDataByAgent;

var _java = require("./by_agent/java");

var _default = require("./by_agent/default");

var _agent_name = require("../../../common/agent_name");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getMetricsChartDataByAgent({
  environment,
  kuery,
  setup,
  serviceName,
  serviceNodeName,
  agentName,
  start,
  end
}) {
  if ((0, _agent_name.isJavaAgentName)(agentName)) {
    return (0, _java.getJavaMetricsCharts)({
      environment,
      kuery,
      setup,
      serviceName,
      serviceNodeName,
      start,
      end
    });
  }

  return (0, _default.getDefaultMetricsCharts)({
    environment,
    kuery,
    setup,
    serviceName,
    start,
    end
  });
}