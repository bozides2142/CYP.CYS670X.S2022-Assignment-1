"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getReasonMessageForUngroupedRatioAlert = exports.getReasonMessageForUngroupedCountAlert = exports.getReasonMessageForGroupedRatioAlert = exports.getReasonMessageForGroupedCountAlert = void 0;

var _i18n = require("@kbn/i18n");

var _types = require("../../../../common/alerting/logs/log_threshold/types");

var _common = require("../../../../../observability/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getReasonMessageForUngroupedCountAlert = (actualCount, expectedCount, comparator, timeSize, timeUnit) => _i18n.i18n.translate('xpack.infra.logs.alerting.threshold.ungroupedCountAlertReasonDescription', {
  defaultMessage: '{actualCount, plural, one {{actualCount} log entry} other {{actualCount} log entries}} in the last {duration}. Alert when {comparator} {expectedCount}.',
  values: {
    actualCount,
    expectedCount,
    comparator: _types.ComparatorToi18nSymbolsMap[comparator],
    duration: (0, _common.formatDurationFromTimeUnitChar)(timeSize, timeUnit)
  }
});

exports.getReasonMessageForUngroupedCountAlert = getReasonMessageForUngroupedCountAlert;

const getReasonMessageForGroupedCountAlert = (actualCount, expectedCount, comparator, groupName, timeSize, timeUnit) => _i18n.i18n.translate('xpack.infra.logs.alerting.threshold.groupedCountAlertReasonDescription', {
  defaultMessage: '{actualCount, plural, one {{actualCount} log entry} other {{actualCount} log entries}} in the last {duration} for {groupName}. Alert when {comparator} {expectedCount}.',
  values: {
    actualCount,
    expectedCount,
    groupName,
    comparator: _types.ComparatorToi18nSymbolsMap[comparator],
    duration: (0, _common.formatDurationFromTimeUnitChar)(timeSize, timeUnit)
  }
});

exports.getReasonMessageForGroupedCountAlert = getReasonMessageForGroupedCountAlert;

const getReasonMessageForUngroupedRatioAlert = (actualRatio, expectedRatio, comparator, timeSize, timeUnit) => _i18n.i18n.translate('xpack.infra.logs.alerting.threshold.ungroupedRatioAlertReasonDescription', {
  defaultMessage: 'The ratio of selected logs is {actualRatio} in the last {duration}. Alert when {comparator} {expectedRatio}.',
  values: {
    actualRatio,
    expectedRatio,
    comparator: _types.ComparatorToi18nSymbolsMap[comparator],
    duration: (0, _common.formatDurationFromTimeUnitChar)(timeSize, timeUnit)
  }
});

exports.getReasonMessageForUngroupedRatioAlert = getReasonMessageForUngroupedRatioAlert;

const getReasonMessageForGroupedRatioAlert = (actualRatio, expectedRatio, comparator, groupName, timeSize, timeUnit) => _i18n.i18n.translate('xpack.infra.logs.alerting.threshold.groupedRatioAlertReasonDescription', {
  defaultMessage: 'The ratio of selected logs is {actualRatio} in the last {duration} for {groupName}. Alert when {comparator} {expectedRatio}.',
  values: {
    actualRatio,
    expectedRatio,
    groupName,
    comparator: _types.ComparatorToi18nSymbolsMap[comparator],
    duration: (0, _common.formatDurationFromTimeUnitChar)(timeSize, timeUnit)
  }
});

exports.getReasonMessageForGroupedRatioAlert = getReasonMessageForGroupedRatioAlert;