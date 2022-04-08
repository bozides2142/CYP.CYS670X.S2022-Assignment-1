"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TOP_N_BUCKETS_COUNT = exports.ML_ALERT_TYPES = exports.HEALTH_CHECK_NAMES = exports.ALL_JOBS_SELECTION = exports.ALERT_PREVIEW_SAMPLE_SIZE = void 0;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ML_ALERT_TYPES = {
  ANOMALY_DETECTION: 'xpack.ml.anomaly_detection_alert',
  AD_JOBS_HEALTH: 'xpack.ml.anomaly_detection_jobs_health'
};
exports.ML_ALERT_TYPES = ML_ALERT_TYPES;
const ALERT_PREVIEW_SAMPLE_SIZE = 5;
exports.ALERT_PREVIEW_SAMPLE_SIZE = ALERT_PREVIEW_SAMPLE_SIZE;
const TOP_N_BUCKETS_COUNT = 1;
exports.TOP_N_BUCKETS_COUNT = TOP_N_BUCKETS_COUNT;
const ALL_JOBS_SELECTION = '*';
exports.ALL_JOBS_SELECTION = ALL_JOBS_SELECTION;
const HEALTH_CHECK_NAMES = {
  datafeed: {
    name: _i18n.i18n.translate('xpack.ml.alertTypes.jobsHealthAlertingRule.datafeedCheckName', {
      defaultMessage: 'Datafeed is not started'
    }),
    description: _i18n.i18n.translate('xpack.ml.alertTypes.jobsHealthAlertingRule.datafeedCheckDescription', {
      defaultMessage: 'Get alerted if the corresponding datafeed of the job is not started'
    })
  },
  mml: {
    name: _i18n.i18n.translate('xpack.ml.alertTypes.jobsHealthAlertingRule.mmlCheckName', {
      defaultMessage: 'Model memory limit reached'
    }),
    description: _i18n.i18n.translate('xpack.ml.alertTypes.jobsHealthAlertingRule.mmlCheckDescription', {
      defaultMessage: 'Get alerted when job reaches soft or hard model memory limit.'
    })
  },
  delayedData: {
    name: _i18n.i18n.translate('xpack.ml.alertTypes.jobsHealthAlertingRule.delayedDataCheckName', {
      defaultMessage: 'Data delay has occurred'
    }),
    description: _i18n.i18n.translate('xpack.ml.alertTypes.jobsHealthAlertingRule.delayedDataCheckDescription', {
      defaultMessage: 'Get alerted if a job missed data due to data delay.'
    })
  },
  errorMessages: {
    name: _i18n.i18n.translate('xpack.ml.alertTypes.jobsHealthAlertingRule.errorMessagesCheckName', {
      defaultMessage: 'Errors in job messages'
    }),
    description: _i18n.i18n.translate('xpack.ml.alertTypes.jobsHealthAlertingRule.errorMessagesCheckDescription', {
      defaultMessage: 'Get alerted if a job contains errors in the job messages.'
    })
  },
  behindRealtime: {
    name: _i18n.i18n.translate('xpack.ml.alertTypes.jobsHealthAlertingRule.behindRealtimeCheckName', {
      defaultMessage: 'Job is running behind real-time'
    }),
    description: _i18n.i18n.translate('xpack.ml.alertTypes.jobsHealthAlertingRule.behindRealtimeCheckDescription', {
      defaultMessage: 'Job is running behind real-time'
    })
  }
};
exports.HEALTH_CHECK_NAMES = HEALTH_CHECK_NAMES;