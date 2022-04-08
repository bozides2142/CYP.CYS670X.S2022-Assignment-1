"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDiversifiedSamplerBucketAgg = exports.DIVERSIFIED_SAMPLER_AGG_NAME = void 0;

var _i18n = require("@kbn/i18n");

var _bucket_agg_type = require("./bucket_agg_type");

var _diversified_sampler_fn = require("./diversified_sampler_fn");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const DIVERSIFIED_SAMPLER_AGG_NAME = 'diversified_sampler';
exports.DIVERSIFIED_SAMPLER_AGG_NAME = DIVERSIFIED_SAMPLER_AGG_NAME;

const title = _i18n.i18n.translate('data.search.aggs.buckets.diversifiedSamplerTitle', {
  defaultMessage: 'Diversified sampler',
  description: 'Diversified sampler aggregation title'
});

/**
 * Like the sampler aggregation this is a filtering aggregation used to limit any sub aggregations' processing to a sample of the top-scoring documents.
 * The diversified_sampler aggregation adds the ability to limit the number of matches that share a common value.
 */
const getDiversifiedSamplerBucketAgg = () => new _bucket_agg_type.BucketAggType({
  name: DIVERSIFIED_SAMPLER_AGG_NAME,
  title,
  customLabels: false,
  expressionName: _diversified_sampler_fn.aggDiversifiedSamplerFnName,
  params: [{
    name: 'shard_size',
    type: 'number'
  }, {
    name: 'max_docs_per_value',
    type: 'number'
  }, {
    name: 'field',
    type: 'field'
  }]
});

exports.getDiversifiedSamplerBucketAgg = getDiversifiedSamplerBucketAgg;