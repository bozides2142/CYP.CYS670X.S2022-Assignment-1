"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFailedTransactionRatePeriods = getFailedTransactionRatePeriods;

var _get_failed_transaction_rate = require("../../lib/transaction_groups/get_failed_transaction_rate");

var _offset_previous_period_coordinate = require("../../../common/utils/offset_previous_period_coordinate");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getFailedTransactionRatePeriods({
  environment,
  kuery,
  serviceName,
  transactionType,
  transactionName,
  setup,
  searchAggregatedTransactions,
  comparisonStart,
  comparisonEnd,
  start,
  end
}) {
  const commonProps = {
    environment,
    kuery,
    serviceName,
    transactionType,
    transactionName,
    setup,
    searchAggregatedTransactions
  };
  const currentPeriodPromise = (0, _get_failed_transaction_rate.getFailedTransactionRate)({ ...commonProps,
    start,
    end
  });
  const previousPeriodPromise = comparisonStart && comparisonEnd ? (0, _get_failed_transaction_rate.getFailedTransactionRate)({ ...commonProps,
    start: comparisonStart,
    end: comparisonEnd
  }) : {
    timeseries: [],
    average: null
  };
  const [currentPeriod, previousPeriod] = await Promise.all([currentPeriodPromise, previousPeriodPromise]);
  const currentPeriodTimeseries = currentPeriod.timeseries;
  return {
    currentPeriod,
    previousPeriod: { ...previousPeriod,
      timeseries: (0, _offset_previous_period_coordinate.offsetPreviousPeriodCoordinates)({
        currentPeriodTimeseries,
        previousPeriodTimeseries: previousPeriod.timeseries
      })
    }
  };
}