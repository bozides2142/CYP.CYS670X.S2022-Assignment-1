"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aggSamplerFnName = exports.aggSampler = void 0;

var _i18n = require("@kbn/i18n");

var _sampler = require("./sampler");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const aggSamplerFnName = 'aggSampler';
exports.aggSamplerFnName = aggSamplerFnName;

const aggSampler = () => ({
  name: aggSamplerFnName,
  help: _i18n.i18n.translate('data.search.aggs.function.buckets.sampler.help', {
    defaultMessage: 'Generates a serialized agg config for a Sampler agg'
  }),
  type: 'agg_type',
  args: {
    id: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.sampler.id.help', {
        defaultMessage: 'ID for this aggregation'
      })
    },
    enabled: {
      types: ['boolean'],
      default: true,
      help: _i18n.i18n.translate('data.search.aggs.buckets.sampler.enabled.help', {
        defaultMessage: 'Specifies whether this aggregation should be enabled'
      })
    },
    schema: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.sampler.schema.help', {
        defaultMessage: 'Schema to use for this aggregation'
      })
    },
    shard_size: {
      types: ['number'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.sampler.shardSize.help', {
        defaultMessage: 'The shard_size parameter limits how many top-scoring documents are collected in the sample processed on each shard.'
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
        type: _sampler.SAMPLER_AGG_NAME,
        params: { ...rest
        }
      }
    };
  }
});

exports.aggSampler = aggSampler;