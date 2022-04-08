"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isLastValueTimerangeMode = exports.isEntireTimeRangeMode = void 0;

var _enums = require("../../../../common/enums");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const OVERRIDE_INDEX_PATTERN_KEY = 'override_index_pattern';
/**
 * Check if passed 'series' has overridden index pattern or not.
 * @private
 */

const hasOverriddenIndexPattern = series => Boolean(series === null || series === void 0 ? void 0 : series[OVERRIDE_INDEX_PATTERN_KEY]);
/**
 * Get value of Time Range Mode for panel
 * @private
 */


const getPanelTimeRangeMode = panel => panel[_enums.TIME_RANGE_MODE_KEY];
/**
 * Get value of Time Range Mode for series
 * @private
 */


const getSeriesTimeRangeMode = series => series[_enums.TIME_RANGE_MODE_KEY];
/**
 * Check if 'Entire Time Range' mode active or not.
 * @public
 */


const isEntireTimeRangeMode = (panel, series) => {
  if (panel.type === _enums.PANEL_TYPES.TIMESERIES) {
    return false;
  }

  const timeRangeMode = series && hasOverriddenIndexPattern(series) ? getSeriesTimeRangeMode(series) : getPanelTimeRangeMode(panel);
  return timeRangeMode === _enums.TIME_RANGE_DATA_MODES.ENTIRE_TIME_RANGE;
};
/**
 * Check if 'Last Value Time Range' mode active or not.
 * @public
 **/


exports.isEntireTimeRangeMode = isEntireTimeRangeMode;

const isLastValueTimerangeMode = (panel, series) => !isEntireTimeRangeMode(panel, series);

exports.isLastValueTimerangeMode = isLastValueTimerangeMode;