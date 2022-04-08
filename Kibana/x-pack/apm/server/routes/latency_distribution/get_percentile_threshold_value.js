"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPercentileThresholdValue = getPercentileThresholdValue;

var _processor_event = require("../../../common/processor_event");

var _query_percentiles = require("../correlations/queries/query_percentiles");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getPercentileThresholdValue(options) {
  var _transactionDurationP, _transactionDurationP2;

  const {
    setup,
    percentileThreshold,
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
  };
  const {
    body: transactionDurationPercentilesRequestBody
  } = (0, _query_percentiles.getTransactionDurationPercentilesRequest)(params, [percentileThreshold]);
  const transactionDurationPercentilesResponse = await apmEventClient.search('get_transaction_duration_percentiles', {
    // TODO: add support for metrics
    apm: {
      events: [_processor_event.ProcessorEvent.transaction]
    },
    body: transactionDurationPercentilesRequestBody
  });

  if (!transactionDurationPercentilesResponse.aggregations) {
    return;
  }

  const percentilesResponseThresholds = (_transactionDurationP = (_transactionDurationP2 = transactionDurationPercentilesResponse.aggregations.transaction_duration_percentiles) === null || _transactionDurationP2 === void 0 ? void 0 : _transactionDurationP2.values) !== null && _transactionDurationP !== void 0 ? _transactionDurationP : {};
  return percentilesResponseThresholds[`${percentileThreshold}.0`];
}