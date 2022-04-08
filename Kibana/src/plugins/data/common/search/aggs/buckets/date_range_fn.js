"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aggDateRangeFnName = exports.aggDateRange = void 0;

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
const aggDateRangeFnName = 'aggDateRange';
exports.aggDateRangeFnName = aggDateRangeFnName;

const aggDateRange = () => ({
  name: aggDateRangeFnName,
  help: _i18n.i18n.translate('data.search.aggs.function.buckets.dateRange.help', {
    defaultMessage: 'Generates a serialized agg config for a Date Range agg'
  }),
  type: 'agg_type',
  args: {
    id: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.dateRange.id.help', {
        defaultMessage: 'ID for this aggregation'
      })
    },
    enabled: {
      types: ['boolean'],
      default: true,
      help: _i18n.i18n.translate('data.search.aggs.buckets.dateRange.enabled.help', {
        defaultMessage: 'Specifies whether this aggregation should be enabled'
      })
    },
    schema: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.dateRange.schema.help', {
        defaultMessage: 'Schema to use for this aggregation'
      })
    },
    field: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.dateRange.field.help', {
        defaultMessage: 'Field to use for this aggregation'
      })
    },
    ranges: {
      types: ['date_range'],
      multi: true,
      help: _i18n.i18n.translate('data.search.aggs.buckets.dateRange.ranges.help', {
        defaultMessage: 'Ranges to use for this aggregation.'
      })
    },
    time_zone: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.dateRange.timeZone.help', {
        defaultMessage: 'Time zone to use for this aggregation.'
      })
    },
    json: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.dateRange.json.help', {
        defaultMessage: 'Advanced json to include when the agg is sent to Elasticsearch'
      })
    },
    customLabel: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.dateRange.customLabel.help', {
        defaultMessage: 'Represents a custom label for this aggregation'
      })
    }
  },
  fn: (input, {
    id,
    enabled,
    schema,
    ranges,
    ...params
  }) => {
    return {
      type: 'agg_type',
      value: {
        id,
        enabled,
        schema,
        params: { ...params,
          ranges: ranges === null || ranges === void 0 ? void 0 : ranges.map(range => (0, _lodash.omit)(range, 'type'))
        },
        type: _.BUCKET_TYPES.DATE_RANGE
      }
    };
  }
});

exports.aggDateRange = aggDateRange;