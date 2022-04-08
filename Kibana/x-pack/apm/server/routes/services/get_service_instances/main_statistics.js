"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceInstancesMainStatistics = getServiceInstancesMainStatistics;

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


async function getServiceInstancesMainStatistics(params) {
  return (0, _with_apm_span.withApmSpan)('get_service_instances_main_statistics', async () => {
    const paramsForSubQueries = { ...params,
      size: 50
    };
    const [transactionStats, systemMetricStats] = await Promise.all([(0, _get_service_instances_transaction_statistics.getServiceInstancesTransactionStatistics)({ ...paramsForSubQueries,
      isComparisonSearch: false
    }), (0, _get_service_instances_system_metric_statistics.getServiceInstancesSystemMetricStatistics)({ ...paramsForSubQueries,
      isComparisonSearch: false
    })]);
    const stats = (0, _join_by_key.joinByKey)([...transactionStats, ...systemMetricStats], 'serviceNodeName');
    return stats;
  });
}