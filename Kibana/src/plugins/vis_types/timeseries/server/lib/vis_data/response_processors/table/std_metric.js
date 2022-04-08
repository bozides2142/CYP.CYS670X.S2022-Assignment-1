"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stdMetric = void 0;

var _helpers = require("../../helpers");

var _enums = require("../../../../../common/enums");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const stdMetric = ({
  response,
  panel,
  series,
  meta,
  extractFields
}) => next => async results => {
  const metric = (0, _helpers.getLastMetric)(series);

  if (metric.type === _enums.TSVB_METRIC_TYPES.STD_DEVIATION && metric.mode === 'band') {
    return next(results);
  }

  if ([_enums.TSVB_METRIC_TYPES.PERCENTILE_RANK, _enums.TSVB_METRIC_TYPES.PERCENTILE].includes(metric.type)) {
    return next(results);
  }

  if (/_bucket$/.test(metric.type)) {
    return next(results);
  }

  (await (0, _helpers.getSplits)(response, panel, series, meta, extractFields)).forEach(split => {
    const data = (0, _helpers.mapEmptyToZero)(metric, split.timeseries.buckets);
    results.push({
      id: split.id,
      label: split.label,
      data
    });
  });
  return next(results);
};

exports.stdMetric = stdMetric;