"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.siblingPipelineType = exports.siblingPipelineAggHelper = void 0;

var _i18n = require("@kbn/i18n");

var _sibling_pipeline_agg_writer = require("./sibling_pipeline_agg_writer");

var _nested_agg_helpers = require("./nested_agg_helpers");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const metricAggFilter = ['!top_hits', '!percentiles', '!percentile_ranks', '!median', '!std_dev', '!sum_bucket', '!avg_bucket', '!min_bucket', '!max_bucket', '!derivative', '!moving_avg', '!serial_diff', '!cumulative_sum', '!geo_bounds', '!geo_centroid', '!filtered_metric', '!single_percentile'];
const bucketAggFilter = ['!filter', '!sampler', '!diversified_sampler', '!multi_terms'];

const siblingPipelineType = _i18n.i18n.translate('data.search.aggs.metrics.siblingPipelineAggregationsSubtypeTitle', {
  defaultMessage: 'Sibling pipeline aggregations'
});

exports.siblingPipelineType = siblingPipelineType;
const siblingPipelineAggHelper = {
  subtype: siblingPipelineType,

  params(bucketFilter = bucketAggFilter) {
    return [{
      name: 'customBucket',
      type: 'agg',
      allowedAggs: bucketFilter,
      default: null,

      makeAgg(agg, state = {
        type: 'date_histogram'
      }) {
        const orderAgg = agg.aggConfigs.createAggConfig(state, {
          addToAggConfigs: false
        });
        orderAgg.id = agg.id + '-bucket';
        return orderAgg;
      },

      modifyAggConfigOnSearchRequestStart: (0, _nested_agg_helpers.forwardModifyAggConfigOnSearchRequestStart)('customBucket'),
      write: () => {}
    }, {
      name: 'customMetric',
      type: 'agg',
      allowedAggs: metricAggFilter,
      default: null,

      makeAgg(agg, state = {
        type: 'count'
      }) {
        const orderAgg = agg.aggConfigs.createAggConfig(state, {
          addToAggConfigs: false
        });
        orderAgg.id = agg.id + '-metric';
        return orderAgg;
      },

      modifyAggConfigOnSearchRequestStart: (0, _nested_agg_helpers.forwardModifyAggConfigOnSearchRequestStart)('customMetric'),
      write: (agg, output) => (0, _sibling_pipeline_agg_writer.siblingPipelineAggWriter)(agg, output)
    }];
  },

  getSerializedFormat(agg) {
    const customMetric = agg.getParam('customMetric');
    return customMetric ? customMetric.type.getSerializedFormat(customMetric) : {};
  }

};
exports.siblingPipelineAggHelper = siblingPipelineAggHelper;