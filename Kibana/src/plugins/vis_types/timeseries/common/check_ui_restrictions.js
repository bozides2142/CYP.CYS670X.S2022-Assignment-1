"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isTimerangeModeEnabled = exports.isMetricEnabled = exports.isGroupByFieldsEnabled = exports.isFieldEnabled = exports.isConfigurationFeatureEnabled = void 0;

var _lodash = require("lodash");

var _ui_restrictions = require("./ui_restrictions");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Generic method for checking all types of the UI Restrictions
 * @private
 */
const checkUIRestrictions = (key, type, restrictions = _ui_restrictions.DEFAULT_UI_RESTRICTION) => {
  const isAllEnabled = (0, _lodash.get)(restrictions, `${type}.*`, true);
  return isAllEnabled || Boolean((0, _lodash.get)(restrictions, [type, key], false));
};
/**
 * Using this method, you can check whether a specific Metric (Aggregation) is allowed
 *  for current panel configuration or not.
 * @public
 * @param key - string value of Metric (Aggregation).
 * @param restrictions - uiRestrictions object. Comes from the /data request.
 * @return {boolean}
 */


const isMetricEnabled = (key, restrictions) => {
  return checkUIRestrictions(key, _ui_restrictions.RESTRICTIONS_KEYS.WHITE_LISTED_METRICS, restrictions);
};
/**
 * Using this method, you can check whether a specific Field is allowed
 *  for Metric (aggregation) or not.
 * @public
 * @param field - string value of data Field.
 * @param metricType - string value of Metric (Aggregation).
 * @param restrictions - uiRestrictions object. Comes from the /data request.
 * @return {boolean}
 */


exports.isMetricEnabled = isMetricEnabled;

const isFieldEnabled = (field, metricType, restrictions) => {
  if (isMetricEnabled(metricType, restrictions)) {
    return checkUIRestrictions(field, metricType, restrictions === null || restrictions === void 0 ? void 0 : restrictions[_ui_restrictions.RESTRICTIONS_KEYS.WHITE_LISTED_METRICS]);
  }

  return false;
};
/**
 * Using this method, you can check whether a specific Group By mode is allowed
 *  for current panel configuration or not.
 * @public
 * @param key - string value of Group by mode.
 *  All available mode you can find in the following object SPLIT_MODES.
 * @param restrictions - uiRestrictions object. Comes from the /data request.
 * @return {boolean}
 */


exports.isFieldEnabled = isFieldEnabled;

const isGroupByFieldsEnabled = (key, restrictions) => {
  return checkUIRestrictions(key, _ui_restrictions.RESTRICTIONS_KEYS.WHITE_LISTED_GROUP_BY_FIELDS, restrictions);
};
/**
 * Using this method, you can check whether a specific time range is allowed
 *  for current panel configuration or not.
 * @public
 * @param key - string value of the time range mode.
 *  All available mode you can find in the following object TIME_RANGE_DATA_MODES.
 * @param restrictions - uiRestrictions object. Comes from the /data request.
 * @return {boolean}
 */


exports.isGroupByFieldsEnabled = isGroupByFieldsEnabled;

const isTimerangeModeEnabled = (key, restrictions) => {
  return checkUIRestrictions(key, _ui_restrictions.RESTRICTIONS_KEYS.WHITE_LISTED_TIMERANGE_MODES, restrictions);
};
/**
 * Using this method, you can check whether a specific configuration feature is allowed
 *  for current panel configuration or not.
 * @public
 * @param key - string value of the time range mode.
 *  All available mode you can find in the following object TIME_RANGE_DATA_MODES.
 * @param restrictions - uiRestrictions object. Comes from the /data request.
 * @return {boolean}
 */


exports.isTimerangeModeEnabled = isTimerangeModeEnabled;

const isConfigurationFeatureEnabled = (key, restrictions) => {
  return checkUIRestrictions(key, _ui_restrictions.RESTRICTIONS_KEYS.WHITE_LISTED_CONFIGURATION_FEATURES, restrictions);
};

exports.isConfigurationFeatureEnabled = isConfigurationFeatureEnabled;