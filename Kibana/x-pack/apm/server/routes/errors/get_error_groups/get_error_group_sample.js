"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getErrorGroupSample = getErrorGroupSample;

var _as_mutable_array = require("../../../../common/utils/as_mutable_array");

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _processor_event = require("../../../../common/processor_event");

var _server = require("../../../../../observability/server");

var _environment_query = require("../../../../common/utils/environment_query");

var _get_transaction = require("../../transactions/get_transaction");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getErrorGroupSample({
  environment,
  kuery,
  serviceName,
  groupId,
  setup,
  start,
  end
}) {
  var _resp$hits$hits$, _error$transaction, _error$trace;

  const {
    apmEventClient
  } = setup;
  const params = {
    apm: {
      events: [_processor_event.ProcessorEvent.error]
    },
    body: {
      size: 1,
      query: {
        bool: {
          filter: [{
            term: {
              [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
            }
          }, {
            term: {
              [_elasticsearch_fieldnames.ERROR_GROUP_ID]: groupId
            }
          }, ...(0, _server.rangeQuery)(start, end), ...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery)],
          should: [{
            term: {
              [_elasticsearch_fieldnames.TRANSACTION_SAMPLED]: true
            }
          }]
        }
      },
      sort: (0, _as_mutable_array.asMutableArray)([{
        _score: {
          order: 'desc'
        }
      }, // sort by _score first to ensure that errors with transaction.sampled:true ends up on top
      {
        '@timestamp': {
          order: 'desc'
        }
      } // sort by timestamp to get the most recent error
      ])
    }
  };
  const resp = await apmEventClient.search('get_error_group_sample', params);
  const error = (_resp$hits$hits$ = resp.hits.hits[0]) === null || _resp$hits$hits$ === void 0 ? void 0 : _resp$hits$hits$._source;
  const transactionId = error === null || error === void 0 ? void 0 : (_error$transaction = error.transaction) === null || _error$transaction === void 0 ? void 0 : _error$transaction.id;
  const traceId = error === null || error === void 0 ? void 0 : (_error$trace = error.trace) === null || _error$trace === void 0 ? void 0 : _error$trace.id;
  let transaction;

  if (transactionId && traceId) {
    transaction = await (0, _get_transaction.getTransaction)({
      transactionId,
      traceId,
      setup,
      start,
      end
    });
  }

  return {
    transaction,
    error,
    occurrencesCount: resp.hits.total.value
  };
}