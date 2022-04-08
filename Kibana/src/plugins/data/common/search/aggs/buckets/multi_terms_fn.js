"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aggMultiTermsFnName = exports.aggMultiTerms = void 0;

var _i18n = require("@kbn/i18n");

var _ = require("../");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const aggMultiTermsFnName = 'aggMultiTerms';
exports.aggMultiTermsFnName = aggMultiTermsFnName;

const aggMultiTerms = () => ({
  name: aggMultiTermsFnName,
  help: _i18n.i18n.translate('data.search.aggs.function.buckets.multiTerms.help', {
    defaultMessage: 'Generates a serialized agg config for a Multi-Terms agg'
  }),
  type: 'agg_type',
  args: {
    id: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.multiTerms.id.help', {
        defaultMessage: 'ID for this aggregation'
      })
    },
    enabled: {
      types: ['boolean'],
      default: true,
      help: _i18n.i18n.translate('data.search.aggs.buckets.multiTerms.enabled.help', {
        defaultMessage: 'Specifies whether this aggregation should be enabled'
      })
    },
    schema: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.multiTerms.schema.help', {
        defaultMessage: 'Schema to use for this aggregation'
      })
    },
    fields: {
      types: ['string'],
      multi: true,
      required: true,
      help: _i18n.i18n.translate('data.search.aggs.buckets.multiTerms.fields.help', {
        defaultMessage: 'Fields to use for this aggregation'
      })
    },
    order: {
      types: ['string'],
      options: ['asc', 'desc'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.multiTerms.order.help', {
        defaultMessage: 'Order in which to return the results: asc or desc'
      })
    },
    orderBy: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.multiTerms.orderBy.help', {
        defaultMessage: 'Field to order results by'
      })
    },
    orderAgg: {
      types: ['agg_type'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.multiTerms.orderAgg.help', {
        defaultMessage: 'Agg config to use for ordering results'
      })
    },
    size: {
      types: ['number'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.multiTerms.size.help', {
        defaultMessage: 'Max number of buckets to retrieve'
      })
    },
    otherBucket: {
      types: ['boolean'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.multiTerms.otherBucket.help', {
        defaultMessage: 'When set to true, groups together any buckets beyond the allowed size'
      })
    },
    otherBucketLabel: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.multiTerms.otherBucketLabel.help', {
        defaultMessage: 'Default label used in charts for documents in the Other bucket'
      })
    },
    json: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.multiTerms.json.help', {
        defaultMessage: 'Advanced json to include when the agg is sent to Elasticsearch'
      })
    },
    customLabel: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.multiTerms.customLabel.help', {
        defaultMessage: 'Represents a custom label for this aggregation'
      })
    },
    separatorLabel: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.multiTerms.separatorLabel.help', {
        defaultMessage: 'The separator label used to join each term combination'
      })
    }
  },
  fn: (input, args) => {
    var _args$orderAgg;

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
        type: _.BUCKET_TYPES.MULTI_TERMS,
        params: { ...rest,
          orderAgg: (_args$orderAgg = args.orderAgg) === null || _args$orderAgg === void 0 ? void 0 : _args$orderAgg.value
        }
      }
    };
  }
});

exports.aggMultiTerms = aggMultiTerms;