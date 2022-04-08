"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.kqlQuery = kqlQuery;
exports.rangeQuery = rangeQuery;
exports.termQuery = termQuery;
exports.termsQuery = termsQuery;

var _lodash = require("lodash");

var _esQuery = require("@kbn/es-query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function isUndefinedOrNull(value) {
  return value === undefined || value === null;
}

function termQuery(field, value) {
  if (isUndefinedOrNull(value)) {
    return [];
  }

  return [{
    term: {
      [field]: value
    }
  }];
}

function termsQuery(field, ...values) {
  const filtered = (0, _lodash.reject)(values, isUndefinedOrNull);

  if (!filtered.length) {
    return [];
  } // @ts-expect-error undefined and null aren't assignable


  return [{
    terms: {
      [field]: filtered
    }
  }];
}

function rangeQuery(start, end, field = '@timestamp') {
  return [{
    range: {
      [field]: {
        gte: start,
        lte: end,
        format: 'epoch_millis'
      }
    }
  }];
}

function kqlQuery(kql) {
  if (!kql) {
    return [];
  }

  const ast = (0, _esQuery.fromKueryExpression)(kql);
  return [(0, _esQuery.toElasticsearchQuery)(ast)];
}