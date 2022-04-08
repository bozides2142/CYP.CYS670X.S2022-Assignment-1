"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTermsBucketAgg = void 0;
Object.defineProperty(exports, "termsAggFilter", {
  enumerable: true,
  get: function () {
    return _terms_order_helper.termsAggFilter;
  }
});

var _lodash = require("lodash");

var _i18n = require("@kbn/i18n");

var _bucket_agg_type = require("./bucket_agg_type");

var _bucket_agg_types = require("./bucket_agg_types");

var _terms = require("./create_filter/terms");

var _migrate_include_exclude_format = require("./migrate_include_exclude_format");

var _terms_fn = require("./terms_fn");

var _common = require("../../../../common");

var _terms_other_bucket_helper = require("./_terms_other_bucket_helper");

var _terms_order_helper = require("./_terms_order_helper");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const termsTitle = _i18n.i18n.translate('data.search.aggs.buckets.termsTitle', {
  defaultMessage: 'Terms'
});

const getTermsBucketAgg = () => new _bucket_agg_type.BucketAggType({
  name: _bucket_agg_types.BUCKET_TYPES.TERMS,
  expressionName: _terms_fn.aggTermsFnName,
  title: termsTitle,

  makeLabel(agg) {
    const params = agg.params;
    return agg.getFieldDisplayName() + ': ' + params.order.text;
  },

  getSerializedFormat(agg) {
    const format = agg.params.field ? agg.aggConfigs.indexPattern.getFormatterForField(agg.params.field).toJSON() : {
      id: undefined,
      params: undefined
    };
    return {
      id: 'terms',
      params: {
        id: format.id,
        otherBucketLabel: agg.params.otherBucketLabel,
        missingBucketLabel: agg.params.missingBucketLabel,
        ...format.params
      }
    };
  },

  createFilter: _terms.createFilterTerms,
  postFlightRequest: (0, _terms_other_bucket_helper.createOtherBucketPostFlightRequest)(_terms_other_bucket_helper.constructSingleTermOtherFilter),
  hasPrecisionError: aggBucket => Boolean(aggBucket === null || aggBucket === void 0 ? void 0 : aggBucket.doc_count_error_upper_bound),
  params: [{
    name: 'field',
    type: 'field',
    filterFieldTypes: [_common.KBN_FIELD_TYPES.NUMBER, _common.KBN_FIELD_TYPES.BOOLEAN, _common.KBN_FIELD_TYPES.DATE, _common.KBN_FIELD_TYPES.IP, _common.KBN_FIELD_TYPES.STRING]
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
    name: 'missingBucket',
    default: false,
    write: _lodash.noop
  }, {
    name: 'missingBucketLabel',
    default: _i18n.i18n.translate('data.search.aggs.buckets.terms.missingBucketLabel', {
      defaultMessage: 'Missing',
      description: `Default label used in charts when documents are missing a field.
          Visible when you create a chart with a terms aggregation and enable "Show missing values"`
    }),
    type: 'string',
    displayName: _i18n.i18n.translate('data.search.aggs.otherBucket.labelForMissingValuesLabel', {
      defaultMessage: 'Label for missing values'
    }),
    shouldShow: agg => agg.getParam('missingBucket'),
    write: _lodash.noop
  }, {
    name: 'exclude',
    displayName: _i18n.i18n.translate('data.search.aggs.buckets.terms.excludeLabel', {
      defaultMessage: 'Exclude'
    }),
    type: 'string',
    advanced: true,
    shouldShow: _migrate_include_exclude_format.isStringOrNumberType,
    ..._migrate_include_exclude_format.migrateIncludeExcludeFormat
  }, {
    name: 'include',
    displayName: _i18n.i18n.translate('data.search.aggs.buckets.terms.includeLabel', {
      defaultMessage: 'Include'
    }),
    type: 'string',
    advanced: true,
    shouldShow: _migrate_include_exclude_format.isStringOrNumberType,
    ..._migrate_include_exclude_format.migrateIncludeExcludeFormat
  }]
});

exports.getTermsBucketAgg = getTermsBucketAgg;