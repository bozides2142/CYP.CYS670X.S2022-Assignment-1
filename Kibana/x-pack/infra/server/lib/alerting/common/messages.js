"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.valueActionVariableDescription = exports.timestampActionVariableDescription = exports.thresholdActionVariableDescription = exports.stateToAlertMessage = exports.reasonActionVariableDescription = exports.metricActionVariableDescription = exports.groupActionVariableDescription = exports.buildRecoveredAlertReason = exports.buildNoDataAlertReason = exports.buildInvalidQueryAlertReason = exports.buildFiredAlertReason = exports.buildErrorAlertReason = exports.alertStateActionVariableDescription = exports.DOCUMENT_COUNT_I18N = void 0;

var _i18n = require("@kbn/i18n");

var _metrics = require("../../../../common/alerting/metrics");

var _duration = require("../../../../../observability/common/utils/formatters/duration");

var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const DOCUMENT_COUNT_I18N = _i18n.i18n.translate('xpack.infra.metrics.alerting.threshold.documentCount', {
  defaultMessage: 'Document count'
});

exports.DOCUMENT_COUNT_I18N = DOCUMENT_COUNT_I18N;
const stateToAlertMessage = {
  [_metrics.AlertStates.ALERT]: _i18n.i18n.translate('xpack.infra.metrics.alerting.threshold.alertState', {
    defaultMessage: 'ALERT'
  }),
  [_metrics.AlertStates.WARNING]: _i18n.i18n.translate('xpack.infra.metrics.alerting.threshold.warningState', {
    defaultMessage: 'WARNING'
  }),
  [_metrics.AlertStates.NO_DATA]: _i18n.i18n.translate('xpack.infra.metrics.alerting.threshold.noDataState', {
    defaultMessage: 'NO DATA'
  }),
  [_metrics.AlertStates.ERROR]: _i18n.i18n.translate('xpack.infra.metrics.alerting.threshold.errorState', {
    defaultMessage: 'ERROR'
  }),
  [_metrics.AlertStates.OK]: _i18n.i18n.translate('xpack.infra.metrics.alerting.threshold.okState', {
    defaultMessage: 'OK [Recovered]'
  })
};
exports.stateToAlertMessage = stateToAlertMessage;

const toNumber = value => typeof value === 'string' ? parseFloat(value) : value;

const recoveredComparatorToI18n = (comparator, threshold, currentValue) => {
  const belowText = _i18n.i18n.translate('xpack.infra.metrics.alerting.threshold.belowRecovery', {
    defaultMessage: 'below'
  });

  const aboveText = _i18n.i18n.translate('xpack.infra.metrics.alerting.threshold.aboveRecovery', {
    defaultMessage: 'above'
  });

  switch (comparator) {
    case _metrics.Comparator.BETWEEN:
      return currentValue < threshold[0] ? belowText : aboveText;

    case _metrics.Comparator.OUTSIDE_RANGE:
      return _i18n.i18n.translate('xpack.infra.metrics.alerting.threshold.betweenRecovery', {
        defaultMessage: 'between'
      });

    case _metrics.Comparator.GT:
    case _metrics.Comparator.GT_OR_EQ:
      return belowText;

    case _metrics.Comparator.LT:
    case _metrics.Comparator.LT_OR_EQ:
      return aboveText;
  }
};

const thresholdToI18n = ([a, b]) => {
  if (typeof b === 'undefined') return a;
  return _i18n.i18n.translate('xpack.infra.metrics.alerting.threshold.thresholdRange', {
    defaultMessage: '{a} and {b}',
    values: {
      a,
      b
    }
  });
};

const formatGroup = group => group === _utils.UNGROUPED_FACTORY_KEY ? 'all hosts' : group;

const buildFiredAlertReason = ({
  group,
  metric,
  comparator,
  threshold,
  currentValue,
  timeSize,
  timeUnit
}) => _i18n.i18n.translate('xpack.infra.metrics.alerting.threshold.firedAlertReason', {
  defaultMessage: '{metric} is {currentValue} in the last {duration} for {group}. Alert when {comparator} {threshold}.',
  values: {
    group: formatGroup(group),
    metric,
    comparator,
    threshold: thresholdToI18n(threshold),
    currentValue,
    duration: (0, _duration.formatDurationFromTimeUnitChar)(timeSize, timeUnit)
  }
}); // Once recovered reason messages are re-enabled, checkout this issue https://github.com/elastic/kibana/issues/121272 regarding latest reason format


