"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aggIpRangeFnName = exports.aggIpRange = void 0;

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
const aggIpRangeFnName = 'aggIpRange';
exports.aggIpRangeFnName = aggIpRangeFnName;

const aggIpRange = () => ({
  name: aggIpRangeFnName,
  help: _i18n.i18n.translate('data.search.aggs.function.buckets.ipRange.help', {
    defaultMessage: 'Generates a serialized agg config for a Ip Range agg'
  }),
  type: 'agg_type',
  args: {
    id: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.ipRange.id.help', {
        defaultMessage: 'ID for this aggregation'
      })
    },
    enabled: {
      types: ['boolean'],
      default: true,
      help: _i18n.i18n.translate('data.search.aggs.buckets.ipRange.enabled.help', {
        defaultMessage: 'Specifies whether this aggregation should be enabled'
      })
    },
    schema: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.ipRange.schema.help', {
        defaultMessage: 'Schema to use for this aggregation'
      })
    },
    field: {
      types: ['string'],
      required: true,
      help: _i18n.i18n.translate('data.search.aggs.buckets.ipRange.field.help', {
        defaultMessage: 'Field to use for this aggregation'
      })
    },
    ipRangeType: {
      types: ['string'],
      options: ['mask', 'fromTo'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.ipRange.ipRangeType.help', {
        defaultMessage: 'IP range type to use for this aggregation. Takes one of the following values: mask, fromTo.'
      })
    },
    ranges: {
      types: ['cidr', 'ip_range'],
      multi: true,
      help: _i18n.i18n.translate('data.search.aggs.buckets.ipRange.ranges.help', {
        defaultMessage: 'Ranges to use for this aggregation.'
      })
    },
    json: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.ipRange.json.help', {
        defaultMessage: 'Advanced json to include when the agg is sent to Elasticsearch'
      })
    },
    customLabel: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.ipRange.customLabel.help', {
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
    const {
      ip_range: fromTo,
      cidr: mask
    } = (0, _lodash.mapValues)((0, _lodash.groupBy)(ranges, 'type'), items => (0, _lodash.map)(items, item => (0, _lodash.omit)(item, 'type')));
    const rangesParam = (0, _lodash.omitBy)({
      fromTo,
      mask
    }, _lodash.isNil);
    return {
      type: 'agg_type',
      value: {
        id,
        enabled,
        schema,
        type: _.BUCKET_TYPES.IP_RANGE,
        params: { ...params,
          ranges: (0, _lodash.isEmpty)(rangesParam) ? undefined : rangesParam
        }
      }
    };
  }
});

exports.aggIpRange = aggIpRange;