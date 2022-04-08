"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aggDateHistogramFnName = exports.aggDateHistogram = void 0;

var _lodash = require("lodash");

var _i18n = require("@kbn/i18n");

var _ = require("../");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const aggDateHistogramFnName = 'aggDateHistogram';
exports.aggDateHistogramFnName = aggDateHistogramFnName;

const aggDateHistogram = () => ({
  name: aggDateHistogramFnName,
  help: _i18n.i18n.translate('data.search.aggs.function.buckets.dateHistogram.help', {
    defaultMessage: 'Generates a serialized agg config for a Histogram agg'
  }),
  type: 'agg_type',
  args: {
    id: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.dateHistogram.id.help', {
        defaultMessage: 'ID for this aggregation'
      })
    },
    enabled: {
      types: ['boolean'],
      default: true,
      help: _i18n.i18n.translate('data.search.aggs.buckets.dateHistogram.enabled.help', {
        defaultMessage: 'Specifies whether this aggregation should be enabled'
      })
    },
    schema: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.dateHistogram.schema.help', {
        defaultMessage: 'Schema to use for this aggregation'
      })
    },
    field: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.dateHistogram.field.help', {
        defaultMessage: 'Field to use for this aggregation'
      })
    },
    useNormalizedEsInterval: {
      types: ['boolean'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.dateHistogram.useNormalizedEsInterval.help', {
        defaultMessage: 'Specifies whether to use useNormalizedEsInterval for this aggregation'
      })
    },
    time_zone: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.dateHistogram.timeZone.help', {
        defaultMessage: 'Time zone to use for this aggregation'
      })
    },
    format: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.dateHistogram.format.help', {
        defaultMessage: 'Format to use for this aggregation'
      })
    },
    scaleMetricValues: {
      types: ['boolean'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.dateHistogram.scaleMetricValues.help', {
        defaultMessage: 'Specifies whether to use scaleMetricValues for this aggregation'
      })
    },
    interval: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.dateHistogram.interval.help', {
        defaultMessage: 'Interval to use for this aggregation'
      })
    },
    timeRange: {
      types: ['timerange'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.dateHistogram.timeRange.help', {
        defaultMessage: 'Time Range to use for this aggregation'
      })
    },
    min_doc_count: {
      types: ['number'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.dateHistogram.minDocCount.help', {
        defaultMessage: 'Minimum document count to use for this aggregation'
      })
    },
    drop_partials: {
      types: ['boolean'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.dateHistogram.dropPartials.help', {
        defaultMessage: 'Specifies whether to use drop_partials for this aggregation'
      })
    },
    extended_bounds: {
      types: ['extended_bounds'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.dateHistogram.extendedBounds.help', {
        defaultMessage: 'With extended_bounds setting, you now can "force" the histogram aggregation to start building buckets on a specific min value and also keep on building buckets up to a max value '
      })
    },
    json: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.dateHistogram.json.help', {
        defaultMessage: 'Advanced json to include when the agg is sent to Elasticsearch'
      })
    },
    customLabel: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.dateHistogram.customLabel.help', {
        defaultMessage: 'Represents a custom label for this aggregation'
      })
    }
  },
  fn: (input, {
    id,
    enabled,
    schema,
    timeRange,
    extended_bounds: extendedBounds,
    ...params
  }) => {
    return {
      type: 'agg_type',
      value: {
        id,
        enabled,
        schema,
        params: { ...params,
          timeRange: timeRange && (0, _lodash.omit)(timeRange, 'type'),
          extended_bounds: extendedBounds && (0, _lodash.omit)(extendedBounds, 'type')
        },
        type: _.BUCKET_TYPES.DATE_HISTOGRAM
      }
    };
  }
});

exports.aggDateHistogram = aggDateHistogram;