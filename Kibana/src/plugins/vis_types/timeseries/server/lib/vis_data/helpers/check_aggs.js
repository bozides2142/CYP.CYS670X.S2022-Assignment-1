"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAggSupported = isAggSupported;

var _errors = require("../../../../common/errors");

var _check_ui_restrictions = require("../../../../common/check_ui_restrictions");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function isAggSupported(metrics, capabilities) {
  const metricTypes = metrics.filter(metric => !(0, _check_ui_restrictions.isMetricEnabled)(metric.type, capabilities.uiRestrictions));

  if (metricTypes.length) {
    throw new _errors.AggNotSupportedError(metricTypes.map(metric => `"${metric.type}"`).join(', '));
  }
}