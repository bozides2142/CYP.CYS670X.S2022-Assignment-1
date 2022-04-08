"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.THRESHOLD_MET_GROUP = exports.ANOMALY_SCORE_MATCH_GROUP_ID = void 0;
exports.registerAnomalyDetectionAlertType = registerAnomalyDetectionAlertType;

var _i18n = require("@kbn/i18n");

var _alerts = require("../../../common/constants/alerts");

var _app = require("../../../common/constants/app");

var _license = require("../../../common/license");

var _alerting_schema = require("../../routes/schemas/alerting_schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ANOMALY_SCORE_MATCH_GROUP_ID = 'anomaly_score_match';
exports.ANOMALY_SCORE_MATCH_GROUP_ID = ANOMALY_SCORE_MATCH_GROUP_ID;
const THRESHOLD_MET_GROUP = {
  id: ANOMALY_SCORE_MATCH_GROUP_ID,
  name: _i18n.i18n.translate('xpack.ml.anomalyDetectionAlert.actionGroupName', {
    defaultMessage: 'Anomaly score matched the condition'
  })
};
exports.THRESHOLD_MET_GROUP = THRESHOLD_MET_GROUP;

function registerAnomalyDetectionAlertType({
  alerting,
  mlSharedServices
}) {
  alerting.registerType({
    id: _alerts.ML_ALERT_TYPES.ANOMALY_DETECTION,
    name: _i18n.i18n.translate('xpack.ml.anomalyDetectionAlert.name', {
      defaultMessage: 'Anomaly detection alert'
    }),
    actionGroups: [THRESHOLD_MET_GROUP],
    defaultActionGroupId: ANOMALY_SCORE_MATCH_GROUP_ID,
    validate: {
      params: _alerting_schema.mlAnomalyDetectionAlertParams
    },
    actionVariables: {
      context: [{
        name: 'timestamp',
        description: _i18n.i18n.translate('xpack.ml.alertContext.timestampDescription', {
          defaultMessage: 'The bucket timestamp of the anomaly'
        })
      }, {
        name: 'timestampIso8601',
        description: _i18n.i18n.translate('xpack.ml.alertContext.timestampIso8601Description', {
          defaultMessage: 'The bucket time of the anomaly in ISO8601 format'
        })
      }, {
        name: 'jobIds',
        description: _i18n.i18n.translate('xpack.ml.alertContext.jobIdsDescription', {
          defaultMessage: 'List of job IDs that triggered the alert'
        })
      }, {
        name: 'message',
        description: _i18n.i18n.translate('xpack.ml.alertContext.messageDescription', {
          defaultMessage: 'Alert info message'
        })
      }, {
        name: 'isInterim',
        description: _i18n.i18n.translate('xpack.ml.alertContext.isInterimDescription', {
          defaultMessage: 'Indicate if top hits contain interim results'
        })
      }, {
        name: 'score',
        description: _i18n.i18n.translate('xpack.ml.alertContext.scoreDescription', {
          defaultMessage: 'Anomaly score at the time of the notification action'
        })
      }, {
        name: 'topRecords',
        description: _i18n.i18n.translate('xpack.ml.alertContext.topRecordsDescription', {
          defaultMessage: 'Top records'
        })
      }, {
        name: 'topInfluencers',
        description: _i18n.i18n.translate('xpack.ml.alertContext.topInfluencersDescription', {
          defaultMessage: 'Top influencers'
        })
      }, {
        name: 'anomalyExplorerUrl',
        description: _i18n.i18n.translate('xpack.ml.alertContext.anomalyExplorerUrlDescription', {
          defaultMessage: 'URL to open in the Anomaly Explorer'
        }),
        useWithTripleBracesInTemplates: true
      }]
    },
    producer: _app.PLUGIN_ID,
    minimumLicenseRequired: _license.MINIMUM_FULL_LICENSE,
    isExportable: true,

    async executor({
      services,
      params,
      alertId,
      state,
      previousStartedAt,
      startedAt
    }) {
      const fakeRequest = {};
      const {
        execute
      } = mlSharedServices.alertingServiceProvider(services.savedObjectsClient, fakeRequest);
      const executionResult = await execute(params, startedAt, previousStartedAt);

      if (executionResult) {
        const alertInstanceName = executionResult.name;
        const alertInstance = services.alertInstanceFactory(alertInstanceName);
        alertInstance.scheduleActions(ANOMALY_SCORE_MATCH_GROUP_ID, executionResult);
      }
    }

  });
}