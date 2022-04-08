"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGcTimeChart = getGcTimeChart;

var _uiTheme = require("@kbn/ui-theme");

var _i18n = require("@kbn/i18n");

var _elasticsearch_fieldnames = require("../../../../../../common/elasticsearch_fieldnames");

var _fetch_and_transform_gc_metrics = require("./fetch_and_transform_gc_metrics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const series = {
  [_elasticsearch_fieldnames.METRIC_JAVA_GC_TIME]: {
    title: _i18n.i18n.translate('xpack.apm.agentMetrics.java.gcTime', {
      defaultMessage: 'GC time'
    }),
    color: _uiTheme.euiLightVars.euiColorVis0
  }
};
const chartBase = {
  title: _i18n.i18n.translate('xpack.apm.agentMetrics.java.gcTimeChartTitle', {
    defaultMessage: 'Garbage collection time spent per minute'
  }),
  key: 'gc_time_line_chart',
  type: 'linemark',
  yUnit: 'time',
  series
};

function getGcTimeChart({
  environment,
  kuery,
  setup,
  serviceName,
  serviceNodeName,
  start,
  end
}) {
  return (0, _fetch_and_transform_gc_metrics.fetchAndTransformGcMetrics)({
    environment,
    kuery,
    setup,
    serviceName,
    serviceNodeName,
    start,
    end,
    chartBase,
    fieldName: _elasticsearch_fieldnames.METRIC_JAVA_GC_TIME,
    operationName: 'get_gc_time_charts'
  });
}