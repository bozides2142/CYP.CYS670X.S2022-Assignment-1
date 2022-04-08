"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapEmptyToZero = void 0;

var _get_agg_value = require("./get_agg_value");

var _common = require("../../../../../../data/common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// @ts-expect-error not typed yet
const mapEmptyToZero = (metric, buckets) => {
  // Metric types where an empty set equals `zero`
  const isSettableToZero = [_common.METRIC_TYPES.COUNT, _common.METRIC_TYPES.CARDINALITY, _common.METRIC_TYPES.SUM].includes(metric.type);
  return isSettableToZero && !buckets.length ? [[undefined, 0]] : buckets.map(bucket => [bucket.key, (0, _get_agg_value.getAggValue)(bucket, metric)]);
};

exports.mapEmptyToZero = mapEmptyToZero;