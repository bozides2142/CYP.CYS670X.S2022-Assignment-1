"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHeapMemoryChart = getHeapMemoryChart;

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
  heapMemoryUsed: {
    title: _i18n.i18n.translate('xpack.apm.agentMetrics.java.heapMemorySeriesUsed', {
      defaultMessage: 'Avg. used'
    }),
    color: _uiTheme.euiLightVars.euiColorVis0
  },
  heapMemoryCommitted: {
    title: _i18n.i18n.translate('xpack.apm.agentMetrics.java.heapMemorySeriesCommitted', {
      defaultMessage: 'Avg. committed'
    }),
    color: _uiTheme.euiLightVars.euiColorVis1
  },
  heapMemoryMax: {
    title: _i18n.i18n.translate('xpack.apm.agentMetrics.java.heapMemorySeriesMax', {
      defaultMessage: 'Avg. limit'
    }),
    color: _uiTheme.euiLightVars.euiColorVis2
  }
};
const chartBase = {
  title: _i18n.i18n.translate('xpack.apm.agentMetrics.java.heapMemoryChartTitle', {
    defaultMessage: 'Heap Memory'
  }),
  key: 'heap_memory_area_chart',
  type: 'area',
  yUnit: 'bytes',
  series
};

function getHeapMemoryChart({
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
      heapMemoryMax: {
        avg: {
          field: _elasticsearch_fieldnames.METRIC_JAVA_HEAP_MEMORY_MAX
        }
      },
      heapMemoryCommitted: {
        avg: {
          field: _elasticsearch_fieldnames.METRIC_JAVA_HEAP_MEMORY_COMMITTED
        }
      },
      heapMemoryUsed: {
        avg: {
          field: _elasticsearch_fieldnames.METRIC_JAVA_HEAP_MEMORY_USED
        }
      }
    },
    additionalFilters: [{
      terms: {
        [_elasticsearch_fieldnames.AGENT_NAME]: _agent_name.JAVA_AGENT_NAMES
      }
    }],
    operationName: 'get_heap_memory_charts'
  });
}