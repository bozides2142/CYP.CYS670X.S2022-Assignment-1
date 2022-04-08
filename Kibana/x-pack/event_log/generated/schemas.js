"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventSchema = exports.ECS_VERSION = void 0;

var _configSchema = require("@kbn/config-schema");

var _semver = _interopRequireDefault(require("semver"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// ---------------------------------- WARNING ----------------------------------
// this file was generated, and should not be edited by hand
// ---------------------------------- WARNING ----------------------------------
// provides TypeScript and config-schema interfaces for ECS for use with
// the event log


const ECS_VERSION = '1.8.0'; // types and config-schema describing the es structures

exports.ECS_VERSION = ECS_VERSION;

const EventSchema = _configSchema.schema.maybe(_configSchema.schema.object({
  '@timestamp': ecsDate(),
  message: ecsString(),
  tags: ecsStringMulti(),
  ecs: _configSchema.schema.maybe(_configSchema.schema.object({
    version: ecsString()
  })),
  error: _configSchema.schema.maybe(_configSchema.schema.object({
    code: ecsString(),
    id: ecsString(),
    message: ecsString(),
    stack_trace: ecsString(),
    type: ecsString()
  })),
  event: _configSchema.schema.maybe(_configSchema.schema.object({
    action: ecsString(),
    category: ecsStringMulti(),
    code: ecsString(),
    created: ecsDate(),
    dataset: ecsString(),
    duration: ecsNumber(),
    end: ecsDate(),
    hash: ecsString(),
    id: ecsString(),
    ingested: ecsDate(),
    kind: ecsString(),
    module: ecsString(),
    original: ecsString(),
    outcome: ecsString(),
    provider: ecsString(),
    reason: ecsString(),
    reference: ecsString(),
    risk_score: ecsNumber(),
    risk_score_norm: ecsNumber(),
    sequence: ecsNumber(),
    severity: ecsNumber(),
    start: ecsDate(),
    timezone: ecsString(),
    type: ecsStringMulti(),
    url: ecsString()
  })),
  log: _configSchema.schema.maybe(_configSchema.schema.object({
    level: ecsString(),
    logger: ecsString()
  })),
  rule: _configSchema.schema.maybe(_configSchema.schema.object({
    author: ecsStringMulti(),
    category: ecsString(),
    description: ecsString(),
    id: ecsString(),
    license: ecsString(),
    name: ecsString(),
    reference: ecsString(),
    ruleset: ecsString(),
    uuid: ecsString(),
    version: ecsString()
  })),
  user: _configSchema.schema.maybe(_configSchema.schema.object({
    name: ecsString()
  })),
  kibana: _configSchema.schema.maybe(_configSchema.schema.object({
    server_uuid: ecsString(),
    task: _configSchema.schema.maybe(_configSchema.schema.object({
      id: ecsString(),
      scheduled: ecsDate(),
      schedule_delay: ecsNumber()
    })),
    alerting: _configSchema.schema.maybe(_configSchema.schema.object({
      instance_id: ecsString(),
      action_group_id: ecsString(),
      action_subgroup: ecsString(),
      status: ecsString()
    })),
    alert: _configSchema.schema.maybe(_configSchema.schema.object({
      rule: _configSchema.schema.maybe(_configSchema.schema.object({
        execution: _configSchema.schema.maybe(_configSchema.schema.object({
          uuid: ecsString(),
          status: ecsString(),
          status_order: ecsNumber(),
          metrics: _configSchema.schema.maybe(_configSchema.schema.object({
            number_of_triggered_actions: ecsNumber(),
            total_indexing_duration_ms: ecsNumber(),
            total_search_duration_ms: ecsNumber(),
            execution_gap_duration_s: ecsNumber()
          }))
        }))
      }))
    })),
    saved_objects: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.object({
      rel: ecsString(),
      namespace: ecsString(),
      id: ecsString(),
      type: ecsString(),
      type_id: ecsString()
    }))),
    space_ids: ecsStringMulti(),
    version: ecsVersion()
  }))
}));

exports.EventSchema = EventSchema;

function ecsStringMulti() {
  return _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string()));
}

function ecsString() {
  return _configSchema.schema.maybe(_configSchema.schema.string());
}

function ecsNumber() {
  return _configSchema.schema.maybe(_configSchema.schema.number());
}

function ecsDate() {
  return _configSchema.schema.maybe(_configSchema.schema.string({
    validate: validateDate
  }));
}

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

function validateDate(isoDate) {
  if (ISO_DATE_PATTERN.test(isoDate)) return;
  return 'string is not a valid ISO date: ' + isoDate;
}

function ecsVersion() {
  return _configSchema.schema.maybe(_configSchema.schema.string({
    validate: validateVersion
  }));
}

function validateVersion(version) {
  if (_semver.default.valid(version)) return;
  return 'string is not a valid version: ' + version;
}