"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRareTermsBucketAgg = void 0;

var _i18n = require("@kbn/i18n");

var _bucket_agg_type = require("./bucket_agg_type");

var _bucket_agg_types = require("./bucket_agg_types");

var _terms = require("./create_filter/terms");

var _rare_terms_fn = require("./rare_terms_fn");

var _common = require("../../../../common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const termsTitle = _i18n.i18n.translate('data.search.aggs.buckets.rareTermsTitle', {
  defaultMessage: 'Rare terms'
});

const getRareTermsBucketAgg = () => {
  return new _bucket_agg_type.BucketAggType({
    name: _bucket_agg_types.BUCKET_TYPES.RARE_TERMS,
    expressionName: _rare_terms_fn.aggRareTermsFnName,
    title: termsTitle,

    makeLabel(agg) {
      return _i18n.i18n.translate('data.search.aggs.rareTerms.aggTypesLabel', {
        defaultMessage: 'Rare terms of {fieldName}',
        values: {
          fieldName: agg.getFieldDisplayName()
        }
      });
    },

    createFilter: _terms.createFilterTerms,
    params: [{
      name: 'field',
      type: 'field',
      filterFieldTypes: [_common.KBN_FIELD_TYPES.NUMBER, _common.KBN_FIELD_TYPES.BOOLEAN, _common.KBN_FIELD_TYPES.DATE, _common.KBN_FIELD_TYPES.IP, _common.KBN_FIELD_TYPES.STRING]
    }, {
      name: 'max_doc_count',
      default: 1
    }]
  });
};

exports.getRareTermsBucketAgg = getRareTermsBucketAgg;