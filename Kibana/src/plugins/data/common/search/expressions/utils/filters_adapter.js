"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.adaptToExpressionValueFilter = adaptToExpressionValueFilter;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function getGroupFromFilter(filter) {
  const {
    meta
  } = filter;
  const {
    group
  } = meta !== null && meta !== void 0 ? meta : {};
  return group;
}

function range(filter) {
  var _rangeQuery$column;

  const {
    query
  } = filter;
  const {
    range: rangeQuery
  } = query !== null && query !== void 0 ? query : {};
  const column = Object.keys(rangeQuery)[0];
  const {
    gte: from,
    lte: to
  } = (_rangeQuery$column = rangeQuery[column]) !== null && _rangeQuery$column !== void 0 ? _rangeQuery$column : {};
  return {
    filterGroup: getGroupFromFilter(filter),
    from,
    to,
    column,
    type: 'filter',
    filterType: 'time',
    and: []
  };
}

function luceneQueryString(filter) {
  const {
    query
  } = filter;
  const {
    query_string: queryString
  } = query !== null && query !== void 0 ? query : {};
  const {
    query: queryValue
  } = queryString;
  return {
    filterGroup: getGroupFromFilter(filter),
    query: queryValue,
    type: 'filter',
    filterType: 'luceneQueryString',
    and: []
  };
}

function term(filter) {
  var _termQuery$column;

  const {
    query
  } = filter;
  const {
    term: termQuery
  } = query !== null && query !== void 0 ? query : {};
  const column = Object.keys(termQuery)[0];
  const {
    value
  } = (_termQuery$column = termQuery[column]) !== null && _termQuery$column !== void 0 ? _termQuery$column : {};
  return {
    filterGroup: getGroupFromFilter(filter),
    column,
    value,
    type: 'filter',
    filterType: 'exactly',
    and: []
  };
}

const adapters = {
  range,
  term,
  luceneQueryString
};

function adaptToExpressionValueFilter(filter) {
  const {
    query = {}
  } = filter;
  const filterType = Object.keys(query)[0];
  const adapt = adapters[filterType];

  if (!adapt || typeof adapt !== 'function') {
    throw new Error(`Unknown filter type: ${filterType}`);
  }

  return adapt(filter);
}