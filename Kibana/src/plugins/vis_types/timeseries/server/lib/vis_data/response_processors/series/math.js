"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mathAgg = mathAgg;

var _unit_to_seconds = require("../../helpers/unit_to_seconds");

var _constants = require("../../../../../common/constants");

var _lodash = require("lodash");

var _helpers = require("../../helpers");

var _tinymath = require("@kbn/tinymath");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const percentileValueMatch = /\[([0-9\.]+)\]$/;

function mathAgg(resp, panel, series, meta, extractFields) {
  return next => async results => {
    const mathMetric = (0, _lodash.last)(series.metrics);
    if (mathMetric.type !== 'math') return next(results); // Filter the results down to only the ones that match the series.id. Sometimes
    // there will be data from other series mixed in.

    results = results.filter(s => {
      if (s.id.split(_constants.SERIES_SEPARATOR)[0] === series.id) {
        return false;
      }

      return true;
    });
    const decoration = (0, _helpers.getDefaultDecoration)(series);
    const splits = await (0, _helpers.getSplits)(resp, panel, series, meta, extractFields);
    const mathSeries = splits.map(split => {
      if (mathMetric.variables.length) {
        // Gather the data for the splits. The data will either be a sibling agg or
        // a standard metric/pipeline agg
        const splitData = mathMetric.variables.reduce((acc, v) => {
          const metric = series.metrics.find(m => (0, _lodash.startsWith)(v.field, m.id));
          if (!metric) return acc;

          if (/_bucket$/.test(metric.type)) {
            acc[v.name] = split.timeseries.buckets.map(bucket => {
              return [bucket.key, (0, _helpers.getSiblingAggValue)(split, metric)];
            });
          } else {
            const percentileMatch = v.field.match(percentileValueMatch);
            const m = percentileMatch ? { ...metric,
              percent: percentileMatch[1]
            } : { ...metric
            };
            acc[v.name] = (0, _helpers.mapEmptyToZero)(m, split.timeseries.buckets);
          }

          return acc;
        }, {}); // Create an params._all so the users can access the entire series of data
        // in the Math.js equation

        const all = Object.keys(splitData).reduce((acc, key) => {
          acc[key] = {
            values: splitData[key].map(x => x[1]),
            timestamps: splitData[key].map(x => x[0])
          };
          return acc;
        }, {}); // Get the first var and check that it shows up in the split data otherwise
        // we need to return an empty array for the data since we can't operate
        // without the first variable

        const firstVar = (0, _lodash.first)(mathMetric.variables);

        if (!splitData[firstVar.name]) {
          return {
            id: split.id,
            label: split.label,
            color: split.color,
            data: [],
            ...decoration
          };
        } // Use the first var to collect all the timestamps


        const timestamps = splitData[firstVar.name].map(r => (0, _lodash.first)(r)); // Map the timestamps to actual data

        const data = timestamps.map((ts, index) => {
          const params = mathMetric.variables.reduce((acc, v) => {
            acc[v.name] = (0, _lodash.last)(splitData[v.name].find(row => row[0] === ts));
            return acc;
          }, {}); // If some of the values are null, return the timestamp and null, this is
          // a safety check for the user

          const someNull = (0, _lodash.values)(params).some(v => v == null);
          if (someNull) return [ts, null];

          try {
            var _split$meta;

            // calculate the result based on the user's script and return the value
            const inMsInterval = (0, _unit_to_seconds.convertIntervalToUnit)(((_split$meta = split.meta) === null || _split$meta === void 0 ? void 0 : _split$meta.intervalString) || 0, 'ms');
            const result = (0, _tinymath.evaluate)(mathMetric.script, {
              params: { ...params,
                _index: index,
                _timestamp: ts,
                _all: all,
                _interval: inMsInterval === null || inMsInterval === void 0 ? void 0 : inMsInterval.value
              }
            }); // if the result is an object (usually when the user is working with maps and functions) flatten the results and return the last value.

            if (typeof result === 'object') {
              return [ts, (0, _lodash.last)((0, _lodash.flatten)(result.valueOf()))];
            }

            return [ts, result];
          } catch (e) {
            if (e.message === 'Cannot divide by 0') {
              // Drop division by zero errors and treat as null value
              return [ts, null];
            }

            throw e;
          }
        });
        return {
          id: split.id,
          label: split.label,
          color: split.color,
          data,
          ...decoration
        };
      }
    });
    return next(results.concat(mathSeries));
  };
}