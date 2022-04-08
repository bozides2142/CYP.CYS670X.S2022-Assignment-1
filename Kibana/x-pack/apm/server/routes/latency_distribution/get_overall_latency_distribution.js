"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOverallLatencyDistribution = getOverallLatencyDistribution;

var _processor_event = require("../../../common/processor_event");

var _with_apm_span = require("../../utils/with_apm_span");

var _query_histogram_range_steps = require("../correlations/queries/query_histogram_range_steps");

var _query_ranges = require("../correlations/queries/query_ranges");

var _get_percentile_threshold_value = require("./get_percentile_threshold_value");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getOverallLatencyDistribution(options) {
  return (0, _with_apm_span.withApmSpan)('get_overall_latency_distribution', async () => {
    const overallLatencyDistribution = {};
    const {
      setup,
      termFilters,
      ...rawParams
    } = options;
    const {
      apmEventClient
    } = setup;
    const params = {
      // pass on an empty index because we're using only the body attribute
      // of the request body getters we're reusing from search strategies.
      index: '',
      ...rawParams
    }; // #1: get 95th percentile to be displayed as a marker in the log log chart

    overallLatencyDistribution.percentileThresholdValue = await (0, _get_percentile_threshold_value.getPercentileThresholdValue)(options); // finish early if we weren't able to identify the percentileThresholdValue.

    if (!overallLatencyDistribution.percentileThresholdValue) {
      return overallLatencyDistribution;
    } // #2: get histogram range steps


    const steps = 100;
    const {
      body: histogramIntervalRequestBody
    } = (0, _query_histogram_range_steps.getHistogramIntervalRequest)(params);
    const histogramIntervalResponse = await apmEventClient.search('get_histogram_interval', {
      // TODO: add support for metrics
      apm: {
        events: [_processor_event.ProcessorEvent.transaction]
      },
      body: histogramIntervalRequestBody
    });

    if (!histogramIntervalResponse.aggregations || histogramIntervalResponse.hits.total.value === 0) {
      return overallLatencyDistribution;
    }

    const min = histogramIntervalResponse.aggregations.transaction_duration_min.value;
    const max = histogramIntervalResponse.aggregations.transaction_duration_max.value * 2;
    const histogramRangeSteps = (0, _query_histogram_range_steps.getHistogramRangeSteps)(min, max, steps); // #3: get histogram chart data

    const {
      body: transactionDurationRangesRequestBody
    } = (0, _query_ranges.getTransactionDurationRangesRequest)(params, histogramRangeSteps, termFilters);
    const transactionDurationRangesResponse = await apmEventClient.search('get_transaction_duration_ranges', {
      // TODO: add support for metrics
      apm: {
        events: [_processor_event.ProcessorEvent.transaction]
      },
      body: transactionDurationRangesRequestBody
    });

    if (!transactionDurationRangesResponse.aggregations) {
      return overallLatencyDistribution;
    }

    overallLatencyDistribution.overallHistogram = transactionDurationRangesResponse.aggregations.logspace_ranges.buckets.map(d => ({
      key: d.from,
      doc_count: d.doc_count
    })).filter(d => d.key !== undefined);
    return overallLatencyDistribution;
  });
}