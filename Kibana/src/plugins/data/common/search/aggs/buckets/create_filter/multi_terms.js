"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFilterMultiTerms = void 0;

var _i18n = require("@kbn/i18n");

var _esQuery = require("@kbn/es-query");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const createFilterMultiTerms = (aggConfig, key, params) => {
  const fields = aggConfig.params.fields;
  const indexPattern = aggConfig.aggConfigs.indexPattern;

  if (String(key) === '__other__') {
    const multiTerms = params.terms;
    const perMultiTermQuery = multiTerms.map(multiTerm => multiTerm.keys.map((partialKey, i) => (0, _esQuery.buildPhraseFilter)(indexPattern.getFieldByName(fields[i]), partialKey, indexPattern).query));
    return {
      meta: {
        negate: true,
        alias: multiTerms.map(multiTerm => multiTerm.keys.join(', ')).join(` ${_i18n.i18n.translate('data.search.aggs.buckets.multiTerms.otherFilterJoinName', {
          defaultMessage: 'or'
        })} `),
        index: indexPattern.id
      },
      query: {
        bool: {
          should: perMultiTermQuery.map(multiTermQuery => ({
            bool: {
              must: multiTermQuery
            }
          })),
          minimum_should_match: 1
        }
      }
    };
  }

  const partials = key.keys.map((partialKey, i) => (0, _esQuery.buildPhraseFilter)(indexPattern.getFieldByName(fields[i]), partialKey, indexPattern));
  return {
    meta: {
      alias: key.keys.join(', '),
      index: indexPattern.id
    },
    query: {
      bool: {
        must: partials.map(partialFilter => partialFilter.query)
      }
    }
  };
};

exports.createFilterMultiTerms = createFilterMultiTerms;