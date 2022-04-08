"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateGroupsSchema = exports.topCategoriesSchema = exports.revertModelSnapshotSchema = exports.populationChartSchema = exports.optionalJobIdsSchema = exports.lookBackProgressSchema = exports.jobsWithTimerangeSchema = exports.jobsExistSchema = exports.jobIdsSchema = exports.forceStartDatafeedSchema = exports.datafeedPreviewSchema = exports.datafeedIdsSchema = exports.categorizationFieldExamplesSchema = exports.bulkCreateSchema = exports.basicChartSchema = void 0;

var _configSchema = require("@kbn/config-schema");

var _anomaly_detectors_schema = require("./anomaly_detectors_schema");

var _datafeeds_schema = require("./datafeeds_schema");

var _runtime_mappings_schema = require("./runtime_mappings_schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const categorizationFieldExamplesSchema = {
  indexPatternTitle: _configSchema.schema.string(),
  query: _configSchema.schema.any(),
  size: _configSchema.schema.number(),
  field: _configSchema.schema.string(),
  timeField: _configSchema.schema.maybe(_configSchema.schema.string()),
  start: _configSchema.schema.number(),
  end: _configSchema.schema.number(),
  analyzer: _configSchema.schema.any(),
  runtimeMappings: _runtime_mappings_schema.runtimeMappingsSchema,
  indicesOptions: _datafeeds_schema.indicesOptionsSchema
};
exports.categorizationFieldExamplesSchema = categorizationFieldExamplesSchema;
const basicChartSchema = {
  indexPatternTitle: _configSchema.schema.string(),
  timeField: _configSchema.schema.string(),
  start: _configSchema.schema.number(),
  end: _configSchema.schema.number(),
  intervalMs: _configSchema.schema.number(),
  query: _configSchema.schema.any(),
  aggFieldNamePairs: _configSchema.schema.arrayOf(_configSchema.schema.any()),
  splitFieldName: _configSchema.schema.nullable(_configSchema.schema.string()),
  splitFieldValue: _configSchema.schema.nullable(_configSchema.schema.string()),
  runtimeMappings: _configSchema.schema.maybe(_runtime_mappings_schema.runtimeMappingsSchema),
  indicesOptions: _configSchema.schema.maybe(_datafeeds_schema.indicesOptionsSchema)
};
exports.basicChartSchema = basicChartSchema;
const populationChartSchema = {
  indexPatternTitle: _configSchema.schema.string(),
  timeField: _configSchema.schema.string(),
  start: _configSchema.schema.number(),
  end: _configSchema.schema.number(),
  intervalMs: _configSchema.schema.number(),
  query: _configSchema.schema.any(),
  aggFieldNamePairs: _configSchema.schema.arrayOf(_configSchema.schema.any()),
  splitFieldName: _configSchema.schema.nullable(_configSchema.schema.string()),
  splitFieldValue: _configSchema.schema.maybe(_configSchema.schema.nullable(_configSchema.schema.string())),
  runtimeMappings: _configSchema.schema.maybe(_runtime_mappings_schema.runtimeMappingsSchema),
  indicesOptions: _configSchema.schema.maybe(_datafeeds_schema.indicesOptionsSchema)
};
exports.populationChartSchema = populationChartSchema;

const datafeedIdsSchema = _configSchema.schema.object({
  datafeedIds: _configSchema.schema.arrayOf(_configSchema.schema.string())
});

exports.datafeedIdsSchema = datafeedIdsSchema;

const forceStartDatafeedSchema = _configSchema.schema.object({
  datafeedIds: _configSchema.schema.arrayOf(_configSchema.schema.string()),
  start: _configSchema.schema.maybe(_configSchema.schema.number()),
  end: _configSchema.schema.maybe(_configSchema.schema.number())
});

exports.forceStartDatafeedSchema = forceStartDatafeedSchema;

