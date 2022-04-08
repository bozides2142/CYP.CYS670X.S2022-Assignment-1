"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.percentileRank = void 0;

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
const percentileRank = ({
  response,
  panel,
  series,
  meta,
  extractFields
}) => next => async results => {
  const metric = (0, _helpers.getLastMetric)(series);

  if (metric.type !== _enums.TSVB_METRIC_TYPES.PERCENTILE_RANK) {
    return next(results);
  }

  (await (0, _helpers.getSplits)(response, panel, series, meta, extractFields)).forEach(split => {
    var _last;

    // table allows only one percentile rank in a series (the last one will be chosen in case of several)
    const lastRankValue = (_last = (0, _lodash.last)(metric.values)) !== null && _last !== void 0 ? _last : 0;
    const lastPercentileNumber = (0, _to_percentile_number.toPercentileNumber)(lastRankValue);
    const data = split.timeseries.buckets.map(b => [b.key, (0, _helpers.getAggValue)(b, { ...metric,
      value: lastPercentileNumber
    })]);
    results.push({
      data,
      id: split.id,
      label: `${split.label} (${lastRankValue !== null && lastRankValue !== void 0 ? lastRankValue : 0})`
    });
  });
  return next(results);
};

exports.percentileRank = percentileRank;