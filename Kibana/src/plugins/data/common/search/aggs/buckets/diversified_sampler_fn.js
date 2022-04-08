"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aggDiversifiedSamplerFnName = exports.aggDiversifiedSampler = void 0;

var _i18n = require("@kbn/i18n");

var _diversified_sampler = require("./diversified_sampler");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const aggDiversifiedSamplerFnName = 'aggDiversifiedSampler';
exports.aggDiversifiedSamplerFnName = aggDiversifiedSamplerFnName;

const aggDiversifiedSampler = () => ({
  name: aggDiversifiedSamplerFnName,
  help: _i18n.i18n.translate('data.search.aggs.function.buckets.diversifiedSampler.help', {
    defaultMessage: 'Generates a serialized agg config for a Diversified sampler agg'
  }),
  type: 'agg_type',
  args: {
    id: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.diversifiedSampler.id.help', {
        defaultMessage: 'ID for this aggregation'
      })
    },
    enabled: {
      types: ['boolean'],
      default: true,
      help: _i18n.i18n.translate('data.search.aggs.buckets.diversifiedSampler.enabled.help', {
        defaultMessage: 'Specifies whether this aggregation should be enabled'
      })
    },
    schema: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.diversifiedSampler.schema.help', {
        defaultMessage: 'Schema to use for this aggregation'
      })
    },
    shard_size: {
      types: ['number'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.diversifiedSampler.shardSize.help', {
        defaultMessage: 'The shard_size parameter limits how many top-scoring documents are collected in the sample processed on each shard.'
      })
    },
    max_docs_per_value: {
      types: ['number'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.diversifiedSampler.maxDocsPerValue.help', {
        defaultMessage: 'Limits how many documents are permitted per choice of de-duplicating value.'
      })
    },
    field: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.diversifiedSampler.field.help', {
        defaultMessage: 'Used to provide values used for de-duplication.'
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
        type: _diversified_sampler.DIVERSIFIED_SAMPLER_AGG_NAME,
        params: { ...rest
        }
      }
    };
  }
});

exports.aggDiversifiedSampler = aggDiversifiedSampler;