"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServicesItems = getServicesItems;

var _with_apm_span = require("../../../utils/with_apm_span");

var _get_health_statuses = require("./get_health_statuses");

var _get_services_from_error_and_metric_documents = require("./get_services_from_error_and_metric_documents");

var _get_service_transaction_stats = require("./get_service_transaction_stats");

var _merge_service_stats = require("./merge_service_stats");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const MAX_NUMBER_OF_SERVICES = 500;

async function getServicesItems({
  environment,
  kuery,
  setup,
  searchAggregatedTransactions,
  logger,
  start,
  end
}) {
  return (0, _with_apm_span.withApmSpan)('get_services_items', async () => {
    const params = {
      environment,
      kuery,
      setup,
      searchAggregatedTransactions,
      maxNumServices: MAX_NUMBER_OF_SERVICES,
      start,
      end
    };
    const [transactionStats, servicesFromErrorAndMetricDocuments, healthStatuses] = await Promise.all([(0, _get_service_transaction_stats.getServiceTransactionStats)(params), (0, _get_services_from_error_and_metric_documents.getServicesFromErrorAndMetricDocuments)(params), (0, _get_health_statuses.getHealthStatuses)(params).catch(err => {
      logger.error(err);
      return [];
    })]);
    return (0, _merge_service_stats.mergeServiceStats)({
      transactionStats,
      servicesFromErrorAndMetricDocuments,
      healthStatuses
    });
  });
}