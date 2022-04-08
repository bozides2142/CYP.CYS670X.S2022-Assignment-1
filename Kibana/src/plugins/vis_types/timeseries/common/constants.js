"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.USE_KIBANA_INDEXES_KEY = exports.UI_SETTINGS = exports.TSVB_DEFAULT_COLOR = exports.SERIES_SEPARATOR = exports.ROUTES = exports.INDEXES_SEPARATOR = exports.AUTO_INTERVAL = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const UI_SETTINGS = {
  MAX_BUCKETS_SETTING: 'metrics:max_buckets',
  ALLOW_STRING_INDICES: 'metrics:allowStringIndices',
  ALLOW_CHECKING_FOR_FAILED_SHARDS: 'metrics:allowCheckingForFailedShards'
};
exports.UI_SETTINGS = UI_SETTINGS;
const SERIES_SEPARATOR = '╰┄►';
exports.SERIES_SEPARATOR = SERIES_SEPARATOR;
const INDEXES_SEPARATOR = ',';
exports.INDEXES_SEPARATOR = INDEXES_SEPARATOR;
const AUTO_INTERVAL = 'auto';
exports.AUTO_INTERVAL = AUTO_INTERVAL;
const ROUTES = {
  VIS_DATA: '/api/metrics/vis/data',
  FIELDS: '/api/metrics/fields'
};
exports.ROUTES = ROUTES;
const USE_KIBANA_INDEXES_KEY = 'use_kibana_indexes';
exports.USE_KIBANA_INDEXES_KEY = USE_KIBANA_INDEXES_KEY;
const TSVB_DEFAULT_COLOR = '#68BC00';
exports.TSVB_DEFAULT_COLOR = TSVB_DEFAULT_COLOR;