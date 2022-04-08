"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.siblingBuckets = void 0;

var _lodash = require("lodash");

var _helpers = require("../../helpers");

var _calculate_agg_root = require("./calculate_agg_root");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const siblingBuckets = ({
  panel
}) => next => async doc => {
  panel.series.forEach(column => {
    const aggRoot = (0, _calculate_agg_root.calculateAggRoot)(doc, column);
    column.metrics.filter(row => /_bucket$/.test(row.type)).forEach(metric => {
      const fn = _helpers.bucketTransform[metric.type];

      if (fn) {
        try {
          const intervalString = (0, _lodash.get)(doc, aggRoot.replace(/\.aggs$/, '.meta.intervalString'));
          const bucket = fn(metric, column.metrics, intervalString);
          (0, _helpers.overwrite)(doc, `${aggRoot}.${metric.id}`, bucket);
        } catch (e) {// meh
        }
      }
    });
  });
  return next(doc);
};

exports.siblingBuckets = siblingBuckets;