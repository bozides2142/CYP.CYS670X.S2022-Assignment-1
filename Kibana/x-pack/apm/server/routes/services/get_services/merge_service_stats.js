"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeServiceStats = mergeServiceStats;

var _lodash = require("lodash");

var _as_mutable_array = require("../../../../common/utils/as_mutable_array");

var _join_by_key = require("../../../../common/utils/join_by_key");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function mergeServiceStats({
  transactionStats,
  servicesFromErrorAndMetricDocuments,
  healthStatuses
}) {
  const foundServiceNames = transactionStats.map(({
    serviceName
  }) => serviceName);
  const servicesWithOnlyMetricDocuments = servicesFromErrorAndMetricDocuments.filter(({
    serviceName
  }) => !foundServiceNames.includes(serviceName));
  const allServiceNames = foundServiceNames.concat(servicesWithOnlyMetricDocuments.map(({
    serviceName
  }) => serviceName)); // make sure to exclude health statuses from services
  // that are not found in APM data

  const matchedHealthStatuses = healthStatuses.filter(({
    serviceName
  }) => allServiceNames.includes(serviceName));
  return (0, _join_by_key.joinByKey)((0, _as_mutable_array.asMutableArray)([...transactionStats, ...servicesFromErrorAndMetricDocuments, ...matchedHealthStatuses]), 'serviceName', function merge(a, b) {
    const aEnvs = 'environments' in a ? a.environments : [];
    const bEnvs = 'environments' in b ? b.environments : [];
    return { ...a,
      ...b,
      environments: (0, _lodash.uniq)(aEnvs.concat(bEnvs))
    };
  });
}