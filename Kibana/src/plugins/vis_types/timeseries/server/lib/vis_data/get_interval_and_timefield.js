"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIntervalAndTimefield = getIntervalAndTimefield;

var _moment = _interopRequireDefault(require("moment"));

var _constants = require("../../../common/constants");

var _fields_utils = require("../../../common/fields_utils");

var _validate_interval = require("../../../common/validate_interval");

var _errors = require("../../../common/errors");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function getIntervalAndTimefield(panel, index, {
  min,
  max,
  maxBuckets
}, series) {
  var _index$indexPattern;

  let timeField = (series !== null && series !== void 0 && series.override_index_pattern ? series.series_time_field : panel.time_field) || ((_index$indexPattern = index.indexPattern) === null || _index$indexPattern === void 0 ? void 0 : _index$indexPattern.timeFieldName); // should use @timestamp as default timeField for es indeces if user doesn't provide timeField

  if (!panel.use_kibana_indexes && !timeField) {
    timeField = '@timestamp';
  }

  if (panel.use_kibana_indexes) {
    if (timeField) {
      (0, _fields_utils.validateField)(timeField, index);
    } else {
      throw new _errors.TimeFieldNotSpecifiedError();
    }
  }

  let interval = panel.interval;
  let maxBars = panel.max_bars;

  if (series !== null && series !== void 0 && series.override_index_pattern) {
    interval = series.series_interval || _constants.AUTO_INTERVAL;
    maxBars = series.series_max_bars;
  }

  (0, _validate_interval.validateInterval)({
    min: _moment.default.utc(min),
    max: _moment.default.utc(max)
  }, interval, maxBuckets);
  return {
    maxBars,
    timeField,
    interval: interval || _constants.AUTO_INTERVAL
  };
}