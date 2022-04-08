"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.seriesAgg = void 0;

var _lodash = require("lodash");

var _calculate_label = require("../../../../../common/calculate_label");

var _constants = require("../../../../../common/constants");

var _series_agg = require("./_series_agg");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// @ts-expect-error no typed yet
const seriesAgg = ({
  series,
  meta,
  extractFields
}) => next => async results => {
  if (series.aggregate_by && series.aggregate_function) {
    const targetSeries = []; // Filter out the seires with the matching metric and store them
    // in targetSeries

    results = results.filter(s => {
      if (s.id && s.id.split(_constants.SERIES_SEPARATOR)[0] === series.id) {
        targetSeries.push(s.data);
        return false;
      }

      return true;
    });
    const fn = _series_agg.SeriesAgg[series.aggregate_function];
    const data = fn(targetSeries);
    const fieldsForSeries = meta.index ? await extractFields({
      id: meta.index
    }) : [];
    results.push({
      id: `${series.id}`,
      label: series.label || (0, _calculate_label.calculateLabel)((0, _lodash.last)(series.metrics), series.metrics, fieldsForSeries),
      data: data[0]
    });
  }

  return next(results);
};

exports.seriesAgg = seriesAgg;