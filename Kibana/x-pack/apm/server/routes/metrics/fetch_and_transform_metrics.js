"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchAndTransformMetrics = fetchAndTransformMetrics;

var _uiTheme = require("@kbn/ui-theme");

var _viz_colors = require("../../../common/viz_colors");

var _metrics = require("../../lib/helpers/metrics");

var _environment_query = require("../../../common/utils/environment_query");

var _server = require("../../../../observability/server");

var _processor_event = require("../../../common/processor_event");

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function fetchAndTransformMetrics({
  environment,
  kuery,
  setup,
  serviceName,
  serviceNodeName,
  start,
  end,
  chartBase,
  aggs,
  additionalFilters = [],
  operationName
}) {
  const {
    apmEventClient,
    config
  } = setup;
  const params = {
    apm: {
      events: [_processor_event.ProcessorEvent.metric]
    },
    body: {
      size: 0,
      query: {
        bool: {
          filter: [{
            term: {
              [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
            }
          }, ...(0, _environment_query.serviceNodeNameQuery)(serviceNodeName), ...(0, _server.rangeQuery)(start, end), ...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery), ...additionalFilters]
        }
      },
      aggs: {
        timeseriesData: {
          date_histogram: (0, _metrics.getMetricsDateHistogramParams)({
            start,
            end,
            metricsInterval: config.metricsInterval
          }),
          aggs
        },
        ...aggs
      }
    }
  };
  const {
    hits,
    aggregations
  } = await apmEventClient.search(operationName, params);
  const timeseriesData = aggregations === null || aggregations === void 0 ? void 0 : aggregations.timeseriesData;
  return {
    title: chartBase.title,
    key: chartBase.key,
    yUnit: chartBase.yUnit,
    series: hits.total.value === 0 ? [] : Object.keys(chartBase.series).map((seriesKey, i) => {
      var _aggregations$seriesK; // @ts-ignore


      const overallValue = aggregations === null || aggregations === void 0 ? void 0 : (_aggregations$seriesK = aggregations[seriesKey]) === null || _aggregations$seriesK === void 0 ? void 0 : _aggregations$seriesK.value;
      return {
        title: chartBase.series[seriesKey].title,
        key: seriesKey,
        type: chartBase.type,
        color: chartBase.series[seriesKey].color || (0, _viz_colors.getVizColorForIndex)(i, _uiTheme.euiLightVars),
        overallValue,
        data: (timeseriesData === null || timeseriesData === void 0 ? void 0 : timeseriesData.buckets.map(bucket => {
          const {
            value
          } = bucket[seriesKey];
          const y = value === null || isNaN(value) ? null : value;
          return {
            x: bucket.key,
            y
          };
        })) || []
      };
    })
  };
}