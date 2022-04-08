"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateModelSnapshotsSchema = exports.updateModelSnapshotBodySchema = exports.jobResetQuerySchema = exports.jobIdSchema = exports.getRecordsSchema = exports.getOverallBucketsSchema = exports.getModelSnapshotsSchema = exports.getCategoriesSchema = exports.getBucketsSchema = exports.getBucketParamsSchema = exports.forecastAnomalyDetector = exports.forceQuerySchema = exports.anomalyDetectionUpdateJobSchema = exports.anomalyDetectionJobSchema = exports.analysisConfigSchema = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const customRulesSchema = _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.object({
  actions: _configSchema.schema.arrayOf(_configSchema.schema.oneOf([_configSchema.schema.literal('skip_result'), _configSchema.schema.literal('skip_model_update')])),
  conditions: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.any())),
  scope: _configSchema.schema.maybe(_configSchema.schema.any())
})));

const AnalysisLimits = _configSchema.schema.object({
  /** Limit of categorization examples */
  categorization_examples_limit: _configSchema.schema.maybe(_configSchema.schema.number()),
  model_memory_limit: _configSchema.schema.string()
});

const detectorSchema = _configSchema.schema.object({
  identifier: _configSchema.schema.maybe(_configSchema.schema.string()),
  function: _configSchema.schema.string(),
  field_name: _configSchema.schema.maybe(_configSchema.schema.string()),
  by_field_name: _configSchema.schema.maybe(_configSchema.schema.string()),
  over_field_name: _configSchema.schema.maybe(_configSchema.schema.string()),
  partition_field_name: _configSchema.schema.maybe(_configSchema.schema.string()),
  detector_description: _configSchema.schema.maybe(_configSchema.schema.string()),
  exclude_frequent: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.literal('all'), _configSchema.schema.literal('none'), _configSchema.schema.literal('by'), _configSchema.schema.literal('over')])),
  use_null: _configSchema.schema.maybe(_configSchema.schema.boolean()),

  /** Custom rules */
  custom_rules: customRulesSchema,
  detector_index: _configSchema.schema.maybe(_configSchema.schema.number())
});

const customUrlSchema = {
  url_name: _configSchema.schema.string(),
  url_value: _configSchema.schema.string(),
  time_range: _configSchema.schema.maybe(_configSchema.schema.any())
};

const customSettingsSchema = _configSchema.schema.object({
  /** Indicates the creator entity */
  created_by: _configSchema.schema.maybe(_configSchema.schema.string()),
  custom_urls: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.maybe(_configSchema.schema.object(customUrlSchema))))
}, {
  unknowns: 'allow'
} // Create / Update job API allows other fields to be added to custom_settings.
);

const anomalyDetectionUpdateJobSchema = _configSchema.schema.object({
  description: _configSchema.schema.maybe(_configSchema.schema.string()),
  detectors: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.maybe(_configSchema.schema.object({
    /** Detector index */
    detector_index: _configSchema.schema.number(),

    /** Description */
    description: _configSchema.schema.maybe(_configSchema.schema.string()),

    /** Custom rules */
    custom_rules: customRulesSchema
  })))),
  custom_settings: _configSchema.schema.maybe(customSettingsSchema),
  analysis_limits: _configSchema.schema.maybe(AnalysisLimits),
  groups: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
  model_snapshot_retention_days: _configSchema.schema.maybe(_configSchema.schema.number()),
  daily_model_snapshot_retention_after_days: _configSchema.schema.maybe(_configSchema.schema.number())
});

exports.anomalyDetectionUpdateJobSchema = anomalyDetectionUpdateJobSchema;

const analysisConfigSchema = _configSchema.schema.object({
  bucket_span: _configSchema.schema.string(),
  summary_count_field_name: _configSchema.schema.maybe(_configSchema.schema.string()),
  detectors: _configSchema.schema.arrayOf(detectorSchema),
  influencers: _configSchema.schema.arrayOf(_configSchema.schema.string()),
  categorization_field_name: _configSchema.schema.maybe(_configSchema.schema.string()),
  categorization_analyzer: _configSchema.schema.maybe(_configSchema.schema.any()),
  categorization_filters: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
  latency: _configSchema.schema.maybe(_configSchema.schema.number()),
  multivariate_by_fields: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  per_partition_categorization: _configSchema.schema.maybe(_configSchema.schema.object({
    enabled: _configSchema.schema.boolean(),
    stop_on_warn: _configSchema.schema.maybe(_configSchema.schema.boolean())
  })),
  model_prune_window: _configSchema.schema.maybe(_configSchema.schema.string())
});

