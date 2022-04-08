"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.syncJobObjects = exports.syncCheckSchema = exports.jobsAndSpaces = exports.jobsAndCurrentSpace = exports.jobTypeSchema = exports.jobTypeLiterals = exports.canDeleteJobSchema = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const jobTypeLiterals = _configSchema.schema.oneOf([_configSchema.schema.literal('anomaly-detector'), _configSchema.schema.literal('data-frame-analytics')]);

exports.jobTypeLiterals = jobTypeLiterals;

const jobTypeSchema = _configSchema.schema.object({
  jobType: jobTypeLiterals
});

exports.jobTypeSchema = jobTypeSchema;

const jobsAndSpaces = _configSchema.schema.object({
  jobType: jobTypeLiterals,
  jobIds: _configSchema.schema.arrayOf(_configSchema.schema.string()),
  spacesToAdd: _configSchema.schema.arrayOf(_configSchema.schema.string()),
  spacesToRemove: _configSchema.schema.arrayOf(_configSchema.schema.string())
});

exports.jobsAndSpaces = jobsAndSpaces;

const jobsAndCurrentSpace = _configSchema.schema.object({
  jobType: jobTypeLiterals,
  jobIds: _configSchema.schema.arrayOf(_configSchema.schema.string())
});

exports.jobsAndCurrentSpace = jobsAndCurrentSpace;

const syncJobObjects = _configSchema.schema.object({
  simulate: _configSchema.schema.maybe(_configSchema.schema.boolean())
});

exports.syncJobObjects = syncJobObjects;

const syncCheckSchema = _configSchema.schema.object({
  jobType: _configSchema.schema.maybe(_configSchema.schema.string())
});

exports.syncCheckSchema = syncCheckSchema;

const canDeleteJobSchema = _configSchema.schema.object({
  /** List of job IDs. */
  jobIds: _configSchema.schema.arrayOf(_configSchema.schema.string())
});

exports.canDeleteJobSchema = canDeleteJobSchema;