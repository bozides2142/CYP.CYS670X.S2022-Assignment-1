"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stdSibling = void 0;

var _helpers = require("../../helpers");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const stdSibling = ({
  response,
  panel,
  series,
  meta,
  extractFields
}) => next => async results => {
  const metric = (0, _helpers.getLastMetric)(series);
  if (!/_bucket$/.test(metric.type)) return next(results);
  if (metric.type === 'std_deviation_bucket' && metric.mode === 'band') return next(results);
  (await (0, _helpers.getSplits)(response, panel, series, meta, extractFields)).forEach(split => {
    const data = split.timeseries.buckets.map(b => {
      return [b.key, (0, _helpers.getSiblingAggValue)(split, metric)];
    });
    results.push({
      id: split.id,
      label: split.label,
      data
    });
  });
  return next(results);
};

exports.stdSibling = stdSibling;