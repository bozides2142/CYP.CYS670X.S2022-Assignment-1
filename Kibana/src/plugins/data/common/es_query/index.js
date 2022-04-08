"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FILTERS = exports.COMPARE_ALL_OPTIONS = void 0;
Object.defineProperty(exports, "FilterStateStore", {
  enumerable: true,
  get: function () {
    return _esQuery.FilterStateStore;
  }
});
exports.fromKueryExpression = exports.enableFilter = exports.disableFilter = exports.dedupFilters = exports.decorateQuery = exports.compareFilters = exports.buildRangeFilter = exports.buildQueryFromFilters = exports.buildQueryFilter = exports.buildPhrasesFilter = exports.buildPhraseFilter = exports.buildFilter = exports.buildExistsFilter = exports.buildEsQuery = exports.buildEmptyFilter = exports.buildCustomFilter = void 0;
Object.defineProperty(exports, "getEsQueryConfig", {
  enumerable: true,
  get: function () {
    return _get_es_query_config.getEsQueryConfig;
  }
});
exports.uniqFilters = exports.toggleFilterNegated = exports.toggleFilterDisabled = exports.toElasticsearchQuery = exports.pinFilter = exports.onlyDisabledFiltersChanged = exports.nodeTypes = exports.nodeBuilder = exports.luceneStringToDsl = exports.isRangeFilter = exports.isQueryStringFilter = exports.isPhrasesFilter = exports.isPhraseFilter = exports.isMatchAllFilter = exports.isFilters = exports.isFilterPinned = exports.isFilterDisabled = exports.isFilter = exports.isExistsFilter = exports.getPhraseFilterValue = exports.getPhraseFilterField = void 0;

var _get_es_query_config = require("./get_es_query_config");

var _esQuery = require("@kbn/es-query");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// NOTE: Trick to deprecate exports https://stackoverflow.com/a/49152018/372086

/**
 * @deprecated Import from the "@kbn/es-query" package directly instead.
 * @removeBy 8.1
 */
const isFilter = _esQuery.isFilter;
/**
 * @deprecated Import from the "@kbn/es-query" package directly instead.
 * @removeBy 8.1
 */

exports.isFilter = isFilter;
const isFilterDisabled = _esQuery.isFilterDisabled;
/**
 * @deprecated Import from the "@kbn/es-query" package directly instead.
 * @removeBy 8.1
 */

exports.isFilterDisabled = isFilterDisabled;
const disableFilter = _esQuery.disableFilter;
/**
 * @deprecated Import from the "@kbn/es-query" package directly instead.
 * @removeBy 8.1
 */

exports.disableFilter = disableFilter;
const fromKueryExpression = _esQuery.fromKueryExpression;
/**
 * @deprecated Import from the "@kbn/es-query" package directly instead.
 * @removeBy 8.1
 */

exports.fromKueryExpression = fromKueryExpression;
const toElasticsearchQuery = _esQuery.toElasticsearchQuery;
/**
 * @deprecated Import from the "@kbn/es-query" package directly instead.
 * @removeBy 8.1
 */

exports.toElasticsearchQuery = toElasticsearchQuery;
const nodeTypes = _esQuery.nodeTypes;
/**
 * @deprecated Import from the "@kbn/es-query" package directly instead.
 * @removeBy 8.1
 */

exports.nodeTypes = nodeTypes;
const buildEsQuery = _esQuery.buildEsQuery;
/**
 * @deprecated Import from the "@kbn/es-query" package directly instead.
 * @removeBy 8.1
 */

exports.buildEsQuery = buildEsQuery;
const buildQueryFromFilters = _esQuery.buildQueryFromFilters;
/**
 * @deprecated Import from the "@kbn/es-query" package directly instead.
 * @removeBy 8.1
 */

exports.buildQueryFromFilters = buildQueryFromFilters;
const luceneStringToDsl = _esQuery.luceneStringToDsl;
/**
 * @deprecated Import from the "@kbn/es-query" package directly instead.
 * @removeBy 8.1
 */

exports.luceneStringToDsl = luceneStringToDsl;
const decorateQuery = _esQuery.decorateQuery;
/**
 * @deprecated Import from the "@kbn/es-query" package directly instead.
 * @removeBy 8.1
 */

exports.decorateQuery = decorateQuery;
const getPhraseFilterField = _esQuery.getPhraseFilterField;
/**
 * @deprecated Import from the "@kbn/es-query" package directly instead.
 * @removeBy 8.1
 */

exports.getPhraseFilterField = getPhraseFilterField;
const getPhraseFilterValue = _esQuery.getPhraseFilterValue;
/**
 * @deprecated Import from the "@kbn/es-query" package directly instead.
 * @removeBy 8.1
 */

exports.getPhraseFilterValue = getPhraseFilterValue;
const isFilterPinned = _esQuery.isFilterPinned;
/**
 * @deprecated Import from the "@kbn/es-query" package directly instead.
 * @removeBy 8.1
 */

exports.isFilterPinned = isFilterPinned;
const nodeBuilder = _esQuery.nodeBuilder;
/**
 * @deprecated Import from the "@kbn/es-query" package directly instead.
 * @removeBy 8.1
 */

exports.nodeBuilder = nodeBuilder;
const isFilters = _esQuery.isFilters;
/**
 * @deprecated Import from the "@kbn/es-query" package directly instead.
 * @removeBy 8.1
 */

exports.isFilters = isFilters;
const uniqFilters = _esQuery.uniqFilters;
/**
 * @deprecated Import from the "@kbn/es-query" package directly instead.
 * @removeBy 8.1
 */

