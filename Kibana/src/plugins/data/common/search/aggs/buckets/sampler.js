"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSamplerBucketAgg = exports.SAMPLER_AGG_NAME = void 0;

var _i18n = require("@kbn/i18n");

var _bucket_agg_type = require("./bucket_agg_type");

var _sampler_fn = require("./sampler_fn");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const SAMPLER_AGG_NAME = 'sampler';
exports.SAMPLER_AGG_NAME = SAMPLER_AGG_NAME;

const title = _i18n.i18n.translate('data.search.aggs.buckets.samplerTitle', {
  defaultMessage: 'Sampler',
  description: 'Sampler aggregation title'
});

/**
 * A filtering aggregation used to limit any sub aggregations' processing to a sample of the top-scoring documents.
 */
const getSamplerBucketAgg = () => new _bucket_agg_type.BucketAggType({
  name: SAMPLER_AGG_NAME,
  title,
  customLabels: false,
  expressionName: _sampler_fn.aggSamplerFnName,
  params: [{
    name: 'shard_size',
    type: 'number'
  }]
});

exports.getSamplerBucketAgg = getSamplerBucketAgg;