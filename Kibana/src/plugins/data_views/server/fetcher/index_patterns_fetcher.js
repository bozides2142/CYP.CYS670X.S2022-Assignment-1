"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IndexPatternsFetcher = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = require("lodash");

var _lib = require("./lib");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class IndexPatternsFetcher {
  constructor(elasticsearchClient, allowNoIndices = false) {
    (0, _defineProperty2.default)(this, "elasticsearchClient", void 0);
    (0, _defineProperty2.default)(this, "allowNoIndices", void 0);
    this.elasticsearchClient = elasticsearchClient;
    this.allowNoIndices = allowNoIndices;
  }
  /**
   *  Get a list of field objects for an index pattern that may contain wildcards
   *
   *  @param {Object} [options]
   *  @property {String} options.pattern The index pattern
   *  @property {Number} options.metaFields The list of underscore prefixed fields that should
   *                                        be left in the field list (all others are removed).
   *  @return {Promise<Array<Fields>>}
   */


  async getFieldsForWildcard(options) {
    const {
      pattern,
      metaFields = [],
      fieldCapsOptions,
      type,
      rollupIndex,
      filter
    } = options;
    const patternList = Array.isArray(pattern) ? pattern : pattern.split(',');
    const allowNoIndices = fieldCapsOptions ? fieldCapsOptions.allow_no_indices : this.allowNoIndices;
    let patternListActive = patternList; // if only one pattern, don't bother with validation. We let getFieldCapabilities fail if the single pattern is bad regardless

    if (patternList.length > 1 && !allowNoIndices) {
      patternListActive = await this.validatePatternListActive(patternList);
    }

    const fieldCapsResponse = await (0, _lib.getFieldCapabilities)({
      callCluster: this.elasticsearchClient,
      indices: patternListActive,
      metaFields,
      fieldCapsOptions: {
        allow_no_indices: allowNoIndices
      },
      filter
    });

    if (type === 'rollup' && rollupIndex) {
      const rollupFields = [];
      const rollupIndexCapabilities = (0, _lib.getCapabilitiesForRollupIndices)((await this.elasticsearchClient.rollup.getRollupIndexCaps({
        index: rollupIndex
      })).body)[rollupIndex].aggs;
      const fieldCapsResponseObj = (0, _lodash.keyBy)(fieldCapsResponse, 'name'); // Keep meta fields

      metaFields.forEach(field => fieldCapsResponseObj[field] && rollupFields.push(fieldCapsResponseObj[field]));
      return (0, _lib.mergeCapabilitiesWithFields)(rollupIndexCapabilities, fieldCapsResponseObj, rollupFields);
    }

    return fieldCapsResponse;
  }
  /**
   *  Get a list of field objects for a time pattern
   *
   *  @param {Object} [options={}]
   *  @property {String} options.pattern The moment compatible time pattern
   *  @property {Number} options.lookBack The number of indices we will pull mappings for
   *  @property {Number} options.metaFields The list of underscore prefixed fields that should
   *                                        be left in the field list (all others are removed).
   *  @return {Promise<Array<Fields>>}
   */


  async getFieldsForTimePattern(options) {
    const {
      pattern,
      lookBack,
      metaFields
    } = options;
    const {
      matches
    } = await (0, _lib.resolveTimePattern)(this.elasticsearchClient, pattern);
    const indices = matches.slice(0, lookBack);

    if (indices.length === 0) {
      throw (0, _lib.createNoMatchingIndicesError)(pattern);
    }

    return await (0, _lib.getFieldCapabilities)({
      callCluster: this.elasticsearchClient,
      indices,
      metaFields
    });
  }
  /**
   *  Returns an index pattern list of only those index pattern strings in the given list that return indices
   *
   *  @param patternList string[]
   *  @return {Promise<string[]>}
   */


  async validatePatternListActive(patternList) {
    const result = await Promise.all(patternList.map(async index => {
      // perserve negated patterns
      if (index.startsWith('-')) {
        return true;
      }

      const searchResponse = await this.elasticsearchClient.fieldCaps({
        index,
        fields: '_id',
        ignore_unavailable: true,
        allow_no_indices: false
      });
      return searchResponse.body.indices.length > 0;
    }).map(p => p.catch(() => false)));
    return result.reduce((acc, isValid, patternListIndex) => isValid ? [...acc, patternList[patternListIndex]] : acc, []);
  }

}

exports.IndexPatternsFetcher = IndexPatternsFetcher;