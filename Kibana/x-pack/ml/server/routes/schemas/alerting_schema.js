"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mlAnomalyDetectionAlertPreviewRequest = exports.mlAnomalyDetectionAlertParams = exports.anomalyDetectionJobsHealthRuleParams = void 0;

var _configSchema = require("@kbn/config-schema");

var _i18n = require("@kbn/i18n");

var _alerts = require("../../../common/constants/alerts");

var _anomalies = require("../../../common/constants/anomalies");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const jobsSelectionSchema = _configSchema.schema.object({
  jobIds: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
    defaultValue: []
  }),
  groupIds: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
    defaultValue: []
  })
}, {
  validate: v => {
    var _v$jobIds, _v$groupIds;

    if (!((_v$jobIds = v.jobIds) !== null && _v$jobIds !== void 0 && _v$jobIds.length) && !((_v$groupIds = v.groupIds) !== null && _v$groupIds !== void 0 && _v$groupIds.length)) {
      return _i18n.i18n.translate('xpack.ml.alertTypes.anomalyDetection.jobSelection.errorMessage', {
        defaultMessage: 'Job selection is required'
      });
    }
  }
});

const mlAnomalyDetectionAlertParams = _configSchema.schema.object({
  jobSelection: jobsSelectionSchema,

  /** Anomaly score threshold  */
  severity: _configSchema.schema.number({
    min: 0,
    max: 100
  }),

  /** Result type to alert upon  */
  resultType: _configSchema.schema.oneOf([_configSchema.schema.literal(_anomalies.ANOMALY_RESULT_TYPE.RECORD), _configSchema.schema.literal(_anomalies.ANOMALY_RESULT_TYPE.BUCKET), _configSchema.schema.literal(_anomalies.ANOMALY_RESULT_TYPE.INFLUENCER)]),
  includeInterim: _configSchema.schema.boolean({
    defaultValue: true
  }),

  /** User's override for the lookback interval */
  lookbackInterval: _configSchema.schema.nullable(_configSchema.schema.string()),

  /** User's override for the top N buckets  */
  topNBuckets: _configSchema.schema.nullable(_configSchema.schema.number({
    min: 1
  }))
});

exports.mlAnomalyDetectionAlertParams = mlAnomalyDetectionAlertParams;

const mlAnomalyDetectionAlertPreviewRequest = _configSchema.schema.object({
  alertParams: mlAnomalyDetectionAlertParams,

  /**
   * Relative time range to look back from now, e.g. 1y, 8m, 15d
   */
  timeRange: _configSchema.schema.string(),

  /**
   * Number of top hits to return
   */
  sampleSize: _configSchema.schema.number({
    defaultValue: _alerts.ALERT_PREVIEW_SAMPLE_SIZE,
    min: 0
  })
});

exports.mlAnomalyDetectionAlertPreviewRequest = mlAnomalyDetectionAlertPreviewRequest;

const anomalyDetectionJobsHealthRuleParams = _configSchema.schema.object({
  includeJobs: jobsSelectionSchema,
  excludeJobs: _configSchema.schema.nullable(jobsSelectionSchema),
  testsConfig: _configSchema.schema.nullable(_configSchema.schema.object({
    datafeed: _configSchema.schema.nullable(_configSchema.schema.object({
      enabled: _configSchema.schema.boolean({
        defaultValue: true
      })
    })),
    mml: _configSchema.schema.nullable(_configSchema.schema.object({
      enabled: _configSchema.schema.boolean({
        defaultValue: true
      })
    })),
    delayedData: _configSchema.schema.nullable(_configSchema.schema.object({
      enabled: _configSchema.schema.boolean({
        defaultValue: true
      }),
      docsCount: _configSchema.schema.nullable(_configSchema.schema.number({
        min: 1
      })),
      timeInterval: _configSchema.schema.nullable(_configSchema.schema.string())
    })),
    behindRealtime: _configSchema.schema.nullable(_configSchema.schema.object({
      enabled: _configSchema.schema.boolean({
        defaultValue: true
      }),
      timeInterval: _configSchema.schema.nullable(_configSchema.schema.string())
    })),
    errorMessages: _configSchema.schema.nullable(_configSchema.schema.object({
      enabled: _configSchema.schema.boolean({
        defaultValue: true
      })
    }))
  }))
});

exports.anomalyDetectionJobsHealthRuleParams = anomalyDetectionJobsHealthRuleParams;