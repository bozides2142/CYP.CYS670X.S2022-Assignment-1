"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAggTypesFunctions = exports.getAggTypes = void 0;

var buckets = _interopRequireWildcard(require("./buckets"));

var metrics = _interopRequireWildcard(require("./metrics"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/** @internal */
const getAggTypes = () => ({
  metrics: [{
    name: metrics.METRIC_TYPES.COUNT,
    fn: metrics.getCountMetricAgg
  }, {
    name: metrics.METRIC_TYPES.AVG,
    fn: metrics.getAvgMetricAgg
  }, {
    name: metrics.METRIC_TYPES.SUM,
    fn: metrics.getSumMetricAgg
  }, {
    name: metrics.METRIC_TYPES.MEDIAN,
    fn: metrics.getMedianMetricAgg
  }, {
    name: metrics.METRIC_TYPES.SINGLE_PERCENTILE,
    fn: metrics.getSinglePercentileMetricAgg
  }, {
    name: metrics.METRIC_TYPES.MIN,
    fn: metrics.getMinMetricAgg
  }, {
    name: metrics.METRIC_TYPES.MAX,
    fn: metrics.getMaxMetricAgg
  }, {
    name: metrics.METRIC_TYPES.STD_DEV,
    fn: metrics.getStdDeviationMetricAgg
  }, {
    name: metrics.METRIC_TYPES.CARDINALITY,
    fn: metrics.getCardinalityMetricAgg
  }, {
    name: metrics.METRIC_TYPES.PERCENTILES,
    fn: metrics.getPercentilesMetricAgg
  }, {
    name: metrics.METRIC_TYPES.PERCENTILE_RANKS,
    fn: metrics.getPercentileRanksMetricAgg
  }, {
    name: metrics.METRIC_TYPES.TOP_HITS,
    fn: metrics.getTopHitMetricAgg
  }, {
    name: metrics.METRIC_TYPES.DERIVATIVE,
    fn: metrics.getDerivativeMetricAgg
  }, {
    name: metrics.METRIC_TYPES.CUMULATIVE_SUM,
    fn: metrics.getCumulativeSumMetricAgg
  }, {
    name: metrics.METRIC_TYPES.MOVING_FN,
    fn: metrics.getMovingAvgMetricAgg
  }, {
    name: metrics.METRIC_TYPES.SERIAL_DIFF,
    fn: metrics.getSerialDiffMetricAgg
  }, {
    name: metrics.METRIC_TYPES.AVG_BUCKET,
    fn: metrics.getBucketAvgMetricAgg
  }, {
    name: metrics.METRIC_TYPES.SUM_BUCKET,
    fn: metrics.getBucketSumMetricAgg
  }, {
    name: metrics.METRIC_TYPES.MIN_BUCKET,
    fn: metrics.getBucketMinMetricAgg
  }, {
    name: metrics.METRIC_TYPES.MAX_BUCKET,
    fn: metrics.getBucketMaxMetricAgg
  }, {
    name: metrics.METRIC_TYPES.FILTERED_METRIC,
    fn: metrics.getFilteredMetricAgg
  }, {
    name: metrics.METRIC_TYPES.GEO_BOUNDS,
    fn: metrics.getGeoBoundsMetricAgg
  }, {
    name: metrics.METRIC_TYPES.GEO_CENTROID,
    fn: metrics.getGeoCentroidMetricAgg
  }],
  buckets: [{
    name: buckets.BUCKET_TYPES.DATE_HISTOGRAM,
    fn: buckets.getDateHistogramBucketAgg
  }, {
    name: buckets.BUCKET_TYPES.HISTOGRAM,
    fn: buckets.getHistogramBucketAgg
  }, {
    name: buckets.BUCKET_TYPES.RANGE,
    fn: buckets.getRangeBucketAgg
  }, {
    name: buckets.BUCKET_TYPES.DATE_RANGE,
    fn: buckets.getDateRangeBucketAgg
  }, {
    name: buckets.BUCKET_TYPES.IP_RANGE,
    fn: buckets.getIpRangeBucketAgg
  }, {
    name: buckets.BUCKET_TYPES.TERMS,
    fn: buckets.getTermsBucketAgg
  }, {
    name: buckets.BUCKET_TYPES.MULTI_TERMS,
    fn: buckets.getMultiTermsBucketAgg
  }, {
    name: buckets.BUCKET_TYPES.RARE_TERMS,
    fn: buckets.getRareTermsBucketAgg
  }, {
    name: buckets.BUCKET_TYPES.FILTER,
    fn: buckets.getFilterBucketAgg
  }, {
    name: buckets.BUCKET_TYPES.FILTERS,
    fn: buckets.getFiltersBucketAgg
  }, {
    name: buckets.BUCKET_TYPES.SIGNIFICANT_TERMS,
    fn: buckets.getSignificantTermsBucketAgg
  }, {
    name: buckets.BUCKET_TYPES.SIGNIFICANT_TEXT,
    fn: buckets.getSignificantTextBucketAgg
  }, {
    name: buckets.BUCKET_TYPES.GEOHASH_GRID,
    fn: buckets.getGeoHashBucketAgg
  }, {
    name: buckets.BUCKET_TYPES.GEOTILE_GRID,
    fn: buckets.getGeoTitleBucketAgg
  }, {
    name: buckets.BUCKET_TYPES.SAMPLER,
    fn: buckets.getSamplerBucketAgg
  }, {
    name: buckets.BUCKET_TYPES.DIVERSIFIED_SAMPLER,
    fn: buckets.getDiversifiedSamplerBucketAgg
  }]
});
/** @internal */


exports.getAggTypes = getAggTypes;

const getAggTypesFunctions = () => [buckets.aggFilter, buckets.aggFilters, buckets.aggSignificantTerms, buckets.aggSignificantText, buckets.aggIpRange, buckets.aggDateRange, buckets.aggRange, buckets.aggGeoTile, buckets.aggGeoHash, buckets.aggHistogram, buckets.aggDateHistogram, buckets.aggTerms, buckets.aggMultiTerms, buckets.aggRareTerms, buckets.aggSampler, buckets.aggDiversifiedSampler, metrics.aggAvg, metrics.aggBucketAvg, metrics.aggBucketMax, metrics.aggBucketMin, metrics.aggBucketSum, metrics.aggFilteredMetric, metrics.aggCardinality, metrics.aggCount, metrics.aggCumulativeSum, metrics.aggDerivative, metrics.aggGeoBounds, metrics.aggGeoCentroid, metrics.aggMax, metrics.aggMedian, metrics.aggSinglePercentile, metrics.aggMin, metrics.aggMovingAvg, metrics.aggPercentileRanks, metrics.aggPercentiles, metrics.aggSerialDiff, metrics.aggStdDeviation, metrics.aggSum, metrics.aggTopHit];

exports.getAggTypesFunctions = getAggTypesFunctions;