exports.analysisConfigSchema = analysisConfigSchema;
const anomalyDetectionJobSchema = {
  analysis_config: analysisConfigSchema,
  analysis_limits: _configSchema.schema.maybe(AnalysisLimits),
  background_persist_interval: _configSchema.schema.maybe(_configSchema.schema.string()),
  create_time: _configSchema.schema.maybe(_configSchema.schema.number()),
  custom_settings: _configSchema.schema.maybe(customSettingsSchema),
  allow_lazy_open: _configSchema.schema.maybe(_configSchema.schema.any()),
  data_counts: _configSchema.schema.maybe(_configSchema.schema.any()),
  data_description: _configSchema.schema.object({
    /** Format */
    format: _configSchema.schema.maybe(_configSchema.schema.string()),
    time_field: _configSchema.schema.string(),
    time_format: _configSchema.schema.maybe(_configSchema.schema.string())
  }),
  description: _configSchema.schema.maybe(_configSchema.schema.string()),
  established_model_memory: _configSchema.schema.maybe(_configSchema.schema.number()),
  finished_time: _configSchema.schema.maybe(_configSchema.schema.number()),
  job_id: _configSchema.schema.string(),
  job_type: _configSchema.schema.maybe(_configSchema.schema.string()),
  job_version: _configSchema.schema.maybe(_configSchema.schema.string()),
  groups: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.maybe(_configSchema.schema.string()))),
  model_plot_config: _configSchema.schema.maybe(_configSchema.schema.any()),
  model_plot: _configSchema.schema.maybe(_configSchema.schema.any()),
  model_size_stats: _configSchema.schema.maybe(_configSchema.schema.any()),
  model_snapshot_id: _configSchema.schema.maybe(_configSchema.schema.string()),
  model_snapshot_min_version: _configSchema.schema.maybe(_configSchema.schema.string()),
  model_snapshot_retention_days: _configSchema.schema.maybe(_configSchema.schema.number()),
  daily_model_snapshot_retention_after_days: _configSchema.schema.maybe(_configSchema.schema.number()),
  renormalization_window_days: _configSchema.schema.maybe(_configSchema.schema.number()),
  results_index_name: _configSchema.schema.maybe(_configSchema.schema.string()),
  results_retention_days: _configSchema.schema.maybe(_configSchema.schema.number()),
  state: _configSchema.schema.maybe(_configSchema.schema.string())
};
exports.anomalyDetectionJobSchema = anomalyDetectionJobSchema;

const jobIdSchema = _configSchema.schema.object({
  /** Job ID. */
  jobId: _configSchema.schema.string()
});

exports.jobIdSchema = jobIdSchema;

const getRecordsSchema = _configSchema.schema.object({
  desc: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  end: _configSchema.schema.maybe(_configSchema.schema.string()),
  exclude_interim: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  page: _configSchema.schema.maybe(_configSchema.schema.object({
    from: _configSchema.schema.number(),
    size: _configSchema.schema.number()
  })),
  record_score: _configSchema.schema.maybe(_configSchema.schema.number()),
  sort: _configSchema.schema.maybe(_configSchema.schema.string()),
  start: _configSchema.schema.maybe(_configSchema.schema.string())
});

exports.getRecordsSchema = getRecordsSchema;

const getBucketsSchema = _configSchema.schema.object({
  anomaly_score: _configSchema.schema.maybe(_configSchema.schema.number()),
  desc: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  end: _configSchema.schema.maybe(_configSchema.schema.string()),
  exclude_interim: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  expand: _configSchema.schema.maybe(_configSchema.schema.boolean()),

  /** Page definition */
  page: _configSchema.schema.maybe(_configSchema.schema.object({
    /** Page offset */
    from: _configSchema.schema.number(),

    /** Size of the page */
    size: _configSchema.schema.number()
  })),
  sort: _configSchema.schema.maybe(_configSchema.schema.string()),
  start: _configSchema.schema.maybe(_configSchema.schema.string())
});

exports.getBucketsSchema = getBucketsSchema;

const getBucketParamsSchema = _configSchema.schema.object({
  jobId: _configSchema.schema.string(),
  timestamp: _configSchema.schema.maybe(_configSchema.schema.string())
});

exports.getBucketParamsSchema = getBucketParamsSchema;

const getOverallBucketsSchema = _configSchema.schema.object({
  topN: _configSchema.schema.number(),
  bucketSpan: _configSchema.schema.string(),
  start: _configSchema.schema.number(),
  end: _configSchema.schema.number(),
  overall_score: _configSchema.schema.maybe(_configSchema.schema.number())
});

exports.getOverallBucketsSchema = getOverallBucketsSchema;

const getCategoriesSchema = _configSchema.schema.object({
  /** Category ID */
  categoryId: _configSchema.schema.string(),

  /** Job ID */
  jobId: _configSchema.schema.string()
});

exports.getCategoriesSchema = getCategoriesSchema;

const getModelSnapshotsSchema = _configSchema.schema.object({
  /** Snapshot ID */
  snapshotId: _configSchema.schema.maybe(_configSchema.schema.string()),

  /** Job ID */
  jobId: _configSchema.schema.string()
});

exports.getModelSnapshotsSchema = getModelSnapshotsSchema;

const updateModelSnapshotsSchema = _configSchema.schema.object({
  /** Snapshot ID */
  snapshotId: _configSchema.schema.string(),

  /** Job ID */
  jobId: _configSchema.schema.string()
});

exports.updateModelSnapshotsSchema = updateModelSnapshotsSchema;

const updateModelSnapshotBodySchema = _configSchema.schema.object({
  /** description */
  description: _configSchema.schema.maybe(_configSchema.schema.string()),

  /** retain */
  retain: _configSchema.schema.maybe(_configSchema.schema.boolean())
});

exports.updateModelSnapshotBodySchema = updateModelSnapshotBodySchema;

const forecastAnomalyDetector = _configSchema.schema.object({
  duration: _configSchema.schema.any()
});

exports.forecastAnomalyDetector = forecastAnomalyDetector;

const jobResetQuerySchema = _configSchema.schema.object({
  /** wait for completion */
  wait_for_completion: _configSchema.schema.maybe(_configSchema.schema.boolean())
});

exports.jobResetQuerySchema = jobResetQuerySchema;

const forceQuerySchema = _configSchema.schema.object({
  /** force close */
  force: _configSchema.schema.maybe(_configSchema.schema.boolean())
});

exports.forceQuerySchema = forceQuerySchema;