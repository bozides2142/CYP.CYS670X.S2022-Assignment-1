"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aggSignificantTextFnName = exports.aggSignificantText = void 0;

var _i18n = require("@kbn/i18n");

var _ = require("../");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const aggSignificantTextFnName = 'aggSignificantText';
exports.aggSignificantTextFnName = aggSignificantTextFnName;

const aggSignificantText = () => ({
  name: aggSignificantTextFnName,
  help: _i18n.i18n.translate('data.search.aggs.function.buckets.significantText.help', {
    defaultMessage: 'Generates a serialized agg config for a Significant Text agg'
  }),
  type: 'agg_type',
  args: {
    id: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.significantText.id.help', {
        defaultMessage: 'ID for this aggregation'
      })
    },
    enabled: {
      types: ['boolean'],
      default: true,
      help: _i18n.i18n.translate('data.search.aggs.buckets.significantText.enabled.help', {
        defaultMessage: 'Specifies whether this aggregation should be enabled'
      })
    },
    schema: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.significantText.schema.help', {
        defaultMessage: 'Schema to use for this aggregation'
      })
    },
    field: {
      types: ['string'],
      required: true,
      help: _i18n.i18n.translate('data.search.aggs.buckets.significantText.field.help', {
        defaultMessage: 'Field to use for this aggregation'
      })
    },
    size: {
      types: ['number'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.significantText.size.help', {
        defaultMessage: 'Max number of buckets to retrieve'
      })
    },
    min_doc_count: {
      types: ['number'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.significantText.minDocCount.help', {
        defaultMessage: 'Return terms that match more than a configured number'
      })
    },
    filter_duplicate_text: {
      types: ['boolean'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.significantText.filterDuplicateText.help', {
        defaultMessage: 'Filtering near-duplicate text'
      })
    },
    exclude: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.significantText.exclude.help', {
        defaultMessage: 'Specific bucket values to exclude from results'
      })
    },
    include: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.significantText.include.help', {
        defaultMessage: 'Specific bucket values to include in results'
      })
    },
    json: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.significantText.json.help', {
        defaultMessage: 'Advanced json to include when the agg is sent to Elasticsearch'
      })
    },
    customLabel: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.significantText.customLabel.help', {
        defaultMessage: 'Represents a custom label for this aggregation'
      })
    }
  },
  fn: (input, args) => {
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
        type: _.BUCKET_TYPES.SIGNIFICANT_TEXT,
        params: { ...rest
        }
      }
    };
  }
});

exports.aggSignificantText = aggSignificantText;