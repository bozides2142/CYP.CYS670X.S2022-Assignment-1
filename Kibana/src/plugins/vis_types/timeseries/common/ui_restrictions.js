"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.limitOfSeries = exports.RESTRICTIONS_KEYS = exports.DEFAULT_UI_RESTRICTION = void 0;

var _enums = require("./enums");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * UI Restrictions keys
 * @constant
 * @public
 */
let RESTRICTIONS_KEYS;
exports.RESTRICTIONS_KEYS = RESTRICTIONS_KEYS;

(function (RESTRICTIONS_KEYS) {
  RESTRICTIONS_KEYS["WHITE_LISTED_GROUP_BY_FIELDS"] = "whiteListedGroupByFields";
  RESTRICTIONS_KEYS["WHITE_LISTED_METRICS"] = "whiteListedMetrics";
  RESTRICTIONS_KEYS["WHITE_LISTED_TIMERANGE_MODES"] = "whiteListedTimerangeModes";
  RESTRICTIONS_KEYS["WHITE_LISTED_CONFIGURATION_FEATURES"] = "whiteListedConfigurationFeatures";
})(RESTRICTIONS_KEYS || (exports.RESTRICTIONS_KEYS = RESTRICTIONS_KEYS = {}));

/**
 * Default value for the UIRestriction
 * @constant
 * @public
 */
const DEFAULT_UI_RESTRICTION = {
  '*': true
};
/** limit on the number of series for the panel
 * @constant
 * @public
 */

exports.DEFAULT_UI_RESTRICTION = DEFAULT_UI_RESTRICTION;
const limitOfSeries = {
  [_enums.PANEL_TYPES.GAUGE]: 1,
  [_enums.PANEL_TYPES.METRIC]: 2
};
exports.limitOfSeries = limitOfSeries;