const jobIdsSchema = _configSchema.schema.object({
  /** List of job IDs. */
  jobIds: _configSchema.schema.arrayOf(_configSchema.schema.string())
});

exports.jobIdsSchema = jobIdsSchema;

const optionalJobIdsSchema = _configSchema.schema.object({
  /** Optional list of job IDs. */
  jobIds: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string()))
});

exports.optionalJobIdsSchema = optionalJobIdsSchema;

const jobsWithTimerangeSchema = _configSchema.schema.object({
  dateFormatTz: _configSchema.schema.maybe(_configSchema.schema.string())
});

exports.jobsWithTimerangeSchema = jobsWithTimerangeSchema;
const lookBackProgressSchema = {
  jobId: _configSchema.schema.string(),
  start: _configSchema.schema.number(),
  end: _configSchema.schema.number()
};
exports.lookBackProgressSchema = lookBackProgressSchema;
const topCategoriesSchema = {
  jobId: _configSchema.schema.string(),
  count: _configSchema.schema.number()
};
exports.topCategoriesSchema = topCategoriesSchema;

const updateGroupsSchema = _configSchema.schema.object({
  jobs: _configSchema.schema.arrayOf(_configSchema.schema.object({
    jobId: _configSchema.schema.string(),
    groups: _configSchema.schema.arrayOf(_configSchema.schema.string())
  }))
});

exports.updateGroupsSchema = updateGroupsSchema;

const revertModelSnapshotSchema = _configSchema.schema.object({
  jobId: _configSchema.schema.string(),
  snapshotId: _configSchema.schema.string(),
  replay: _configSchema.schema.boolean(),
  end: _configSchema.schema.maybe(_configSchema.schema.number()),
  deleteInterveningResults: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  calendarEvents: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.object({
    start: _configSchema.schema.number(),
    end: _configSchema.schema.number(),
    description: _configSchema.schema.string()
  })))
});

exports.revertModelSnapshotSchema = revertModelSnapshotSchema;

const datafeedPreviewSchema = _configSchema.schema.object({
  job: _configSchema.schema.maybe(_configSchema.schema.object(_anomaly_detectors_schema.anomalyDetectionJobSchema)),
  datafeed: _configSchema.schema.maybe(_datafeeds_schema.datafeedConfigSchema),
  datafeedId: _configSchema.schema.maybe(_configSchema.schema.string())
}, {
  validate: v => {
    const msg = 'supply either a datafeed_id for an existing job or a job and datafeed config';

    if (v.datafeedId !== undefined && (v.job !== undefined || v.datafeed !== undefined)) {
      // datafeed_id is supplied but job and datafeed configs are also supplied
      return msg;
    }

    if (v.datafeedId === undefined && (v.job === undefined || v.datafeed === undefined)) {
      // datafeed_id is not supplied but job or datafeed configs are missing
      return msg;
    }

    if (v.datafeedId === undefined && v.job === undefined && v.datafeed === undefined) {
      // everything is missing
      return msg;
    }
  }
});

exports.datafeedPreviewSchema = datafeedPreviewSchema;

const jobsExistSchema = _configSchema.schema.object({
  jobIds: _configSchema.schema.arrayOf(_configSchema.schema.string()),
  allSpaces: _configSchema.schema.maybe(_configSchema.schema.boolean())
});

exports.jobsExistSchema = jobsExistSchema;

const bulkCreateSchema = _configSchema.schema.oneOf([_configSchema.schema.arrayOf(_configSchema.schema.object({
  job: _configSchema.schema.object(_anomaly_detectors_schema.anomalyDetectionJobSchema),
  datafeed: _datafeeds_schema.datafeedConfigSchema
})), _configSchema.schema.object({
  job: _configSchema.schema.object(_anomaly_detectors_schema.anomalyDetectionJobSchema),
  datafeed: _datafeeds_schema.datafeedConfigSchema
})]);

exports.bulkCreateSchema = bulkCreateSchema;