"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalizeQuery = void 0;

var _lodash = require("lodash");

var _helpers = require("../../helpers");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const isEmptyFilter = filter => filter && Boolean(filter.match_all) && (0, _lodash.isEmpty)(filter.match_all);

const hasSiblingPipelineAggregation = (aggs = {}) => Object.keys(aggs).length > 1;
/* Last query handler in the chain. You can use this handler
 * as the last place where you can modify the "doc" (request body) object before sending it to ES.

 * Important: for Sibling Pipeline aggregation we cannot apply this logic
 *
 */


const normalizeQuery = () => {
  return () => doc => {
    const series = (0, _lodash.get)(doc, 'aggs.pivot.aggs');
    const normalizedSeries = {};
    (0, _lodash.forEach)(series, (value, seriesId) => {
      const filter = (0, _lodash.get)(value, `filter`);

      if (isEmptyFilter(filter) && !hasSiblingPipelineAggregation(value.aggs)) {
        const agg = (0, _lodash.get)(value, 'aggs.timeseries');
        const meta = { ...(0, _lodash.get)(value, 'meta'),
          seriesId
        };
        (0, _helpers.overwrite)(normalizedSeries, `${seriesId}`, agg);
        (0, _helpers.overwrite)(normalizedSeries, `${seriesId}.meta`, { ...meta,
          normalized: true
        });
      } else {
        (0, _helpers.overwrite)(normalizedSeries, `${seriesId}`, value);
      }
    });
    (0, _helpers.overwrite)(doc, 'aggs.pivot.aggs', normalizedSeries);
    return doc;
  };
};

exports.normalizeQuery = normalizeQuery;