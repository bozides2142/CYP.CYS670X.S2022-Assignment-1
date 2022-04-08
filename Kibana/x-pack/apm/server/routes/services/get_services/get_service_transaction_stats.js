"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceTransactionStats = getServiceTransactionStats;

var _server = require("../../../../../observability/server");

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _transaction_types = require("../../../../common/transaction_types");

var _environment_query = require("../../../../common/utils/environment_query");

var _transactions = require("../../../lib/helpers/transactions");

var _calculate_throughput = require("../../../lib/helpers/calculate_throughput");

var _transaction_error_rate = require("../../../lib/helpers/transaction_error_rate");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getServiceTransactionStats({
  environment,
  kuery,
  setup,
  searchAggregatedTransactions,
  maxNumServices,
  start,
  end
}) {
  var _response$aggregation, _response$aggregation2;

  const {
    apmEventClient
  } = setup;
  const outcomes = (0, _transaction_error_rate.getOutcomeAggregation)();
  const metrics = {
    avg_duration: {
      avg: {
        field: (0, _transactions.getDurationFieldForTransactions)(searchAggregatedTransactions)
      }
    },
    outcomes
  };
  const response = await apmEventClient.search('get_service_transaction_stats', {
    apm: {
      events: [(0, _transactions.getProcessorEventForTransactions)(searchAggregatedTransactions)]
    },
    body: {
      size: 0,
      query: {
        bool: {
          filter: [...(0, _transactions.getDocumentTypeFilterForTransactions)(searchAggregatedTransactions), ...(0, _server.rangeQuery)(start, end), ...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery)]
        }
      },
      aggs: {
        services: {
          terms: {
            field: _elasticsearch_fieldnames.SERVICE_NAME,
            size: maxNumServices
          },
          aggs: {
            transactionType: {
              terms: {
                field: _elasticsearch_fieldnames.TRANSACTION_TYPE
              },
              aggs: { ...metrics,
                environments: {
                  terms: {
                    field: _elasticsearch_fieldnames.SERVICE_ENVIRONMENT
                  }
                },
                sample: {
                  top_metrics: {
                    metrics: [{
                      field: _elasticsearch_fieldnames.AGENT_NAME
                    }],
                    sort: {
                      '@timestamp': 'desc'
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });
  return (_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.services.buckets.map(bucket => {
    var _bucket$transactionTy;

    const topTransactionTypeBucket = (_bucket$transactionTy = bucket.transactionType.buckets.find(({
      key
    }) => key === _transaction_types.TRANSACTION_REQUEST || key === _transaction_types.TRANSACTION_PAGE_LOAD)) !== null && _bucket$transactionTy !== void 0 ? _bucket$transactionTy : bucket.transactionType.buckets[0];
    return {
      serviceName: bucket.key,
      transactionType: topTransactionTypeBucket.key,
      environments: topTransactionTypeBucket.environments.buckets.map(environmentBucket => environmentBucket.key),
      agentName: topTransactionTypeBucket.sample.top[0].metrics[_elasticsearch_fieldnames.AGENT_NAME],
      latency: topTransactionTypeBucket.avg_duration.value,
      transactionErrorRate: (0, _transaction_error_rate.calculateFailedTransactionRate)(topTransactionTypeBucket.outcomes),
      throughput: (0, _calculate_throughput.calculateThroughput)({
        start,
        end,
        value: topTransactionTypeBucket.doc_count
      })
    };
  })) !== null && _response$aggregation !== void 0 ? _response$aggregation : [];
}