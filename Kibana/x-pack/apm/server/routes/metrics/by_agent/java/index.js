"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getJavaMetricsCharts = getJavaMetricsCharts;

var _with_apm_span = require("../../../../utils/with_apm_span");

var _heap_memory = require("./heap_memory");

var _non_heap_memory = require("./non_heap_memory");

var _thread_count = require("./thread_count");

var _cpu = require("../shared/cpu");

var _memory = require("../shared/memory");

var _get_gc_rate_chart = require("./gc/get_gc_rate_chart");

var _get_gc_time_chart = require("./gc/get_gc_time_chart");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getJavaMetricsCharts({
  environment,
  kuery,
  setup,
  serviceName,
  serviceNodeName,
  start,
  end
}) {
  return (0, _with_apm_span.withApmSpan)('get_java_system_metric_charts', () => {
    const options = {
      environment,
      kuery,
      setup,
      serviceName,
      serviceNodeName,
      start,
      end
    };
    return Promise.all([(0, _cpu.getCPUChartData)(options), (0, _memory.getMemoryChartData)(options), (0, _heap_memory.getHeapMemoryChart)(options), (0, _non_heap_memory.getNonHeapMemoryChart)(options), (0, _thread_count.getThreadCountChart)(options), (0, _get_gc_rate_chart.getGcRateChart)(options), (0, _get_gc_time_chart.getGcTimeChart)(options)]);
  });
}