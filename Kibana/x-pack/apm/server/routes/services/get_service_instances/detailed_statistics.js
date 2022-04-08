"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceInstancesDetailedStatisticsPeriods = getServiceInstancesDetailedStatisticsPeriods;

var _lodash = require("lodash");

var _offset_previous_period_coordinate = require("../../../../common/utils/offset_previous_period_coordinate");

var _join_by_key = require("../../../../common/utils/join_by_key");

var _with_apm_span = require("../../../utils/with_apm_span");

var _get_service_instances_system_metric_statistics = require("./get_service_instances_system_metric_statistics");

var _get_service_instances_transaction_statistics = require("./get_service_instances_transaction_statistics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getServiceInstancesDetailedStatistics(params) {
  return (0, _with_apm_span.withApmSpan)('get_service_instances_detailed_statistics', async () => {
    const [transactionStats, systemMetricStats = []] = await Promise.all([(0, _get_service_instances_transaction_statistics.getServiceInstancesTransactionStatistics)({ ...params,
      isComparisonSearch: true
    }), (0, _get_service_instances_system_metric_statistics.getServiceInstancesSystemMetricStatistics)({ ...params,
      isComparisonSearch: true
    })]);
    const stats = (0, _join_by_key.joinByKey)([...transactionStats, ...systemMetricStats], 'serviceNodeName');
    return stats;
  });
}

async function getServiceInstancesDetailedStatisticsPeriods({
  environment,
  kuery,
  latencyAggregationType,
  setup,
  serviceName,
  transactionType,
  searchAggregatedTransactions,
  numBuckets,
  serviceNodeIds,
  comparisonStart,
  comparisonEnd,
  start,
  end
}) {
  return (0, _with_apm_span.withApmSpan)('get_service_instances_detailed_statistics_periods', async () => {
    const commonParams = {
      environment,
      kuery,
      latencyAggregationType,
      setup,
      serviceName,
      transactionType,
      searchAggregatedTransactions,
      numBuckets,
      serviceNodeIds
    };
    const currentPeriodPromise = getServiceInstancesDetailedStatistics({ ...commonParams,
      start,
      end
    });
    const previousPeriodPromise = comparisonStart && comparisonEnd ? getServiceInstancesDetailedStatistics({ ...commonParams,
      start: comparisonStart,
      end: comparisonEnd
    }) : [];
    const [currentPeriod, previousPeriod] = await Promise.all([currentPeriodPromise, previousPeriodPromise]);
    const firstCurrentPeriod = currentPeriod === null || currentPeriod === void 0 ? void 0 : currentPeriod[0];
    return {
      currentPeriod: (0, _lodash.keyBy)(currentPeriod, 'serviceNodeName'),
      previousPeriod: (0, _lodash.keyBy)(previousPeriod.map(data => {
        return { ...data,
          cpuUsage: (0, _offset_previous_period_coordinate.offsetPreviousPeriodCoordinates)({
            currentPeriodTimeseries: firstCurrentPeriod === null || firstCurrentPeriod === void 0 ? void 0 : firstCurrentPeriod.cpuUsage,
            previousPeriodTimeseries: data.cpuUsage
          }),
          errorRate: (0, _offset_previous_period_coordinate.offsetPreviousPeriodCoordinates)({
            currentPeriodTimeseries: firstCurrentPeriod === null || firstCurrentPeriod === void 0 ? void 0 : firstCurrentPeriod.errorRate,
            previousPeriodTimeseries: data.errorRate
          }),
          latency: (0, _offset_previous_period_coordinate.offsetPreviousPeriodCoordinates)({
            currentPeriodTimeseries: firstCurrentPeriod === null || firstCurrentPeriod === void 0 ? void 0 : firstCurrentPeriod.latency,
            previousPeriodTimeseries: data.latency
          }),
          memoryUsage: (0, _offset_previous_period_coordinate.offsetPreviousPeriodCoordinates)({
            currentPeriodTimeseries: firstCurrentPeriod === null || firstCurrentPeriod === void 0 ? void 0 : firstCurrentPeriod.memoryUsage,
            previousPeriodTimeseries: data.memoryUsage
          }),
          throughput: (0, _offset_previous_period_coordinate.offsetPreviousPeriodCoordinates)({
            currentPeriodTimeseries: firstCurrentPeriod === null || firstCurrentPeriod === void 0 ? void 0 : firstCurrentPeriod.throughput,
            previousPeriodTimeseries: data.throughput
          })
        };
      }), 'serviceNodeName')
    };
  });
}