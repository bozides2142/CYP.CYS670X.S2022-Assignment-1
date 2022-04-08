"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMetricsEntitiesClient = void 0;

var _error_with_status_code = require("../../error_with_status_code");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getMetricsEntitiesClient = context => {
  var _context$metricsEntit;

  const metricsEntities = (_context$metricsEntit = context.metricsEntities) === null || _context$metricsEntit === void 0 ? void 0 : _context$metricsEntit.getMetricsEntitiesClient();

  if (metricsEntities == null) {
    throw new _error_with_status_code.ErrorWithStatusCode('Metrics Entities is not found as a plugin', 404);
  } else {
    return metricsEntities;
  }
};

exports.getMetricsEntitiesClient = getMetricsEntitiesClient;