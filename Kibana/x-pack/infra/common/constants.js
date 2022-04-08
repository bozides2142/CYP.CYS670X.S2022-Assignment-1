"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TIMESTAMP_FIELD = exports.TIEBREAKER_FIELD = exports.POD_FIELD = exports.METRICS_INDEX_PATTERN = exports.METRICS_FEATURE_ID = exports.METRICS_APP = exports.LOGS_INDEX_PATTERN = exports.LOGS_FEATURE_ID = exports.LOGS_APP = exports.HOST_FIELD = exports.DEFAULT_SOURCE_ID = exports.CONTAINER_FIELD = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const DEFAULT_SOURCE_ID = 'default';
exports.DEFAULT_SOURCE_ID = DEFAULT_SOURCE_ID;
const METRICS_INDEX_PATTERN = 'metrics-*,metricbeat-*';
exports.METRICS_INDEX_PATTERN = METRICS_INDEX_PATTERN;
const LOGS_INDEX_PATTERN = 'logs-*,filebeat-*,kibana_sample_data_logs*';
exports.LOGS_INDEX_PATTERN = LOGS_INDEX_PATTERN;
const METRICS_APP = 'metrics';
exports.METRICS_APP = METRICS_APP;
const LOGS_APP = 'logs';
exports.LOGS_APP = LOGS_APP;
const METRICS_FEATURE_ID = 'infrastructure';
exports.METRICS_FEATURE_ID = METRICS_FEATURE_ID;
const LOGS_FEATURE_ID = 'logs';
exports.LOGS_FEATURE_ID = LOGS_FEATURE_ID;
const TIMESTAMP_FIELD = '@timestamp';
exports.TIMESTAMP_FIELD = TIMESTAMP_FIELD;
const TIEBREAKER_FIELD = '_doc';
exports.TIEBREAKER_FIELD = TIEBREAKER_FIELD;
const HOST_FIELD = 'host.name';
exports.HOST_FIELD = HOST_FIELD;
const CONTAINER_FIELD = 'container.id';
exports.CONTAINER_FIELD = CONTAINER_FIELD;
const POD_FIELD = 'kubernetes.pod.uid';
exports.POD_FIELD = POD_FIELD;