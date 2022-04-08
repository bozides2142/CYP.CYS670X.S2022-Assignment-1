"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceTransactionGroupDetailedStatistics = getServiceTransactionGroupDetailedStatistics;
exports.getServiceTransactionGroupDetailedStatisticsPeriods = getServiceTransactionGroupDetailedStatisticsPeriods;

var _lodash = require("lodash");

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _event_outcome = require("../../../common/event_outcome");

var _offset_previous_period_coordinate = require("../../../common/utils/offset_previous_period_coordinate");

var _server = require("../../../../observability/server");

var _environment_query = require("../../../common/utils/environment_query");

var _transactions = require("../../lib/helpers/transactions");

var _get_bucket_size_for_aggregated_transactions = require("../../lib/helpers/get_bucket_size_for_aggregated_transactions");

var _latency_aggregation_type = require("../../lib/helpers/latency_aggregation_type");

var _transaction_error_rate = require("../../lib/helpers/transaction_error_rate");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getServiceTransactionGroupDetailedStatistics({
  environment,
  kuery,
  serviceName,
  transactionNames,
  setup,
  numBuckets,
  searchAggregatedTransactions,
  transactionType,
  latencyAggregationType,
  start,
  end
}) {
  var _response$aggregation, _response$aggregation2, _response$aggregation3;

  const {
    apmEventClient
  } = setup;
  const {
    intervalString
  } = (0, _get_bucket_size_for_aggregated_transactions.getBucketSizeForAggregatedTransactions)({
    start,
    end,
    numBuckets,
    searchAggregatedTransactions
  });
  const field = (0, _transactions.getDurationFieldForTransactions)(searchAggregatedTransactions);
  const response = await apmEventClient.search('get_service_transaction_group_detailed_statistics', {
    apm: {
      events: [(0, _transactions.getProcessorEventForTransactions)(searchAggregatedTransactions)]
    },
    body: {
      size: 0,
      query: {
        bool: {
          filter: [{
            term: {
              [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
            }
          }, {
            term: {
              [_elasticsearch_fieldnames.TRANSACTION_TYPE]: transactionType
            }
          }, ...(0, _transactions.getDocumentTypeFilterForTransactions)(searchAggregatedTransactions), ...(0, _server.rangeQuery)(start, end), ...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery)]
        }
      },
      aggs: {
        total_duration: {
          sum: {
            field
          }
        },
        transaction_groups: {
          terms: {
            field: _elasticsearch_fieldnames.TRANSACTION_NAME,
            include: transactionNames,
            size: transactionNames.length
          },
          aggs: {
            transaction_group_total_duration: {
              sum: {
                field
              }
            },
            timeseries: {
              date_histogram: {
                field: '@timestamp',
                fixed_interval: intervalString,
                min_doc_count: 0,
                extended_bounds: {
                  min: start,
                  max: end
                }
              },
              aggs: { ...(0, _latency_aggregation_type.getLatencyAggregation)(latencyAggregationType, field),
                [_elasticsearch_fieldnames.EVENT_OUTCOME]: {
                  terms: {
                    field: _elasticsearch_fieldnames.EVENT_OUTCOME,
                    include: [_event_outcome.EventOutcome.failure, _event_outcome.EventOutcome.success]
                  }
                }
              }
            }
          }
        }
      }
    }
  });
  const buckets = (_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.transaction_groups.buckets) !== null && _response$aggregation !== void 0 ? _response$aggregation : [];
  const totalDuration = (_response$aggregation3 = response.aggregations) === null || _response$aggregation3 === void 0 ? void 0 : _response$aggregation3.total_duration.value;
  return buckets.map(bucket => {
    const transactionName = bucket.key;
    const latency = bucket.timeseries.buckets.map(timeseriesBucket => ({
      x: timeseriesBucket.key,
      y: (0, _latency_aggregation_type.getLatencyValue)({
        latencyAggregationType,
        aggregation: timeseriesBucket.latency
      })
    }));
    const throughput = bucket.timeseries.buckets.map(timeseriesBucket => ({
      x: timeseriesBucket.key,
      y: timeseriesBucket.doc_count // sparklines only shows trend (no axis)

    }));
    const errorRate = bucket.timeseries.buckets.map(timeseriesBucket => ({
      x: timeseriesBucket.key,
      y: (0, _transaction_error_rate.calculateFailedTransactionRate)(timeseriesBucket[_elasticsearch_fieldnames.EVENT_OUTCOME])
    }));
    const transactionGroupTotalDuration = bucket.transaction_group_total_duration.value || 0;
    return {
      transactionName,
      latency,
      throughput,
      errorRate,
      impact: totalDuration ? transactionGroupTotalDuration * 100 / totalDuration : 0
    };
  });
}

async function getServiceTransactionGroupDetailedStatisticsPeriods({
  serviceName,
  transactionNames,
  setup,
  numBuckets,
  searchAggregatedTransactions,
  transactionType,
  latencyAggregationType,
  comparisonStart,
  comparisonEnd,
  environment,
  kuery,
  start,
  end
}) {
  const commonProps = {
    setup,
    serviceName,
    transactionNames,
    searchAggregatedTransactions,
    transactionType,
    numBuckets,
    latencyAggregationType: latencyAggregationType,
    environment,
    kuery
  };
  const currentPeriodPromise = getServiceTransactionGroupDetailedStatistics({ ...commonProps,
    start,
    end
  });
  const previousPeriodPromise = comparisonStart && comparisonEnd ? getServiceTransactionGroupDetailedStatistics({ ...commonProps,
    start: comparisonStart,
    end: comparisonEnd
  }) : [];
  const [currentPeriod, previousPeriod] = await Promise.all([currentPeriodPromise, previousPeriodPromise]);
  const firstCurrentPeriod = currentPeriod === null || currentPeriod === void 0 ? void 0 : currentPeriod[0];
  return {
    currentPeriod: (0, _lodash.keyBy)(currentPeriod, 'transactionName'),
    previousPeriod: (0, _lodash.keyBy)(previousPeriod.map(data => {
      return { ...data,
        errorRate: (0, _offset_previous_period_coordinate.offsetPreviousPeriodCoordinates)({
          currentPeriodTimeseries: firstCurrentPeriod === null || firstCurrentPeriod === void 0 ? void 0 : firstCurrentPeriod.errorRate,
          previousPeriodTimeseries: data.errorRate
        }),
        throughput: (0, _offset_previous_period_coordinate.offsetPreviousPeriodCoordinates)({
          currentPeriodTimeseries: firstCurrentPeriod === null || firstCurrentPeriod === void 0 ? void 0 : firstCurrentPeriod.throughput,
          previousPeriodTimeseries: data.throughput
        }),
        latency: (0, _offset_previous_period_coordinate.offsetPreviousPeriodCoordinates)({
          currentPeriodTimeseries: firstCurrentPeriod === null || firstCurrentPeriod === void 0 ? void 0 : firstCurrentPeriod.latency,
          previousPeriodTimeseries: data.latency
        })
      };
    }), 'transactionName')
  };
}