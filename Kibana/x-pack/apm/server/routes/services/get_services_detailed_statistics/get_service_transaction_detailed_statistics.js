"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceTransactionDetailedStatistics = getServiceTransactionDetailedStatistics;

var _lodash = require("lodash");

var _server = require("../../../../../observability/server");

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _transaction_types = require("../../../../common/transaction_types");

var _environment_query = require("../../../../common/utils/environment_query");

var _get_offset_in_ms = require("../../../../common/utils/get_offset_in_ms");

var _transactions = require("../../../lib/helpers/transactions");

var _calculate_throughput = require("../../../lib/helpers/calculate_throughput");

var _get_bucket_size_for_aggregated_transactions = require("../../../lib/helpers/get_bucket_size_for_aggregated_transactions");

var _transaction_error_rate = require("../../../lib/helpers/transaction_error_rate");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getServiceTransactionDetailedStatistics({
  serviceNames,
  environment,
  kuery,
  setup,
  searchAggregatedTransactions,
  offset,
  start,
  end
}) {
  var _response$aggregation, _response$aggregation2;

  const {
    apmEventClient
  } = setup;
  const {
    offsetInMs,
    startWithOffset,
    endWithOffset
  } = (0, _get_offset_in_ms.getOffsetInMs)({
    start,
    end,
    offset
  });
  const outcomes = (0, _transaction_error_rate.getOutcomeAggregation)();
  const metrics = {
    avg_duration: {
      avg: {
        field: (0, _transactions.getDurationFieldForTransactions)(searchAggregatedTransactions)
      }
    },
    outcomes
  };
  const response = await apmEventClient.search('get_service_transaction_detail_stats', {
    apm: {
      events: [(0, _transactions.getProcessorEventForTransactions)(searchAggregatedTransactions)]
    },
    body: {
      size: 0,
      query: {
        bool: {
          filter: [{
            terms: {
              [_elasticsearch_fieldnames.SERVICE_NAME]: serviceNames
            }
          }, ...(0, _transactions.getDocumentTypeFilterForTransactions)(searchAggregatedTransactions), ...(0, _server.rangeQuery)(startWithOffset, endWithOffset), ...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery)]
        }
      },
      aggs: {
        services: {
          terms: {
            field: _elasticsearch_fieldnames.SERVICE_NAME
          },
          aggs: {
            transactionType: {
              terms: {
                field: _elasticsearch_fieldnames.TRANSACTION_TYPE
              },
              aggs: { ...metrics,
                timeseries: {
                  date_histogram: {
                    field: '@timestamp',
                    fixed_interval: (0, _get_bucket_size_for_aggregated_transactions.getBucketSizeForAggregatedTransactions)({
                      start: startWithOffset,
                      end: endWithOffset,
                      numBuckets: 20,
                      searchAggregatedTransactions
                    }).intervalString,
                    min_doc_count: 0,
                    extended_bounds: {
                      min: startWithOffset,
                      max: endWithOffset
                    }
                  },
                  aggs: metrics
                }
              }
            }
          }
        }
      }
    }
  });
  return (0, _lodash.keyBy)((_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.services.buckets.map(bucket => {
    var _bucket$transactionTy;

    const topTransactionTypeBucket = (_bucket$transactionTy = bucket.transactionType.buckets.find(({
      key
    }) => key === _transaction_types.TRANSACTION_REQUEST || key === _transaction_types.TRANSACTION_PAGE_LOAD)) !== null && _bucket$transactionTy !== void 0 ? _bucket$transactionTy : bucket.transactionType.buckets[0];
    return {
      serviceName: bucket.key,
      latency: topTransactionTypeBucket.timeseries.buckets.map(dateBucket => ({
        x: dateBucket.key + offsetInMs,
        y: dateBucket.avg_duration.value
      })),
      transactionErrorRate: topTransactionTypeBucket.timeseries.buckets.map(dateBucket => ({
        x: dateBucket.key + offsetInMs,
        y: (0, _transaction_error_rate.calculateFailedTransactionRate)(dateBucket.outcomes)
      })),
      throughput: topTransactionTypeBucket.timeseries.buckets.map(dateBucket => ({
        x: dateBucket.key + offsetInMs,
        y: (0, _calculate_throughput.calculateThroughput)({
          start,
          end,
          value: dateBucket.doc_count
        })
      }))
    };
  })) !== null && _response$aggregation !== void 0 ? _response$aggregation : [], 'serviceName');
}