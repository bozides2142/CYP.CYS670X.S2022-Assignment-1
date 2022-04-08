"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stdMetric = stdMetric;

var _helpers = require("../../helpers");

var _enums = require("../../../../../common/enums");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function stdMetric(resp, panel, series, meta, extractFields) {
  return next => async results => {
    const metric = (0, _helpers.getLastMetric)(series);

    if (metric.type === _enums.TSVB_METRIC_TYPES.STD_DEVIATION && metric.mode === 'band') {
      return next(results);
    }

    if ([_enums.TSVB_METRIC_TYPES.PERCENTILE_RANK, _enums.TSVB_METRIC_TYPES.PERCENTILE].includes(metric.type)) {
      return next(results);
    }

    if (/_bucket$/.test(metric.type)) return next(results);
    const decoration = (0, _helpers.getDefaultDecoration)(series);
    (await (0, _helpers.getSplits)(resp, panel, series, meta, extractFields)).forEach(split => {
      const data = (0, _helpers.mapEmptyToZero)(metric, split.timeseries.buckets);
      results.push({
        id: `${split.id}`,
        label: split.label,
        splitByLabel: split.splitByLabel,
        labelFormatted: split.labelFormatted,
        color: split.color,
        data,
        ...decoration
      });
    });
    return next(results);
  };
}