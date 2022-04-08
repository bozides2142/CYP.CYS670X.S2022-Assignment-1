"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateJobSchema = exports.validateDatafeedPreviewSchema = exports.validateCardinalitySchema = exports.modelMemoryLimitSchema = exports.estimateBucketSpanSchema = void 0;

var _configSchema = require("@kbn/config-schema");

var _anomaly_detectors_schema = require("./anomaly_detectors_schema");

var _datafeeds_schema = require("./datafeeds_schema");

var _runtime_mappings_schema = require("./runtime_mappings_schema");

var _aggregation_types = require("../../../common/constants/aggregation_types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const estimateBucketSpanSchema = _configSchema.schema.object({
  aggTypes: _configSchema.schema.arrayOf(_configSchema.schema.nullable(_configSchema.schema.oneOf([_configSchema.schema.literal(_aggregation_types.ES_AGGREGATION.COUNT), _configSchema.schema.literal(_aggregation_types.ES_AGGREGATION.AVG), _configSchema.schema.literal(_aggregation_types.ES_AGGREGATION.MAX), _configSchema.schema.literal(_aggregation_types.ES_AGGREGATION.MIN), _configSchema.schema.literal(_aggregation_types.ES_AGGREGATION.SUM), _configSchema.schema.literal(_aggregation_types.ES_AGGREGATION.PERCENTILES), _configSchema.schema.literal(_aggregation_types.ES_AGGREGATION.CARDINALITY)]))),
  duration: _configSchema.schema.object({
    start: _configSchema.schema.number(),
    end: _configSchema.schema.number()
  }),
  fields: _configSchema.schema.arrayOf(_configSchema.schema.nullable(_configSchema.schema.string())),
  filters: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.any())),
  index: _configSchema.schema.string(),
  query: _configSchema.schema.any(),
  splitField: _configSchema.schema.maybe(_configSchema.schema.string()),
  timeField: _configSchema.schema.maybe(_configSchema.schema.string()),
  runtimeMappings: _configSchema.schema.maybe(_runtime_mappings_schema.runtimeMappingsSchema),
  indicesOptions: _configSchema.schema.maybe(_datafeeds_schema.indicesOptionsSchema)
});

exports.estimateBucketSpanSchema = estimateBucketSpanSchema;

const modelMemoryLimitSchema = _configSchema.schema.object({
  datafeedConfig: _datafeeds_schema.datafeedConfigSchema,
  analysisConfig: _anomaly_detectors_schema.analysisConfigSchema,
  indexPattern: _configSchema.schema.string(),
  query: _configSchema.schema.any(),
  timeFieldName: _configSchema.schema.string(),
  earliestMs: _configSchema.schema.number(),
  latestMs: _configSchema.schema.number()
});

exports.modelMemoryLimitSchema = modelMemoryLimitSchema;

const validateJobSchema = _configSchema.schema.object({
  duration: _configSchema.schema.maybe(_configSchema.schema.object({
    start: _configSchema.schema.maybe(_configSchema.schema.number()),
    end: _configSchema.schema.maybe(_configSchema.schema.number())
  })),
  fields: _configSchema.schema.maybe(_configSchema.schema.any()),
  job: _configSchema.schema.object({ ..._anomaly_detectors_schema.anomalyDetectionJobSchema,
    datafeed_config: _datafeeds_schema.datafeedConfigSchema
  })
});

exports.validateJobSchema = validateJobSchema;

const validateDatafeedPreviewSchema = _configSchema.schema.object({
  job: _configSchema.schema.object({ ..._anomaly_detectors_schema.anomalyDetectionJobSchema,
    datafeed_config: _datafeeds_schema.datafeedConfigSchema
  })
});

exports.validateDatafeedPreviewSchema = validateDatafeedPreviewSchema;

const validateCardinalitySchema = _configSchema.schema.object({ ..._anomaly_detectors_schema.anomalyDetectionJobSchema,
  datafeed_config: _datafeeds_schema.datafeedConfigSchema
});

exports.validateCardinalitySchema = validateCardinalitySchema;