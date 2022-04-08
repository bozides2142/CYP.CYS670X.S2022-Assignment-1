"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateFailedTransactionRate = calculateFailedTransactionRate;
exports.getFailedTransactionRateTimeSeries = getFailedTransactionRateTimeSeries;
exports.getTimeseriesAggregation = exports.getOutcomeAggregation = void 0;

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _event_outcome = require("../../../common/event_outcome");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getOutcomeAggregation = () => ({
  terms: {
    field: _elasticsearch_fieldnames.EVENT_OUTCOME,
    include: [_event_outcome.EventOutcome.failure, _event_outcome.EventOutcome.success]
  }
});

exports.getOutcomeAggregation = getOutcomeAggregation;

const getTimeseriesAggregation = (start, end, intervalString) => ({
  date_histogram: {
    field: '@timestamp',
    fixed_interval: intervalString,
    min_doc_count: 0,
    extended_bounds: {
      min: start,
      max: end
    }
  },
  aggs: {
    outcomes: getOutcomeAggregation()
  }
});

exports.getTimeseriesAggregation = getTimeseriesAggregation;

function calculateFailedTransactionRate(outcomeResponse) {
  var _outcomes$EventOutcom, _outcomes$EventOutcom2;

  const outcomes = Object.fromEntries(outcomeResponse.buckets.map(({
    key,
    doc_count: count
  }) => [key, count]));
  const failedTransactions = (_outcomes$EventOutcom = outcomes[_event_outcome.EventOutcome.failure]) !== null && _outcomes$EventOutcom !== void 0 ? _outcomes$EventOutcom : 0;
  const successfulTransactions = (_outcomes$EventOutcom2 = outcomes[_event_outcome.EventOutcome.success]) !== null && _outcomes$EventOutcom2 !== void 0 ? _outcomes$EventOutcom2 : 0;
  return failedTransactions / (successfulTransactions + failedTransactions);
}

function getFailedTransactionRateTimeSeries(buckets) {
  return buckets.map(dateBucket => {
    return {
      x: dateBucket.key,
      y: calculateFailedTransactionRate(dateBucket.outcomes)
    };
  });
}