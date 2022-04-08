"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServicesDetailedStatistics = getServicesDetailedStatistics;

var _with_apm_span = require("../../../utils/with_apm_span");

var _get_service_transaction_detailed_statistics = require("./get_service_transaction_detailed_statistics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getServicesDetailedStatistics({
  serviceNames,
  environment,
  kuery,
  setup,
  searchAggregatedTransactions,
  offset,
  start,
  end
}) {
  return (0, _with_apm_span.withApmSpan)('get_service_detailed_statistics', async () => {
    const commonProps = {
      serviceNames,
      environment,
      kuery,
      setup,
      searchAggregatedTransactions,
      start,
      end
    };
    const [currentPeriod, previousPeriod] = await Promise.all([(0, _get_service_transaction_detailed_statistics.getServiceTransactionDetailedStatistics)(commonProps), offset ? (0, _get_service_transaction_detailed_statistics.getServiceTransactionDetailedStatistics)({ ...commonProps,
      offset
    }) : Promise.resolve({})]);
    return {
      currentPeriod,
      previousPeriod
    };
  });
}