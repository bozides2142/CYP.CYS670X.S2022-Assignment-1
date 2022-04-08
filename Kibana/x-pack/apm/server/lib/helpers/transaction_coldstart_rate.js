"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateTransactionColdstartRate = calculateTransactionColdstartRate;
exports.getTimeseriesAggregation = exports.getColdstartAggregation = void 0;
exports.getTransactionColdstartRateTimeSeries = getTransactionColdstartRateTimeSeries;

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getColdstartAggregation = () => ({
  terms: {
    field: _elasticsearch_fieldnames.FAAS_COLDSTART
  }
});

exports.getColdstartAggregation = getColdstartAggregation;

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
    coldstartStates: getColdstartAggregation()
  }
});

exports.getTimeseriesAggregation = getTimeseriesAggregation;

function calculateTransactionColdstartRate(coldstartStatesResponse) {
  var _coldstartStates$true, _coldstartStates$fals;

  const coldstartStates = Object.fromEntries(coldstartStatesResponse.buckets.map(({
    key,
    doc_count: count
  }) => [key === 1 ? 'true' : 'false', count]));
  const coldstarts = (_coldstartStates$true = coldstartStates.true) !== null && _coldstartStates$true !== void 0 ? _coldstartStates$true : 0;
  const warmstarts = (_coldstartStates$fals = coldstartStates.false) !== null && _coldstartStates$fals !== void 0 ? _coldstartStates$fals : 0;
  return coldstarts / (coldstarts + warmstarts);
}

function getTransactionColdstartRateTimeSeries(buckets) {
  return buckets.map(dateBucket => {
    return {
      x: dateBucket.key,
      y: calculateTransactionColdstartRate(dateBucket.coldstartStates)
    };
  });
}