"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSignificantTextBucketAgg = void 0;

var _i18n = require("@kbn/i18n");

var _bucket_agg_type = require("./bucket_agg_type");

var _migrate_include_exclude_format = require("./migrate_include_exclude_format");

var _bucket_agg_types = require("./bucket_agg_types");

var _significant_text_fn = require("./significant_text_fn");

var _common = require("../../../../common");

var _terms = require("./create_filter/terms");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const significantTextTitle = _i18n.i18n.translate('data.search.aggs.buckets.significantTextTitle', {
  defaultMessage: 'Significant Text'
});

const getSignificantTextBucketAgg = () => new _bucket_agg_type.BucketAggType({
  name: _bucket_agg_types.BUCKET_TYPES.SIGNIFICANT_TEXT,
  expressionName: _significant_text_fn.aggSignificantTextFnName,
  title: significantTextTitle,

  makeLabel(aggConfig) {
    return _i18n.i18n.translate('data.search.aggs.buckets.significantTextLabel', {
      defaultMessage: 'Top {size} unusual terms from "{fieldName}" text',
      values: {
        size: aggConfig.params.size,
        fieldName: aggConfig.getFieldDisplayName()
      }
    });
  },

  createFilter: _terms.createFilterTerms,
  params: [{
    name: 'field',
    type: 'field',

    /**
     * Significant text is available only for ES_FIELD_TYPES.TEXT,
     * This information is not available from field.type, so we have to check this using underlying esTypes
     */
    filterField: field => {
      var _field$esTypes;

      return Boolean(field.type === _common.KBN_FIELD_TYPES.STRING && ((_field$esTypes = field.esTypes) === null || _field$esTypes === void 0 ? void 0 : _field$esTypes.includes(_common.ES_FIELD_TYPES.TEXT)));
    }
  }, {
    name: 'size',
    type: 'number'
  }, {
    name: 'min_doc_count',
    type: 'number'
  }, {
    name: 'filter_duplicate_text',
    type: 'boolean'
  }, {
    name: 'exclude',
    displayName: _i18n.i18n.translate('data.search.aggs.buckets.significantText.excludeLabel', {
      defaultMessage: 'Exclude'
    }),
    type: 'string',
    advanced: true,
    ..._migrate_include_exclude_format.migrateIncludeExcludeFormat
  }, {
    name: 'include',
    displayName: _i18n.i18n.translate('data.search.aggs.buckets.significantText.includeLabel', {
      defaultMessage: 'Include'
    }),
    type: 'string',
    advanced: true,
    ..._migrate_include_exclude_format.migrateIncludeExcludeFormat
  }]
});

exports.getSignificantTextBucketAgg = getSignificantTextBucketAgg;