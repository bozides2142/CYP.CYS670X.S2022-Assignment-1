"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aggRareTermsFnName = exports.aggRareTerms = void 0;

var _i18n = require("@kbn/i18n");

var _ = require("../");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const aggRareTermsFnName = 'aggRareTerms';
exports.aggRareTermsFnName = aggRareTermsFnName;

const aggRareTerms = () => ({
  name: aggRareTermsFnName,
  help: _i18n.i18n.translate('data.search.aggs.function.buckets.rareTerms.help', {
    defaultMessage: 'Generates a serialized agg config for a Rare-Terms agg'
  }),
  type: 'agg_type',
  args: {
    id: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.rareTerms.id.help', {
        defaultMessage: 'ID for this aggregation'
      })
    },
    enabled: {
      types: ['boolean'],
      default: true,
      help: _i18n.i18n.translate('data.search.aggs.buckets.rareTerms.enabled.help', {
        defaultMessage: 'Specifies whether this aggregation should be enabled'
      })
    },
    schema: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.rareTerms.schema.help', {
        defaultMessage: 'Schema to use for this aggregation'
      })
    },
    field: {
      types: ['string'],
      required: true,
      help: _i18n.i18n.translate('data.search.aggs.buckets.rareTerms.fields.help', {
        defaultMessage: 'Field to use for this aggregation'
      })
    },
    max_doc_count: {
      types: ['number'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.rareTerms.maxDocCount.help', {
        defaultMessage: 'Maximum number of times a term is allowed to occur to qualify as rare'
      })
    },
    json: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.multiTerms.json.help', {
        defaultMessage: 'Advanced json to include when the agg is sent to Elasticsearch'
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
        type: _.BUCKET_TYPES.RARE_TERMS,
        params: { ...rest
        }
      }
    };
  }
});

exports.aggRareTerms = aggRareTerms;