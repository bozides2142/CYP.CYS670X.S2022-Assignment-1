"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTransactionTraceSamples = getTransactionTraceSamples;

var _get_trace_samples = require("./get_trace_samples");

var _with_apm_span = require("../../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getTransactionTraceSamples({
  kuery,
  environment,
  serviceName,
  transactionName,
  transactionType,
  transactionId,
  traceId,
  sampleRangeFrom,
  sampleRangeTo,
  setup,
  start,
  end
}) {
  return (0, _with_apm_span.withApmSpan)('get_transaction_trace_samples', async () => {
    return await (0, _get_trace_samples.getTraceSamples)({
      environment,
      kuery,
      serviceName,
      transactionName,
      transactionType,
      transactionId,
      traceId,
      sampleRangeFrom,
      sampleRangeTo,
      setup,
      start,
      end
    });
  });
}