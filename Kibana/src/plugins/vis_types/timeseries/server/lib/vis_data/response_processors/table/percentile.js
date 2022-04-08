"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.percentile = void 0;

var _lodash = require("lodash");

var _helpers = require("../../helpers");

var _to_percentile_number = require("../../../../../common/to_percentile_number");

var _enums = require("../../../../../common/enums");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const percentile = ({
  response,
  panel,
  series,
  meta,
  extractFields
}) => next => async results => {
  const metric = (0, _helpers.getLastMetric)(series);

  if (metric.type !== _enums.TSVB_METRIC_TYPES.PERCENTILE) {
    return next(results);
  }

  (await (0, _helpers.getSplits)(response, panel, series, meta, extractFields)).forEach(split => {
    var _last$value, _last;

    // table allows only one percentile in a series (the last one will be chosen in case of several)
    const lastPercentile = (_last$value = (_last = (0, _lodash.last)(metric.percentiles)) === null || _last === void 0 ? void 0 : _last.value) !== null && _last$value !== void 0 ? _last$value : 0;
    const percentileKey = (0, _to_percentile_number.toPercentileNumber)(lastPercentile);
    const data = split.timeseries.buckets.map(b => [b.key, b[metric.id].values[percentileKey]]);
    results.push({
      id: split.id,
      label: `${split.label} (${lastPercentile !== null && lastPercentile !== void 0 ? lastPercentile : 0})`,
      data: data
    });
  });
  return next(results);
};

exports.percentile = percentile;