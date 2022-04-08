"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchTransactionDurationCorrelationWithHistogram = fetchTransactionDurationCorrelationWithHistogram;

var _constants = require("../../../../common/correlations/constants");

var _query_correlation = require("./query_correlation");

var _query_ranges = require("./query_ranges");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function fetchTransactionDurationCorrelationWithHistogram(esClient, params, expectations, ranges, fractions, histogramRangeSteps, totalDocCount, fieldValuePair) {
  const {
    correlation,
    ksTest
  } = await (0, _query_correlation.fetchTransactionDurationCorrelation)(esClient, params, expectations, ranges, fractions, totalDocCount, [fieldValuePair]);

  if (correlation !== null && correlation > _constants.CORRELATION_THRESHOLD && ksTest !== null && ksTest < _constants.KS_TEST_THRESHOLD) {
    const logHistogram = await (0, _query_ranges.fetchTransactionDurationRanges)(esClient, params, histogramRangeSteps, [fieldValuePair]);
    return { ...fieldValuePair,
      correlation,
      ksTest,
      histogram: logHistogram
    };
  }
}