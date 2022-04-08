"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchSignificantCorrelations = void 0;

var _lodash = require("lodash");

var _utils = require("../utils");

var _index = require("./index");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const fetchSignificantCorrelations = async (esClient, paramsWithIndex, fieldValuePairs) => {
  // Create an array of ranges [2, 4, 6, ..., 98]
  const percentileAggregationPercents = (0, _lodash.range)(2, 100, 2);
  const {
    percentiles: percentilesRecords
  } = await (0, _index.fetchTransactionDurationPercentiles)(esClient, paramsWithIndex, percentileAggregationPercents); // We need to round the percentiles values
  // because the queries we're using based on it
  // later on wouldn't allow numbers with decimals.

  const percentiles = Object.values(percentilesRecords).map(Math.round);
  const {
    expectations,
    ranges
  } = (0, _utils.computeExpectationsAndRanges)(percentiles);
  const {
    fractions,
    totalDocCount
  } = await (0, _index.fetchTransactionDurationFractions)(esClient, paramsWithIndex, ranges);
  const histogramRangeSteps = await (0, _index.fetchTransactionDurationHistogramRangeSteps)(esClient, paramsWithIndex);
  const {
    fulfilled,
    rejected
  } = (0, _utils.splitAllSettledPromises)(await Promise.allSettled(fieldValuePairs.map(fieldValuePair => (0, _index.fetchTransactionDurationCorrelationWithHistogram)(esClient, paramsWithIndex, expectations, ranges, fractions, histogramRangeSteps, totalDocCount, fieldValuePair))));
  const latencyCorrelations = fulfilled.filter(d => d !== undefined);
  const ccsWarning = rejected.length > 0 && (paramsWithIndex === null || paramsWithIndex === void 0 ? void 0 : paramsWithIndex.index.includes(':'));
  return {
    latencyCorrelations,
    ccsWarning,
    totalDocCount
  };
};

exports.fetchSignificantCorrelations = fetchSignificantCorrelations;