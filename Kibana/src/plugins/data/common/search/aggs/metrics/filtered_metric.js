"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFilteredMetricAgg = void 0;

var _i18n = require("@kbn/i18n");

var _metric_agg_type = require("./metric_agg_type");

var _make_nested_label = require("./lib/make_nested_label");

var _sibling_pipeline_agg_helper = require("./lib/sibling_pipeline_agg_helper");

var _metric_agg_types = require("./metric_agg_types");

var _filtered_metric_fn = require("./filtered_metric_fn");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const filteredMetricLabel = _i18n.i18n.translate('data.search.aggs.metrics.filteredMetricLabel', {
  defaultMessage: 'filtered'
});

const filteredMetricTitle = _i18n.i18n.translate('data.search.aggs.metrics.filteredMetricTitle', {
  defaultMessage: 'Filtered metric'
});

const getFilteredMetricAgg = () => {
  const {
    subtype,
    params,
    getSerializedFormat
  } = _sibling_pipeline_agg_helper.siblingPipelineAggHelper;
  return new _metric_agg_type.MetricAggType({
    name: _metric_agg_types.METRIC_TYPES.FILTERED_METRIC,
    expressionName: _filtered_metric_fn.aggFilteredMetricFnName,
    title: filteredMetricTitle,
    makeLabel: agg => (0, _make_nested_label.makeNestedLabel)(agg, filteredMetricLabel),
    subtype,
    params: [...params(['filter'])],
    hasNoDslParams: true,
    getSerializedFormat,

    getValue(agg, bucket) {
      const customMetric = agg.getParam('customMetric');
      const customBucket = agg.getParam('customBucket');
      return bucket && bucket[customBucket.id] && customMetric.getValue(bucket[customBucket.id]);
    },

    getValueBucketPath(agg) {
      const customBucket = agg.getParam('customBucket');
      const customMetric = agg.getParam('customMetric');

      if (customMetric.type.name === 'count') {
        return customBucket.getValueBucketPath();
      }

      return `${customBucket.getValueBucketPath()}>${customMetric.getValueBucketPath()}`;
    },

    getResponseId(agg) {
      return agg.params.customBucket.id;
    }

  });
};

exports.getFilteredMetricAgg = getFilteredMetricAgg;