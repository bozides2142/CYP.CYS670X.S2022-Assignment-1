"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.REALTIME_ISSUE_DETECTED = exports.ANOMALY_DETECTION_JOB_REALTIME_ISSUE = void 0;
exports.registerJobsMonitoringRuleType = registerJobsMonitoringRuleType;

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


const ANOMALY_DETECTION_JOB_REALTIME_ISSUE = 'anomaly_detection_realtime_issue';
exports.ANOMALY_DETECTION_JOB_REALTIME_ISSUE = ANOMALY_DETECTION_JOB_REALTIME_ISSUE;
const REALTIME_ISSUE_DETECTED = {
  id: ANOMALY_DETECTION_JOB_REALTIME_ISSUE,
  name: _i18n.i18n.translate('xpack.ml.jobsHealthAlertingRule.actionGroupName', {
    defaultMessage: 'Issue detected'
  })
};
exports.REALTIME_ISSUE_DETECTED = REALTIME_ISSUE_DETECTED;

function registerJobsMonitoringRuleType({
  alerting,
  mlServicesProviders,
  logger
}) {
  alerting.registerType({
    id: _alerts.ML_ALERT_TYPES.AD_JOBS_HEALTH,
    name: _i18n.i18n.translate('xpack.ml.jobsHealthAlertingRule.name', {
      defaultMessage: 'Anomaly detection jobs health'
    }),
    actionGroups: [REALTIME_ISSUE_DETECTED],
    defaultActionGroupId: ANOMALY_DETECTION_JOB_REALTIME_ISSUE,
    validate: {
      params: _alerting_schema.anomalyDetectionJobsHealthRuleParams
    },
    actionVariables: {
      context: [{
        name: 'results',
        description: _i18n.i18n.translate('xpack.ml.alertTypes.jobsHealthAlertingRule.alertContext.resultsDescription', {
          defaultMessage: 'Results of the rule execution'
        })
      }, {
        name: 'message',
        description: _i18n.i18n.translate('xpack.ml.alertTypes.jobsHealthAlertingRule.alertContext.messageDescription', {
          defaultMessage: 'Alert info message'
        })
      }]
    },
    producer: _app.PLUGIN_ID,
    minimumLicenseRequired: _license.MINIMUM_FULL_LICENSE,
    isExportable: true,

    async executor(options) {
      const {
        services,
        name
      } = options;
      const fakeRequest = {};
      const {
        getTestsResults
      } = mlServicesProviders.jobsHealthServiceProvider(services.savedObjectsClient, fakeRequest, logger);
      const executionResult = await getTestsResults(options);

      if (executionResult.length > 0) {
        logger.debug(`"${name}" rule is scheduling actions for tests: ${executionResult.map(v => v.name).join(', ')}`);
        executionResult.forEach(({
          name: alertInstanceName,
          context
        }) => {
          const alertInstance = services.alertInstanceFactory(alertInstanceName);
          alertInstance.scheduleActions(ANOMALY_DETECTION_JOB_REALTIME_ISSUE, context);
        });
      }
    }

  });
}