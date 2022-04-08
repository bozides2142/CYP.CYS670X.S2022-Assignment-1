"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getColdstartRate = getColdstartRate;
exports.getColdstartRatePeriods = getColdstartRatePeriods;

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _offset_previous_period_coordinate = require("../../../common/utils/offset_previous_period_coordinate");

var _server = require("../../../../observability/server");

var _environment_query = require("../../../common/utils/environment_query");

var _transactions = require("../helpers/transactions");

var _get_bucket_size_for_aggregated_transactions = require("../helpers/get_bucket_size_for_aggregated_transactions");

var _transaction_coldstart_rate = require("../helpers/transaction_coldstart_rate");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getColdstartRate({
  environment,
  kuery,
  serviceName,
  transactionType,
  transactionName,
  setup,
  searchAggregatedTransactions,
  start,
  end
}) {
  const {
    apmEventClient
  } = setup;
  const filter = [...(0, _server.termQuery)(_elasticsearch_fieldnames.SERVICE_NAME, serviceName), {
    exists: {
      field: _elasticsearch_fieldnames.FAAS_COLDSTART
    }
  }, ...(transactionName ? (0, _server.termQuery)(_elasticsearch_fieldnames.TRANSACTION_NAME, transactionName) : []), ...(0, _server.termQuery)(_elasticsearch_fieldnames.TRANSACTION_TYPE, transactionType), ...(0, _transactions.getDocumentTypeFilterForTransactions)(searchAggregatedTransactions), ...(0, _server.rangeQuery)(start, end), ...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery)];
  const coldstartStates = (0, _transaction_coldstart_rate.getColdstartAggregation)();
  const params = {
    apm: {
      events: [(0, _transactions.getProcessorEventForTransactions)(searchAggregatedTransactions)]
    },
    body: {
      size: 0,
      query: {
        bool: {
          filter
        }
      },
      aggs: {
        coldstartStates,
        timeseries: {
          date_histogram: {
            field: '@timestamp',
            fixed_interval: (0, _get_bucket_size_for_aggregated_transactions.getBucketSizeForAggregatedTransactions)({
              start,
              end,
              searchAggregatedTransactions
            }).intervalString,
            min_doc_count: 0,
            extended_bounds: {
              min: start,
              max: end
            }
          },
          aggs: {
            coldstartStates
          }
        }
      }
    }
  };
  const resp = await apmEventClient.search('get_transaction_group_coldstart_rate', params);

  if (!resp.aggregations) {
    return {
      transactionColdstartRate: [],
      average: null
    };
  }

  const transactionColdstartRate = (0, _transaction_coldstart_rate.getTransactionColdstartRateTimeSeries)(resp.aggregations.timeseries.buckets);
  const average = (0, _transaction_coldstart_rate.calculateTransactionColdstartRate)(resp.aggregations.coldstartStates);
  return {
    transactionColdstartRate,
    average
  };
}

async function getColdstartRatePeriods({
  environment,
  kuery,
  serviceName,
  transactionType,
  transactionName = '',
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
  const currentPeriodPromise = getColdstartRate({ ...commonProps,
    start,
    end
  });
  const previousPeriodPromise = comparisonStart && comparisonEnd ? getColdstartRate({ ...commonProps,
    start: comparisonStart,
    end: comparisonEnd
  }) : {
    transactionColdstartRate: [],
    average: null
  };
  const [currentPeriod, previousPeriod] = await Promise.all([currentPeriodPromise, previousPeriodPromise]);
  const firstCurrentPeriod = currentPeriod.transactionColdstartRate;
  return {
    currentPeriod,
    previousPeriod: { ...previousPeriod,
      transactionColdstartRate: (0, _offset_previous_period_coordinate.offsetPreviousPeriodCoordinates)({
        currentPeriodTimeseries: firstCurrentPeriod,
        previousPeriodTimeseries: previousPeriod.transactionColdstartRate
      })
    }
  };
}