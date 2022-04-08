"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TSVB_METRIC_TYPES = exports.BUCKET_TYPES = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// We should probably use METRIC_TYPES from data plugin in future.
let TSVB_METRIC_TYPES; // We should probably use BUCKET_TYPES from data plugin in future.

exports.TSVB_METRIC_TYPES = TSVB_METRIC_TYPES;

(function (TSVB_METRIC_TYPES) {
  TSVB_METRIC_TYPES["FILTER_RATIO"] = "filter_ratio";
  TSVB_METRIC_TYPES["POSITIVE_RATE"] = "positive_rate";
  TSVB_METRIC_TYPES["PERCENTILE"] = "percentile";
  TSVB_METRIC_TYPES["PERCENTILE_RANK"] = "percentile_rank";
  TSVB_METRIC_TYPES["STATIC"] = "static";
  TSVB_METRIC_TYPES["STD_DEVIATION"] = "std_deviation";
  TSVB_METRIC_TYPES["SUM_OF_SQUARES"] = "sum_of_squares";
  TSVB_METRIC_TYPES["TOP_HIT"] = "top_hit";
  TSVB_METRIC_TYPES["VALUE_COUNT"] = "value_count";
  TSVB_METRIC_TYPES["VARIANCE"] = "variance";
  TSVB_METRIC_TYPES["CALCULATION"] = "calculation";
  TSVB_METRIC_TYPES["MOVING_AVERAGE"] = "moving_average";
  TSVB_METRIC_TYPES["POSITIVE_ONLY"] = "positive_only";
  TSVB_METRIC_TYPES["STD_DEVIATION_BUCKET"] = "std_deviation_bucket";
  TSVB_METRIC_TYPES["SUM_OF_SQUARES_BUCKET"] = "sum_of_squares_bucket";
  TSVB_METRIC_TYPES["VARIANCE_BUCKET"] = "variance_bucket";
  TSVB_METRIC_TYPES["SERIES_AGG"] = "series_agg";
  TSVB_METRIC_TYPES["MATH"] = "math";
})(TSVB_METRIC_TYPES || (exports.TSVB_METRIC_TYPES = TSVB_METRIC_TYPES = {}));

let BUCKET_TYPES;
exports.BUCKET_TYPES = BUCKET_TYPES;

(function (BUCKET_TYPES) {
  BUCKET_TYPES["TERMS"] = "terms";
  BUCKET_TYPES["FILTERS"] = "filters";
})(BUCKET_TYPES || (exports.BUCKET_TYPES = BUCKET_TYPES = {}));