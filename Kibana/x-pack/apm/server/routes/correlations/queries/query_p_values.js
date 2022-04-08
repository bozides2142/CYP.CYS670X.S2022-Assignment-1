"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchPValues = void 0;

var _constants = require("../../../../common/correlations/constants");

var _utils = require("../utils");

var _index = require("./index");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const fetchPValues = async (esClient, paramsWithIndex, fieldCandidates) => {
  const histogramRangeSteps = await (0, _index.fetchTransactionDurationHistogramRangeSteps)(esClient, paramsWithIndex);
  const {
    fulfilled,
    rejected
  } = (0, _utils.splitAllSettledPromises)(await Promise.allSettled(fieldCandidates.map(fieldName => (0, _index.fetchFailedTransactionsCorrelationPValues)(esClient, paramsWithIndex, histogramRangeSteps, fieldName))));
  const failedTransactionsCorrelations = fulfilled.flat().filter(record => record && typeof record.pValue === 'number' && record.pValue < _constants.ERROR_CORRELATION_THRESHOLD);
  const ccsWarning = rejected.length > 0 && (paramsWithIndex === null || paramsWithIndex === void 0 ? void 0 : paramsWithIndex.index.includes(':'));
  return {
    failedTransactionsCorrelations,
    ccsWarning
  };
};

exports.fetchPValues = fetchPValues;