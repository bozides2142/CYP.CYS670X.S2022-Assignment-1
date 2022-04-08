"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getThreadCountChart = getThreadCountChart;

var _uiTheme = require("@kbn/ui-theme");

var _i18n = require("@kbn/i18n");

var _elasticsearch_fieldnames = require("../../../../../../common/elasticsearch_fieldnames");

var _fetch_and_transform_metrics = require("../../../fetch_and_transform_metrics");

var _agent_name = require("../../../../../../common/agent_name");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const series = {
  threadCount: {
    title: _i18n.i18n.translate('xpack.apm.agentMetrics.java.threadCount', {
      defaultMessage: 'Avg. count'
    }),
    color: _uiTheme.euiLightVars.euiColorVis0
  },
  threadCountMax: {
    title: _i18n.i18n.translate('xpack.apm.agentMetrics.java.threadCountMax', {
      defaultMessage: 'Max count'
    }),
    color: _uiTheme.euiLightVars.euiColorVis1
  }
};
const chartBase = {
  title: _i18n.i18n.translate('xpack.apm.agentMetrics.java.threadCountChartTitle', {
    defaultMessage: 'Thread Count'
  }),
  key: 'thread_count_line_chart',
  type: 'linemark',
  yUnit: 'number',
  series
};

async function getThreadCountChart({
  environment,
  kuery,
  setup,
  serviceName,
  serviceNodeName,
  start,
  end
}) {
  return (0, _fetch_and_transform_metrics.fetchAndTransformMetrics)({
    environment,
    kuery,
    setup,
    serviceName,
    serviceNodeName,
    start,
    end,
    chartBase,
    aggs: {
      threadCount: {
        avg: {
          field: _elasticsearch_fieldnames.METRIC_JAVA_THREAD_COUNT
        }
      },
      threadCountMax: {
        max: {
          field: _elasticsearch_fieldnames.METRIC_JAVA_THREAD_COUNT
        }
      }
    },
    additionalFilters: [{
      terms: {
        [_elasticsearch_fieldnames.AGENT_NAME]: _agent_name.JAVA_AGENT_NAMES
      }
    }],
    operationName: 'get_thread_count_charts'
  });
}