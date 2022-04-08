"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aggFilteredMetricFnName = exports.aggFilteredMetric = void 0;

var _i18n = require("@kbn/i18n");

var _ = require("../");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const aggFilteredMetricFnName = 'aggFilteredMetric';
exports.aggFilteredMetricFnName = aggFilteredMetricFnName;

const aggFilteredMetric = () => ({
  name: aggFilteredMetricFnName,
  help: _i18n.i18n.translate('data.search.aggs.function.metrics.filtered_metric.help', {
    defaultMessage: 'Generates a serialized agg config for a filtered metric agg'
  }),
  type: 'agg_type',
  args: {
    id: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.filtered_metric.id.help', {
        defaultMessage: 'ID for this aggregation'
      })
    },
    enabled: {
      types: ['boolean'],
      default: true,
      help: _i18n.i18n.translate('data.search.aggs.metrics.filtered_metric.enabled.help', {
        defaultMessage: 'Specifies whether this aggregation should be enabled'
      })
    },
    schema: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.filtered_metric.schema.help', {
        defaultMessage: 'Schema to use for this aggregation'
      })
    },
    customBucket: {
      types: ['agg_type'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.filtered_metric.customBucket.help', {
        defaultMessage: 'Agg config to use for building sibling pipeline aggregations. Has to be a filter aggregation'
      })
    },
    customMetric: {
      types: ['agg_type'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.filtered_metric.customMetric.help', {
        defaultMessage: 'Agg config to use for building sibling pipeline aggregations'
      })
    },
    customLabel: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.filtered_metric.customLabel.help', {
        defaultMessage: 'Represents a custom label for this aggregation'
      })
    },
    timeShift: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.metrics.timeShift.help', {
        defaultMessage: 'Shift the time range for the metric by a set time, for example 1h or 7d. "previous" will use the closest time range from the date histogram or time range filter.'
      })
    }
  },
  fn: (input, args) => {
    var _args$customBucket, _args$customMetric;

    const {
      id,
      enabled,
      schema,
      ...rest
    } = args;
    return {
      type: 'agg_type',
      value: {
        id,
        enabled,
        schema,
        type: _.METRIC_TYPES.FILTERED_METRIC,
        params: { ...rest,
          customBucket: (_args$customBucket = args.customBucket) === null || _args$customBucket === void 0 ? void 0 : _args$customBucket.value,
          customMetric: (_args$customMetric = args.customMetric) === null || _args$customMetric === void 0 ? void 0 : _args$customMetric.value
        }
      }
    };
  }
});

exports.aggFilteredMetric = aggFilteredMetric;