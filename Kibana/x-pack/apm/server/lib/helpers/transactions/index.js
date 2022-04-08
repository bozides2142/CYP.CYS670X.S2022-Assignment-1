"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDocumentTypeFilterForTransactions = getDocumentTypeFilterForTransactions;
exports.getDurationFieldForTransactions = getDurationFieldForTransactions;
exports.getHasAggregatedTransactions = getHasAggregatedTransactions;
exports.getProcessorEventForTransactions = getProcessorEventForTransactions;
exports.getSearchAggregatedTransactions = getSearchAggregatedTransactions;

var _aggregated_transactions = require("../../../../common/aggregated_transactions");

var _server = require("../../../../../observability/server");

var _processor_event = require("../../../../common/processor_event");

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getHasAggregatedTransactions({
  start,
  end,
  apmEventClient,
  kuery
}) {
  const response = await apmEventClient.search('get_has_aggregated_transactions', {
    apm: {
      events: [_processor_event.ProcessorEvent.metric]
    },
    body: {
      query: {
        bool: {
          filter: [{
            exists: {
              field: _elasticsearch_fieldnames.TRANSACTION_DURATION_HISTOGRAM
            }
          }, ...(start && end ? (0, _server.rangeQuery)(start, end) : []), ...(0, _server.kqlQuery)(kuery)]
        }
      }
    },
    terminate_after: 1
  });
  return response.hits.total.value > 0;
}

async function getSearchAggregatedTransactions({
  config,
  start,
  end,
  apmEventClient,
  kuery
}) {
  switch (config.searchAggregatedTransactions) {
    case _aggregated_transactions.SearchAggregatedTransactionSetting.always:
      return kuery ? getHasAggregatedTransactions({
        start,
        end,
        apmEventClient,
        kuery
      }) : true;

    case _aggregated_transactions.SearchAggregatedTransactionSetting.auto:
      return getHasAggregatedTransactions({
        start,
        end,
        apmEventClient,
        kuery
      });

    case _aggregated_transactions.SearchAggregatedTransactionSetting.never:
      return false;
  }
}

function getDurationFieldForTransactions(searchAggregatedTransactions) {
  return searchAggregatedTransactions ? _elasticsearch_fieldnames.TRANSACTION_DURATION_HISTOGRAM : _elasticsearch_fieldnames.TRANSACTION_DURATION;
}

function getDocumentTypeFilterForTransactions(searchAggregatedTransactions) {
  return searchAggregatedTransactions ? [{
    exists: {
      field: _elasticsearch_fieldnames.TRANSACTION_DURATION_HISTOGRAM
    }
  }] : [];
}

function getProcessorEventForTransactions(searchAggregatedTransactions) {
  return searchAggregatedTransactions ? _processor_event.ProcessorEvent.metric : _processor_event.ProcessorEvent.transaction;
}