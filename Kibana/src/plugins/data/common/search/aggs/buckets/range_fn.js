"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aggRangeFnName = exports.aggRange = void 0;

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
const aggRangeFnName = 'aggRange';
exports.aggRangeFnName = aggRangeFnName;

const aggRange = () => ({
  name: aggRangeFnName,
  help: _i18n.i18n.translate('data.search.aggs.function.buckets.range.help', {
    defaultMessage: 'Generates a serialized agg config for a Range agg'
  }),
  type: 'agg_type',
  args: {
    id: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.range.id.help', {
        defaultMessage: 'ID for this aggregation'
      })
    },
    enabled: {
      types: ['boolean'],
      default: true,
      help: _i18n.i18n.translate('data.search.aggs.buckets.range.enabled.help', {
        defaultMessage: 'Specifies whether this aggregation should be enabled'
      })
    },
    schema: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.range.schema.help', {
        defaultMessage: 'Schema to use for this aggregation'
      })
    },
    field: {
      types: ['string'],
      required: true,
      help: _i18n.i18n.translate('data.search.aggs.buckets.range.field.help', {
        defaultMessage: 'Field to use for this aggregation'
      })
    },
    ranges: {
      types: ['numerical_range'],
      multi: true,
      help: _i18n.i18n.translate('data.search.aggs.buckets.range.ranges.help', {
        defaultMessage: 'Serialized ranges to use for this aggregation.'
      })
    },
    json: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.range.json.help', {
        defaultMessage: 'Advanced json to include when the agg is sent to Elasticsearch'
      })
    },
    customLabel: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.range.customLabel.help', {
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
        type: _.BUCKET_TYPES.RANGE
      }
    };
  }
});

exports.aggRange = aggRange;