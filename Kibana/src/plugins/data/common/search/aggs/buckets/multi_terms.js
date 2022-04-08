"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMultiTermsBucketAgg = void 0;

var _lodash = require("lodash");

var _i18n = require("@kbn/i18n");

var _bucket_agg_type = require("./bucket_agg_type");

var _bucket_agg_types = require("./bucket_agg_types");

var _multi_terms = require("./create_filter/multi_terms");

var _multi_terms_fn = require("./multi_terms_fn");

var _multi_field_key = require("./multi_field_key");

var _terms_other_bucket_helper = require("./_terms_other_bucket_helper");

var _terms_order_helper = require("./_terms_order_helper");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const termsTitle = _i18n.i18n.translate('data.search.aggs.buckets.multiTermsTitle', {
  defaultMessage: 'Multi-Terms'
});

const getMultiTermsBucketAgg = () => {
  const keyCaches = new WeakMap();
  return new _bucket_agg_type.BucketAggType({
    name: _bucket_agg_types.BUCKET_TYPES.MULTI_TERMS,
    expressionName: _multi_terms_fn.aggMultiTermsFnName,
    title: termsTitle,

    makeLabel(agg) {
      const params = agg.params;
      return agg.getFieldDisplayName() + ': ' + params.order.text;
    },

    getKey(bucket, key, agg) {
      let keys = keyCaches.get(agg);

      if (!keys) {
        keys = new Map();
        keyCaches.set(agg, keys);
      }

      const id = _multi_field_key.MultiFieldKey.idBucket(bucket);

      key = keys.get(id);

      if (!key) {
        key = new _multi_field_key.MultiFieldKey(bucket);
        keys.set(id, key);
      }

      return key;
    },

    getSerializedFormat(agg) {
      const params = agg.params;
      const formats = params.fields ? params.fields.map(field => {
        const fieldSpec = agg.aggConfigs.indexPattern.getFieldByName(field);

        if (!fieldSpec) {
          return {
            id: undefined,
            params: undefined
          };
        }

        return agg.aggConfigs.indexPattern.getFormatterForField(fieldSpec).toJSON();
      }) : [{
        id: undefined,
        params: undefined
      }];
      return {
        id: 'multi_terms',
        params: {
          otherBucketLabel: params.otherBucketLabel,
          paramsPerField: formats,
          separator: agg.params.separatorLabel
        }
      };
    },

    createFilter: _multi_terms.createFilterMultiTerms,
    postFlightRequest: (0, _terms_other_bucket_helper.createOtherBucketPostFlightRequest)(_terms_other_bucket_helper.constructMultiTermOtherFilter),
    params: [{
      name: 'fields',

      write(agg, output, aggs) {
        const params = agg.params;
        output.params.terms = params.fields.map(field => ({
          field
        }));
      }

    }, {
      name: 'orderBy',
      write: _lodash.noop // prevent default write, it's handled by orderAgg

    }, _terms_order_helper.termsOrderAggParamDefinition, {
      name: 'order',
      type: 'optioned',
      default: 'desc',
      options: [{
        text: _i18n.i18n.translate('data.search.aggs.buckets.terms.orderDescendingTitle', {
          defaultMessage: 'Descending'
        }),
        value: 'desc'
      }, {
        text: _i18n.i18n.translate('data.search.aggs.buckets.terms.orderAscendingTitle', {
          defaultMessage: 'Ascending'
        }),
        value: 'asc'
      }],
      write: _lodash.noop // prevent default write, it's handled by orderAgg

    }, {
      name: 'size',
      default: 5
    }, {
      name: 'otherBucket',
      default: false,
      write: _lodash.noop
    }, {
      name: 'otherBucketLabel',
      type: 'string',
      default: _i18n.i18n.translate('data.search.aggs.buckets.terms.otherBucketLabel', {
        defaultMessage: 'Other'
      }),
      displayName: _i18n.i18n.translate('data.search.aggs.otherBucket.labelForOtherBucketLabel', {
        defaultMessage: 'Label for other bucket'
      }),
      shouldShow: agg => agg.getParam('otherBucket'),
      write: _lodash.noop
    }, {
      name: 'separatorLabel',
      type: 'string',
      write: _lodash.noop
    }]
  });
};

exports.getMultiTermsBucketAgg = getMultiTermsBucketAgg;