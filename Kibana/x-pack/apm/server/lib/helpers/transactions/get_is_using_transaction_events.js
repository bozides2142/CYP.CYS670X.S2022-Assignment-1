"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIsUsingTransactionEvents = getIsUsingTransactionEvents;

var _ = require(".");

var _aggregated_transactions = require("../../../../common/aggregated_transactions");

var _server = require("../../../../../observability/server");

var _processor_event = require("../../../../common/processor_event");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getIsUsingTransactionEvents({
  setup: {
    config,
    apmEventClient
  },
  kuery,
  start,
  end
}) {
  const searchAggregatedTransactions = config.searchAggregatedTransactions;

  if (searchAggregatedTransactions === _aggregated_transactions.SearchAggregatedTransactionSetting.never) {
    return false;
  }

  if (!kuery && searchAggregatedTransactions === _aggregated_transactions.SearchAggregatedTransactionSetting.always) {
    return false;
  }

  const searchesAggregatedTransactions = await (0, _.getSearchAggregatedTransactions)({
    config,
    start,
    end,
    apmEventClient,
    kuery
  });

  if (!searchesAggregatedTransactions) {
    // if no aggregrated transactions, check if any transactions at all
    return await getHasTransactions({
      start,
      end,
      apmEventClient,
      kuery
    });
  }

  return false;
}

async function getHasTransactions({
  start,
  end,
  apmEventClient,
  kuery
}) {
  const response = await apmEventClient.search('get_has_transactions', {
    apm: {
      events: [_processor_event.ProcessorEvent.transaction]
    },
    body: {
      query: {
        bool: {
          filter: [...(start && end ? (0, _server.rangeQuery)(start, end) : []), ...(0, _server.kqlQuery)(kuery)]
        }
      }
    },
    terminate_after: 1
  });
  return response.hits.total.value > 0;
}