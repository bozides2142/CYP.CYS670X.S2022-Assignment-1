"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calendarSchema = exports.calendarIdsSchema = exports.calendarIdSchema = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const calendarSchema = _configSchema.schema.object({
  calendarId: _configSchema.schema.string(),
  calendar_id: _configSchema.schema.maybe(_configSchema.schema.string()),
  job_ids: _configSchema.schema.arrayOf(_configSchema.schema.string()),
  description: _configSchema.schema.maybe(_configSchema.schema.string()),
  total_job_count: _configSchema.schema.maybe(_configSchema.schema.number()),
  events: _configSchema.schema.arrayOf(_configSchema.schema.object({
    event_id: _configSchema.schema.maybe(_configSchema.schema.string()),
    calendar_id: _configSchema.schema.maybe(_configSchema.schema.string()),
    description: _configSchema.schema.maybe(_configSchema.schema.string()),
    start_time: _configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.number()]),
    end_time: _configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.number()])
  }))
});

exports.calendarSchema = calendarSchema;

const calendarIdSchema = _configSchema.schema.object({
  calendarId: _configSchema.schema.string()
});

exports.calendarIdSchema = calendarIdSchema;

const calendarIdsSchema = _configSchema.schema.object({
  /** Comma-separated list of calendar IDs */
  calendarIds: _configSchema.schema.string()
});

exports.calendarIdsSchema = calendarIdsSchema;