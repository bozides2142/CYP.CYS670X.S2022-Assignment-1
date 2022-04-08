"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCachedIndexPatternFetcher = void 0;

var _index_patterns_utils = require("../../../../common/index_patterns_utils");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getCachedIndexPatternFetcher = (indexPatternsService, globalOptions = {
  fetchKibanaIndexForStringIndexes: false
}) => {
  const cache = new Map();
  return async (indexPatternValue, fetchKibanaIndexForStringIndexes = globalOptions.fetchKibanaIndexForStringIndexes) => {
    const key = `${(0, _index_patterns_utils.getIndexPatternKey)(indexPatternValue)}:${fetchKibanaIndexForStringIndexes}`;

    if (cache.has(key)) {
      return cache.get(key);
    }

    const fetchedIndex = (0, _index_patterns_utils.fetchIndexPattern)(indexPatternValue, indexPatternsService, {
      fetchKibanaIndexForStringIndexes
    });
    cache.set(key, fetchedIndex);
    return fetchedIndex;
  };
};

exports.getCachedIndexPatternFetcher = getCachedIndexPatternFetcher;