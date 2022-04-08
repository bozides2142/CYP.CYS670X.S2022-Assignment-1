"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPluginStatus$ = void 0;

var _operators = require("rxjs/operators");

var _server = require("../../../../src/core/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getPluginStatus$ = (license$, stop$) => {
  return license$.pipe((0, _operators.startWith)(undefined), (0, _operators.takeUntil)(stop$), (0, _operators.map)(license => {
    if (license) {
      if (license.error) {
        return {
          level: _server.ServiceStatusLevels.unavailable,
          summary: 'Error fetching license'
        };
      }

      return {
        level: _server.ServiceStatusLevels.available,
        summary: 'License fetched'
      };
    }

    return {
      level: _server.ServiceStatusLevels.degraded,
      summary: 'License not fetched yet'
    };
  }));
};

exports.getPluginStatus$ = getPluginStatus$;