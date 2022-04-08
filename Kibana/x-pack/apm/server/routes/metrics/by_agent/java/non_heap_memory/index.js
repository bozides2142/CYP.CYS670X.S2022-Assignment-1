"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNonHeapMemoryChart = getNonHeapMemoryChart;

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
  nonHeapMemoryUsed: {
    title: _i18n.i18n.translate('xpack.apm.agentMetrics.java.nonHeapMemorySeriesUsed', {
      defaultMessage: 'Avg. used'
    }),
    color: _uiTheme.euiLightVars.euiColorVis0
  },
  nonHeapMemoryCommitted: {
    title: _i18n.i18n.translate('xpack.apm.agentMetrics.java.nonHeapMemorySeriesCommitted', {
      defaultMessage: 'Avg. committed'
    }),
    color: _uiTheme.euiLightVars.euiColorVis1
  }
};
const chartBase = {
  title: _i18n.i18n.translate('xpack.apm.agentMetrics.java.nonHeapMemoryChartTitle', {
    defaultMessage: 'Non-Heap Memory'
  }),
  key: 'non_heap_memory_area_chart',
  type: 'area',
  yUnit: 'bytes',
  series
};

async function getNonHeapMemoryChart({
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
      nonHeapMemoryMax: {
        avg: {
          field: _elasticsearch_fieldnames.METRIC_JAVA_NON_HEAP_MEMORY_MAX
        }
      },
      nonHeapMemoryCommitted: {
        avg: {
          field: _elasticsearch_fieldnames.METRIC_JAVA_NON_HEAP_MEMORY_COMMITTED
        }
      },
      nonHeapMemoryUsed: {
        avg: {
          field: _elasticsearch_fieldnames.METRIC_JAVA_NON_HEAP_MEMORY_USED
        }
      }
    },
    additionalFilters: [{
      terms: {
        [_elasticsearch_fieldnames.AGENT_NAME]: _agent_name.JAVA_AGENT_NAMES
      }
    }],
    operationName: 'get_non_heap_memory_charts'
  });
}