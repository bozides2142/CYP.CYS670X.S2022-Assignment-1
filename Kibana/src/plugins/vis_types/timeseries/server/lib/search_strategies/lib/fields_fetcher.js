"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFieldsFetcher = void 0;

var _index_patterns_utils = require("../../../../common/index_patterns_utils");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const createFieldsFetcher = (req, {
  capabilities,
  indexPatternsService,
  searchStrategy,
  cachedIndexPatternFetcher
}) => {
  const fieldsCacheMap = new Map();
  return async indexPatternValue => {
    const key = (0, _index_patterns_utils.getIndexPatternKey)(indexPatternValue);

    if (fieldsCacheMap.has(key)) {
      return fieldsCacheMap.get(key);
    }

    const fetchedIndex = await cachedIndexPatternFetcher(indexPatternValue);
    const fields = await searchStrategy.getFieldsForWildcard(fetchedIndex, indexPatternsService, capabilities);
    fieldsCacheMap.set(key, fields);
    return fields;
  };
};

exports.createFieldsFetcher = createFieldsFetcher;