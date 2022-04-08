"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTransactionErrorCountChartPreview = getTransactionErrorCountChartPreview;

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _processor_event = require("../../../../common/processor_event");

var _server = require("../../../../../observability/server");

var _environment_query = require("../../../../common/utils/environment_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getTransactionErrorCountChartPreview({
  setup,
  alertParams
}) {
  const {
    apmEventClient
  } = setup;
  const {
    serviceName,
    environment,
    interval,
    start,
    end
  } = alertParams;
  const query = {
    bool: {
      filter: [...(0, _server.termQuery)(_elasticsearch_fieldnames.SERVICE_NAME, serviceName), ...(0, _server.rangeQuery)(start, end), ...(0, _environment_query.environmentQuery)(environment)]
    }
  };
  const aggs = {
    timeseries: {
      date_histogram: {
        field: '@timestamp',
        fixed_interval: interval,
        extended_bounds: {
          min: start,
          max: end
        }
      }
    }
  };
  const params = {
    apm: {
      events: [_processor_event.ProcessorEvent.error]
    },
    body: {
      size: 0,
      query,
      aggs
    }
  };
  const resp = await apmEventClient.search('get_transaction_error_count_chart_preview', params);

  if (!resp.aggregations) {
    return [];
  }

  return resp.aggregations.timeseries.buckets.map(bucket => {
    return {
      x: bucket.key,
      y: bucket.doc_count
    };
  });
}