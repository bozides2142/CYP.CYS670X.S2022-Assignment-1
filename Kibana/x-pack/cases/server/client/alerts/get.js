"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAlerts = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getAlerts = async (alertsInfo, clientArgs) => {
  const {
    alertsService
  } = clientArgs;

  if (alertsInfo.length === 0) {
    return [];
  }

  const alerts = await alertsService.getAlerts(alertsInfo);

  if (!alerts) {
    return [];
  }

  return alerts.docs.map(alert => ({
    id: alert._id,
    index: alert._index,
    ...alert._source
  }));
};

exports.getAlerts = getAlerts;