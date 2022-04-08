"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.esQuery = exports.esKuery = exports.esFilters = void 0;

var _common = require("../common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/*
 * Filter helper namespace:
 * @deprecated Import helpers from the "@kbn/es-query" package directly instead.
 * @removeBy 8.1
 */
const esFilters = {
  buildQueryFilter: _common.buildQueryFilter,
  buildCustomFilter: _common.buildCustomFilter,
  buildEmptyFilter: _common.buildEmptyFilter,
  buildExistsFilter: _common.buildExistsFilter,
  buildFilter: _common.buildFilter,
  buildPhraseFilter: _common.buildPhraseFilter,
  buildPhrasesFilter: _common.buildPhrasesFilter,
  buildRangeFilter: _common.buildRangeFilter,
  isFilterDisabled: _common.isFilterDisabled
};
/*
 * esQuery and esKuery:
 */

exports.esFilters = esFilters;

/*
 * Filter helper namespace
 * @deprecated Import helpers from the "@kbn/es-query" package directly instead.
 * @removeBy 8.1
 */
const esKuery = {
  nodeTypes: _common.nodeTypes,
  fromKueryExpression: _common.fromKueryExpression,
  toElasticsearchQuery: _common.toElasticsearchQuery
};
/*
 * Filter helper namespace
 * @deprecated Import helpers from the "@kbn/es-query" package directly instead.
 * @removeBy 8.1
 */

exports.esKuery = esKuery;
const esQuery = {
  buildQueryFromFilters: _common.buildQueryFromFilters,
  getEsQueryConfig: _common.getEsQueryConfig,
  buildEsQuery: _common.buildEsQuery
};
exports.esQuery = esQuery;