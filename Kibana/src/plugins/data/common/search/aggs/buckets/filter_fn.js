"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aggFilterFnName = exports.aggFilter = void 0;

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
const aggFilterFnName = 'aggFilter';
exports.aggFilterFnName = aggFilterFnName;

const aggFilter = () => ({
  name: aggFilterFnName,
  help: _i18n.i18n.translate('data.search.aggs.function.buckets.filter.help', {
    defaultMessage: 'Generates a serialized agg config for a Filter agg'
  }),
  type: 'agg_type',
  args: {
    id: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.filter.id.help', {
        defaultMessage: 'ID for this aggregation'
      })
    },
    enabled: {
      types: ['boolean'],
      default: true,
      help: _i18n.i18n.translate('data.search.aggs.buckets.filter.enabled.help', {
        defaultMessage: 'Specifies whether this aggregation should be enabled'
      })
    },
    schema: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.filter.schema.help', {
        defaultMessage: 'Schema to use for this aggregation'
      })
    },
    geo_bounding_box: {
      types: ['geo_bounding_box'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.filter.geoBoundingBox.help', {
        defaultMessage: 'Filter results based on a point location within a bounding box'
      })
    },
    filter: {
      types: ['kibana_query'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.filter.filter.help', {
        defaultMessage: 'Filter results based on a kql or lucene query. Do not use together with geo_bounding_box'
      })
    },
    json: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.filter.json.help', {
        defaultMessage: 'Advanced json to include when the agg is sent to Elasticsearch'
      })
    },
    customLabel: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.filter.customLabel.help', {
        defaultMessage: 'Represents a custom label for this aggregation'
      })
    }
  },
  fn: (input, {
    id,
    enabled,
    schema,
    geo_bounding_box: geoBoundingBox,
    filter,
    ...params
  }) => {
    if (geoBoundingBox && filter) {
      throw new Error("filter and geo_bounding_box can't be used together");
    }

    return {
      type: 'agg_type',
      value: {
        id,
        enabled,
        schema,
        params: { ...params,
          geo_bounding_box: geoBoundingBox && (0, _lodash.omit)(geoBoundingBox, 'type'),
          filter: filter && (0, _lodash.omit)(filter, 'type')
        },
        type: _.BUCKET_TYPES.FILTER
      }
    };
  }
});

exports.aggFilter = aggFilter;