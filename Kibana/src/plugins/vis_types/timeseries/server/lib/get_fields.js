"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFields = getFields;

var _lodash = require("lodash");

var _cached_index_pattern_fetcher = require("./search_strategies/lib/cached_index_pattern_fetcher");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
async function getFields(requestContext, request, framework, indexPatternString) {
  const indexPatternsService = await framework.getIndexPatternsService(requestContext);
  const cachedIndexPatternFetcher = (0, _cached_index_pattern_fetcher.getCachedIndexPatternFetcher)(indexPatternsService);

  if (!indexPatternString) {
    var _defaultIndexPattern$;

    const defaultIndexPattern = await indexPatternsService.getDefault();
    indexPatternString = (_defaultIndexPattern$ = defaultIndexPattern === null || defaultIndexPattern === void 0 ? void 0 : defaultIndexPattern.title) !== null && _defaultIndexPattern$ !== void 0 ? _defaultIndexPattern$ : '';
  }

  const fetchedIndex = await cachedIndexPatternFetcher(indexPatternString);
  const {
    searchStrategy,
    capabilities
  } = await framework.searchStrategyRegistry.getViableStrategy(requestContext, request, fetchedIndex);
  const fields = await searchStrategy.getFieldsForWildcard(fetchedIndex, indexPatternsService, capabilities);
  return (0, _lodash.uniqBy)(fields, field => field.name);
}