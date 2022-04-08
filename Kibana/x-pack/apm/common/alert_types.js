"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.THRESHOLD_MET_GROUP_ID = exports.AlertType = exports.APM_SERVER_FEATURE_ID = exports.ANOMALY_ALERT_SEVERITY_TYPES = exports.ALERT_TYPES_CONFIG = void 0;
exports.formatErrorCountReason = formatErrorCountReason;
exports.formatTransactionDurationAnomalyReason = formatTransactionDurationAnomalyReason;
exports.formatTransactionDurationReason = formatTransactionDurationReason;
exports.formatTransactionErrorRateReason = formatTransactionErrorRateReason;

var _i18n = require("@kbn/i18n");

var _ml_constants = require("./ml_constants");

var _common = require("../../observability/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const APM_SERVER_FEATURE_ID = 'apm';
exports.APM_SERVER_FEATURE_ID = APM_SERVER_FEATURE_ID;
let AlertType;
exports.AlertType = AlertType;

(function (AlertType) {
  AlertType["ErrorCount"] = "apm.error_rate";
  AlertType["TransactionErrorRate"] = "apm.transaction_error_rate";
  AlertType["TransactionDuration"] = "apm.transaction_duration";
  AlertType["TransactionDurationAnomaly"] = "apm.transaction_duration_anomaly";
})(AlertType || (exports.AlertType = AlertType = {}));

const THRESHOLD_MET_GROUP_ID = 'threshold_met';
exports.THRESHOLD_MET_GROUP_ID = THRESHOLD_MET_GROUP_ID;
const THRESHOLD_MET_GROUP = {
  id: THRESHOLD_MET_GROUP_ID,
  name: _i18n.i18n.translate('xpack.apm.a.thresholdMet', {
    defaultMessage: 'Threshold met'
  })
};

function formatErrorCountReason({
  threshold,
  measured,
  serviceName,
  windowSize,
  windowUnit
}) {
  return _i18n.i18n.translate('xpack.apm.alertTypes.errorCount.reason', {
    defaultMessage: `Error count is {measured} in the last {interval} for {serviceName}. Alert when > {threshold}.`,
    values: {
      threshold,
      measured,
      serviceName,
      interval: (0, _common.formatDurationFromTimeUnitChar)(windowSize, windowUnit)
    }
  });
}

function formatTransactionDurationReason({
  threshold,
  measured,
  serviceName,
  asDuration,
  aggregationType,
  windowSize,
  windowUnit
}) {
  let aggregationTypeFormatted = aggregationType.charAt(0).toUpperCase() + aggregationType.slice(1);
  if (aggregationTypeFormatted === 'Avg') aggregationTypeFormatted = aggregationTypeFormatted + '.';
  return _i18n.i18n.translate('xpack.apm.alertTypes.transactionDuration.reason', {
    defaultMessage: `{aggregationType} latency is {measured} in the last {interval} for {serviceName}. Alert when > {threshold}.`,
    values: {
      threshold: asDuration(threshold),
      measured: asDuration(measured),
      serviceName,
      aggregationType: aggregationTypeFormatted,
      interval: (0, _common.formatDurationFromTimeUnitChar)(windowSize, windowUnit)
    }
  });
}

function formatTransactionErrorRateReason({
  threshold,
  measured,
  serviceName,
  asPercent,
  windowSize,
  windowUnit
}) {
  return _i18n.i18n.translate('xpack.apm.alertTypes.transactionErrorRate.reason', {
    defaultMessage: `Failed transactions is {measured} in the last {interval} for {serviceName}. Alert when > {threshold}.`,
    values: {
      threshold: asPercent(threshold, 100),
      measured: asPercent(measured, 100),
      serviceName,
      interval: (0, _common.formatDurationFromTimeUnitChar)(windowSize, windowUnit)
    }
  });
}

function formatTransactionDurationAnomalyReason({
  serviceName,
  severityLevel,
  measured,
  windowSize,
  windowUnit
}) {
  return _i18n.i18n.translate('xpack.apm.alertTypes.transactionDurationAnomaly.reason', {
    defaultMessage: `{severityLevel} anomaly with a score of {measured} was detected in the last {interval} for {serviceName}.`,
    values: {
      serviceName,
      severityLevel,
      measured,
      interval: (0, _common.formatDurationFromTimeUnitChar)(windowSize, windowUnit)
    }
  });
}

const ALERT_TYPES_CONFIG = {
  [AlertType.ErrorCount]: {
    name: _i18n.i18n.translate('xpack.apm.errorCountAlert.name', {
      defaultMessage: 'Error count threshold'
    }),
    actionGroups: [THRESHOLD_MET_GROUP],
    defaultActionGroupId: THRESHOLD_MET_GROUP_ID,
    minimumLicenseRequired: 'basic',
    producer: APM_SERVER_FEATURE_ID,
    isExportable: true
  },
  [AlertType.TransactionDuration]: {
    name: _i18n.i18n.translate('xpack.apm.transactionDurationAlert.name', {
      defaultMessage: 'Latency threshold'
    }),
    actionGroups: [THRESHOLD_MET_GROUP],
    defaultActionGroupId: THRESHOLD_MET_GROUP_ID,
    minimumLicenseRequired: 'basic',
    producer: APM_SERVER_FEATURE_ID,
    isExportable: true
  },
  [AlertType.TransactionDurationAnomaly]: {
    name: _i18n.i18n.translate('xpack.apm.transactionDurationAnomalyAlert.name', {
      defaultMessage: 'Latency anomaly'
    }),
    actionGroups: [THRESHOLD_MET_GROUP],
    defaultActionGroupId: THRESHOLD_MET_GROUP_ID,
    minimumLicenseRequired: 'basic',
    producer: APM_SERVER_FEATURE_ID,
    isExportable: true
  },
  [AlertType.TransactionErrorRate]: {
    name: _i18n.i18n.translate('xpack.apm.transactionErrorRateAlert.name', {
      defaultMessage: 'Failed transaction rate threshold'
    }),
    actionGroups: [THRESHOLD_MET_GROUP],
    defaultActionGroupId: THRESHOLD_MET_GROUP_ID,
    minimumLicenseRequired: 'basic',
    producer: APM_SERVER_FEATURE_ID,
    isExportable: true
  }
};
exports.ALERT_TYPES_CONFIG = ALERT_TYPES_CONFIG;
const ANOMALY_ALERT_SEVERITY_TYPES = [{
  type: _ml_constants.ANOMALY_SEVERITY.CRITICAL,
  label: _i18n.i18n.translate('xpack.apm.alerts.anomalySeverity.criticalLabel', {
    defaultMessage: 'critical'
  }),
  threshold: _ml_constants.ANOMALY_THRESHOLD.CRITICAL
}, {
  type: _ml_constants.ANOMALY_SEVERITY.MAJOR,
  label: _i18n.i18n.translate('xpack.apm.alerts.anomalySeverity.majorLabel', {
    defaultMessage: 'major'
  }),
  threshold: _ml_constants.ANOMALY_THRESHOLD.MAJOR
}, {
  type: _ml_constants.ANOMALY_SEVERITY.MINOR,
  label: _i18n.i18n.translate('xpack.apm.alerts.anomalySeverity.minor', {
    defaultMessage: 'minor'
  }),
  threshold: _ml_constants.ANOMALY_THRESHOLD.MINOR
}, {
  type: _ml_constants.ANOMALY_SEVERITY.WARNING,
  label: _i18n.i18n.translate('xpack.apm.alerts.anomalySeverity.warningLabel', {
    defaultMessage: 'warning'
  }),
  threshold: _ml_constants.ANOMALY_THRESHOLD.WARNING
}]; // Server side registrations
// x-pack/plugins/apm/server/lib/alerts/<alert>.ts
// x-pack/plugins/apm/server/lib/alerts/register_apm_alerts.ts
// Client side registrations:
// x-pack/plugins/apm/public/components/alerting/<alert>/index.tsx
// x-pack/plugins/apm/public/components/alerting/register_apm_alerts

exports.ANOMALY_ALERT_SEVERITY_TYPES = ANOMALY_ALERT_SEVERITY_TYPES;