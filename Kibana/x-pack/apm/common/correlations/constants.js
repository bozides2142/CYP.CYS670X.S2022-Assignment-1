"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TERMS_SIZE = exports.SIGNIFICANT_VALUE_DIGITS = exports.SIGNIFICANT_FRACTION = exports.POPULATED_DOC_COUNT_SAMPLE_SIZE = exports.PERCENTILES_STEP = exports.KS_TEST_THRESHOLD = exports.FIELD_PREFIX_TO_EXCLUDE_AS_CANDIDATE = exports.FIELD_PREFIX_TO_ADD_AS_CANDIDATE = exports.FIELDS_TO_EXCLUDE_AS_CANDIDATE = exports.FIELDS_TO_ADD_AS_CANDIDATE = exports.ERROR_CORRELATION_THRESHOLD = exports.DEFAULT_PERCENTILE_THRESHOLD = exports.DEBOUNCE_INTERVAL = exports.CORRELATION_THRESHOLD = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Fields to exclude as potential field candidates
 */

const FIELDS_TO_EXCLUDE_AS_CANDIDATE = new Set([// Exclude for all usage Contexts
'parent.id', 'trace.id', 'transaction.id', '@timestamp', 'timestamp.us', 'agent.ephemeral_id', 'ecs.version', 'event.ingested', 'http.response.finished', 'parent.id', 'trace.id', 'transaction.duration.us', 'transaction.id', 'process.pid', 'process.ppid', 'processor.event', 'processor.name', 'transaction.sampled', 'transaction.span_count.dropped', // Exclude for correlation on a Single Service
'agent.name', 'http.request.method', 'service.framework.name', 'service.language.name', 'service.name', 'service.runtime.name', 'transaction.name', 'transaction.type']);
exports.FIELDS_TO_EXCLUDE_AS_CANDIDATE = FIELDS_TO_EXCLUDE_AS_CANDIDATE;
const FIELD_PREFIX_TO_EXCLUDE_AS_CANDIDATE = ['observer.'];
/**
 * Fields to include/prioritize as potential field candidates
 */

exports.FIELD_PREFIX_TO_EXCLUDE_AS_CANDIDATE = FIELD_PREFIX_TO_EXCLUDE_AS_CANDIDATE;
const FIELDS_TO_ADD_AS_CANDIDATE = new Set(['service.version', 'service.node.name', 'service.framework.version', 'service.language.version', 'service.runtime.version', 'kubernetes.pod.name', 'kubernetes.pod.uid', 'container.id', 'source.ip', 'client.ip', 'host.ip', 'service.environment', 'process.args', 'http.response.status_code']);
exports.FIELDS_TO_ADD_AS_CANDIDATE = FIELDS_TO_ADD_AS_CANDIDATE;
const FIELD_PREFIX_TO_ADD_AS_CANDIDATE = ['cloud.', 'labels.', 'user_agent.'];
/**
 * Other constants
 */

exports.FIELD_PREFIX_TO_ADD_AS_CANDIDATE = FIELD_PREFIX_TO_ADD_AS_CANDIDATE;
const POPULATED_DOC_COUNT_SAMPLE_SIZE = 1000;
exports.POPULATED_DOC_COUNT_SAMPLE_SIZE = POPULATED_DOC_COUNT_SAMPLE_SIZE;
const PERCENTILES_STEP = 2;
exports.PERCENTILES_STEP = PERCENTILES_STEP;
const TERMS_SIZE = 20;
exports.TERMS_SIZE = TERMS_SIZE;
const SIGNIFICANT_FRACTION = 3;
exports.SIGNIFICANT_FRACTION = SIGNIFICANT_FRACTION;
const SIGNIFICANT_VALUE_DIGITS = 3;
exports.SIGNIFICANT_VALUE_DIGITS = SIGNIFICANT_VALUE_DIGITS;
const CORRELATION_THRESHOLD = 0.3;
exports.CORRELATION_THRESHOLD = CORRELATION_THRESHOLD;
const KS_TEST_THRESHOLD = 0.1;
exports.KS_TEST_THRESHOLD = KS_TEST_THRESHOLD;
const ERROR_CORRELATION_THRESHOLD = 0.02;
exports.ERROR_CORRELATION_THRESHOLD = ERROR_CORRELATION_THRESHOLD;
const DEFAULT_PERCENTILE_THRESHOLD = 95;
exports.DEFAULT_PERCENTILE_THRESHOLD = DEFAULT_PERCENTILE_THRESHOLD;
const DEBOUNCE_INTERVAL = 100;
exports.DEBOUNCE_INTERVAL = DEBOUNCE_INTERVAL;