exports.uniqFilters = uniqFilters;
const onlyDisabledFiltersChanged = _esQuery.onlyDisabledFiltersChanged;
/**
 * @deprecated Import from the "@kbn/es-query" package directly instead.
 * @removeBy 8.1
 */

exports.onlyDisabledFiltersChanged = onlyDisabledFiltersChanged;
const isExistsFilter = _esQuery.isExistsFilter;
/**
 * @deprecated Import from the "@kbn/es-query" package directly instead.
 * @removeBy 8.1
 */

exports.isExistsFilter = isExistsFilter;
const isMatchAllFilter = _esQuery.isMatchAllFilter;
/**
 * @deprecated Import from the "@kbn/es-query" package directly instead.
 * @removeBy 8.1
 */

exports.isMatchAllFilter = isMatchAllFilter;
const isPhraseFilter = _esQuery.isPhraseFilter;
/**
 * @deprecated Import from the "@kbn/es-query" package directly instead.
 * @removeBy 8.1
 */

exports.isPhraseFilter = isPhraseFilter;
const isPhrasesFilter = _esQuery.isPhrasesFilter;
/**
 * @deprecated Import from the "@kbn/es-query" package directly instead.
 * @removeBy 8.1
 */

exports.isPhrasesFilter = isPhrasesFilter;
const isRangeFilter = _esQuery.isRangeFilter;
/**
 * @deprecated Import from the "@kbn/es-query" package directly instead.
 * @removeBy 8.1
 */

exports.isRangeFilter = isRangeFilter;
const isQueryStringFilter = _esQuery.isQueryStringFilter;
/**
 * @deprecated Import from the "@kbn/es-query" package directly instead.
 * @removeBy 8.1
 */

exports.isQueryStringFilter = isQueryStringFilter;
const buildQueryFilter = _esQuery.buildQueryFilter;
/**
 * @deprecated Import from the "@kbn/es-query" package directly instead.
 * @removeBy 8.1
 */

exports.buildQueryFilter = buildQueryFilter;
const buildPhrasesFilter = _esQuery.buildPhrasesFilter;
/**
 * @deprecated Import from the "@kbn/es-query" package directly instead.
 * @removeBy 8.1
 */

exports.buildPhrasesFilter = buildPhrasesFilter;
const buildPhraseFilter = _esQuery.buildPhraseFilter;
/**
 * @deprecated Import from the "@kbn/es-query" package directly instead.
 * @removeBy 8.1
 */

exports.buildPhraseFilter = buildPhraseFilter;
const buildRangeFilter = _esQuery.buildRangeFilter;
/**
 * @deprecated Import from the "@kbn/es-query" package directly instead.
 * @removeBy 8.1
 */

exports.buildRangeFilter = buildRangeFilter;
const buildCustomFilter = _esQuery.buildCustomFilter;
/**
 * @deprecated Import from the "@kbn/es-query" package directly instead.
 * @removeBy 8.1
 */

exports.buildCustomFilter = buildCustomFilter;
const buildFilter = _esQuery.buildFilter;
/**
 * @deprecated Import from the "@kbn/es-query" package directly instead.
 * @removeBy 8.1
 */

exports.buildFilter = buildFilter;
const buildEmptyFilter = _esQuery.buildEmptyFilter;
/**
 * @deprecated Import from the "@kbn/es-query" package directly instead.
 * @removeBy 8.1
 */

exports.buildEmptyFilter = buildEmptyFilter;
const buildExistsFilter = _esQuery.buildExistsFilter;
/**
 * @deprecated Import from the "@kbn/es-query" package directly instead.
 * @removeBy 8.1
 */

exports.buildExistsFilter = buildExistsFilter;
const toggleFilterNegated = _esQuery.toggleFilterNegated;
/**
 * @deprecated Import from the "@kbn/es-query" package directly instead.
 * @removeBy 8.1
 */

exports.toggleFilterNegated = toggleFilterNegated;
const enableFilter = _esQuery.enableFilter;
/**
 * @deprecated Import from the "@kbn/es-query" package directly instead.
 * @removeBy 8.1
 */

exports.enableFilter = enableFilter;
const pinFilter = _esQuery.pinFilter;
/**
 * @deprecated Import from the "@kbn/es-query" package directly instead.
 * @removeBy 8.1
 */

exports.pinFilter = pinFilter;
const toggleFilterDisabled = _esQuery.toggleFilterDisabled;
/**
 * @deprecated Import from the "@kbn/es-query" package directly instead.
 * @removeBy 8.1
 */

exports.toggleFilterDisabled = toggleFilterDisabled;
const compareFilters = _esQuery.compareFilters;
/**
 * @deprecated Import from the "@kbn/es-query" package directly instead.
 * @removeBy 8.1
 */

exports.compareFilters = compareFilters;
const dedupFilters = _esQuery.dedupFilters;
/**
 * @deprecated Import from the "@kbn/es-query" package directly instead.
 * @removeBy 8.1
 */

exports.dedupFilters = dedupFilters;
const COMPARE_ALL_OPTIONS = _esQuery.COMPARE_ALL_OPTIONS;
/**
 * @deprecated Import from the "@kbn/es-query" package directly instead.
 * @removeBy 8.1
 */

exports.COMPARE_ALL_OPTIONS = COMPARE_ALL_OPTIONS;
const FILTERS = _esQuery.FILTERS;
/**
 * @deprecated Import from the "@kbn/es-query" package directly instead.
 * @removeBy 8.1
 */

exports.FILTERS = FILTERS;