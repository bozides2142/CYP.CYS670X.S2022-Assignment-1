"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGcRateChart = getGcRateChart;

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
  [_elasticsearch_fieldnames.METRIC_JAVA_GC_COUNT]: {
    title: _i18n.i18n.translate('xpack.apm.agentMetrics.java.gcRate', {
      defaultMessage: 'GC rate'
    }),
    color: _uiTheme.euiLightVars.euiColorVis0
  }
};
const chartBase = {
  title: _i18n.i18n.translate('xpack.apm.agentMetrics.java.gcRateChartTitle', {
    defaultMessage: 'Garbage collection per minute'
  }),
  key: 'gc_rate_line_chart',
  type: 'linemark',
  yUnit: 'integer',
  series
};

function getGcRateChart({
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
    fieldName: _elasticsearch_fieldnames.METRIC_JAVA_GC_COUNT,
    operationName: 'get_gc_rate_charts'
  });
}