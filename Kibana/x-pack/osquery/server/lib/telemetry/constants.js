"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TELEMETRY_MAX_BUFFER_SIZE = exports.TELEMETRY_CHANNEL_SAVED_QUERIES = exports.TELEMETRY_CHANNEL_PACKS = exports.MAX_PACK_TELEMETRY_BATCH = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const TELEMETRY_MAX_BUFFER_SIZE = 100;
exports.TELEMETRY_MAX_BUFFER_SIZE = TELEMETRY_MAX_BUFFER_SIZE;
const MAX_PACK_TELEMETRY_BATCH = 100;
exports.MAX_PACK_TELEMETRY_BATCH = MAX_PACK_TELEMETRY_BATCH;
const TELEMETRY_CHANNEL_PACKS = 'osquery-packs';
exports.TELEMETRY_CHANNEL_PACKS = TELEMETRY_CHANNEL_PACKS;
const TELEMETRY_CHANNEL_SAVED_QUERIES = 'osquery-saved-queries';
exports.TELEMETRY_CHANNEL_SAVED_QUERIES = TELEMETRY_CHANNEL_SAVED_QUERIES;