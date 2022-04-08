"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.seriesAgg = seriesAgg;

var _lodash = require("lodash");

var _series_agg = require("./_series_agg");

var _get_default_decoration = require("../../helpers/get_default_decoration");

var _calculate_label = require("../../../../../common/calculate_label");

var _constants = require("../../../../../common/constants");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function seriesAgg(resp, panel, series, meta, extractFields) {
  return next => async results => {
    if (series.metrics.some(m => m.type === 'series_agg')) {
      const decoration = (0, _get_default_decoration.getDefaultDecoration)(series);
      const targetSeries = []; // Filter out the seires with the matching metric and store them
      // in targetSeries

      results = results.filter(s => {
        if (s.id.split(_constants.SERIES_SEPARATOR)[0] === series.id) {
          targetSeries.push(s.data);
          return false;
        }

        return true;
      });
      const data = series.metrics.filter(m => m.type === 'series_agg').reduce((acc, m) => {
        const fn = _series_agg.SeriesAgg[m.function];
        return fn && fn(acc) || acc;
      }, targetSeries);
      const fieldsForSeries = meta.index ? await extractFields({
        id: meta.index
      }) : [];
      results.push({
        id: `${series.id}`,
        label: series.label || (0, _calculate_label.calculateLabel)((0, _lodash.last)(series.metrics), series.metrics, fieldsForSeries),
        color: series.color,
        data: (0, _lodash.first)(data),
        ...decoration
      });
    }

    return next(results);
  };
}