exports.buildFiredAlertReason = buildFiredAlertReason;

const buildRecoveredAlertReason = ({
  group,
  metric,
  comparator,
  threshold,
  currentValue
}) => _i18n.i18n.translate('xpack.infra.metrics.alerting.threshold.recoveredAlertReason', {
  defaultMessage: '{metric} is now {comparator} a threshold of {threshold} (current value is {currentValue}) for {group}',
  values: {
    metric,
    comparator: recoveredComparatorToI18n(comparator, threshold.map(toNumber), toNumber(currentValue)),
    threshold: thresholdToI18n(threshold),
    currentValue,
    group
  }
});

exports.buildRecoveredAlertReason = buildRecoveredAlertReason;

const buildNoDataAlertReason = ({
  group,
  metric,
  timeSize,
  timeUnit
}) => _i18n.i18n.translate('xpack.infra.metrics.alerting.threshold.noDataAlertReason', {
  defaultMessage: '{metric} reported no data in the last {interval} for {group}',
  values: {
    metric,
    interval: `${timeSize}${timeUnit}`,
    group: formatGroup(group)
  }
});

exports.buildNoDataAlertReason = buildNoDataAlertReason;

const buildErrorAlertReason = metric => _i18n.i18n.translate('xpack.infra.metrics.alerting.threshold.errorAlertReason', {
  defaultMessage: 'Elasticsearch failed when attempting to query data for {metric}',
  values: {
    metric
  }
});

exports.buildErrorAlertReason = buildErrorAlertReason;

const buildInvalidQueryAlertReason = filterQueryText => _i18n.i18n.translate('xpack.infra.metrics.alerting.threshold.queryErrorAlertReason', {
  defaultMessage: 'Alert is using a malformed KQL query: {filterQueryText}',
  values: {
    filterQueryText
  }
});

exports.buildInvalidQueryAlertReason = buildInvalidQueryAlertReason;

const groupActionVariableDescription = _i18n.i18n.translate('xpack.infra.metrics.alerting.groupActionVariableDescription', {
  defaultMessage: 'Name of the group reporting data'
});

exports.groupActionVariableDescription = groupActionVariableDescription;

const alertStateActionVariableDescription = _i18n.i18n.translate('xpack.infra.metrics.alerting.alertStateActionVariableDescription', {
  defaultMessage: 'Current state of the alert'
});

exports.alertStateActionVariableDescription = alertStateActionVariableDescription;

const reasonActionVariableDescription = _i18n.i18n.translate('xpack.infra.metrics.alerting.reasonActionVariableDescription', {
  defaultMessage: 'A description of why the alert is in this state, including which metrics have crossed which thresholds'
});

exports.reasonActionVariableDescription = reasonActionVariableDescription;

const timestampActionVariableDescription = _i18n.i18n.translate('xpack.infra.metrics.alerting.timestampDescription', {
  defaultMessage: 'A timestamp of when the alert was detected.'
});

exports.timestampActionVariableDescription = timestampActionVariableDescription;

const valueActionVariableDescription = _i18n.i18n.translate('xpack.infra.metrics.alerting.valueActionVariableDescription', {
  defaultMessage: 'The value of the metric in the specified condition. Usage: (ctx.value.condition0, ctx.value.condition1, etc...).'
});

exports.valueActionVariableDescription = valueActionVariableDescription;

const metricActionVariableDescription = _i18n.i18n.translate('xpack.infra.metrics.alerting.metricActionVariableDescription', {
  defaultMessage: 'The metric name in the specified condition. Usage: (ctx.metric.condition0, ctx.metric.condition1, etc...).'
});

exports.metricActionVariableDescription = metricActionVariableDescription;

const thresholdActionVariableDescription = _i18n.i18n.translate('xpack.infra.metrics.alerting.thresholdActionVariableDescription', {
  defaultMessage: 'The threshold value of the metric for the specified condition. Usage: (ctx.threshold.condition0, ctx.threshold.condition1, etc...).'
});

exports.thresholdActionVariableDescription = thresholdActionVariableDescription;