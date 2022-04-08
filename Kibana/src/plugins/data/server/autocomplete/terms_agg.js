"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.termsAggSuggestions = termsAggSuggestions;

var _lodash = require("lodash");

var _common = require("../../common");

var _data_views = require("../data_views");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
async function termsAggSuggestions(config, savedObjectsClient, esClient, index, fieldName, query, filters, field, abortSignal) {
  var _field, _field2, _field3;

  const autocompleteSearchOptions = {
    timeout: `${config.autocomplete.valueSuggestions.timeout.asMilliseconds()}ms`,
    terminate_after: config.autocomplete.valueSuggestions.terminateAfter.asMilliseconds()
  };

  if (!((_field = field) !== null && _field !== void 0 && _field.name) && !((_field2 = field) !== null && _field2 !== void 0 && _field2.type)) {
    const indexPattern = await (0, _data_views.findIndexPatternById)(savedObjectsClient, index);
    field = indexPattern && (0, _data_views.getFieldByName)(fieldName, indexPattern);
  }

  const body = await getBody(autocompleteSearchOptions, (_field3 = field) !== null && _field3 !== void 0 ? _field3 : fieldName, query, filters);
  const result = await esClient.search({
    index,
    body
  }, {
    signal: abortSignal
  });
  const buckets = (0, _lodash.get)(result.body, 'aggregations.suggestions.buckets') || (0, _lodash.get)(result.body, 'aggregations.nestedSuggestions.suggestions.buckets');
  return (0, _lodash.map)(buckets !== null && buckets !== void 0 ? buckets : [], 'key');
}

async function getBody( // eslint-disable-next-line @typescript-eslint/naming-convention
{
  timeout,
  terminate_after
}, field, query, filters = []) {
  const isFieldObject = f => Boolean(f && f.name); // https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-regexp-query.html#_standard_operators


  const getEscapedQuery = (q = '') => q.replace(/[.?+*|{}[\]()"\\#@&<>~]/g, match => `\\${match}`); // Helps ensure that the regex is not evaluated eagerly against the terms dictionary


  const executionHint = 'map'; // We don't care about the accuracy of the counts, just the content of the terms, so this reduces
  // the amount of information that needs to be transmitted to the coordinating node

  const shardSize = 10;
  const body = {
    size: 0,
    timeout,
    terminate_after,
    query: {
      bool: {
        filter: filters
      }
    },
    aggs: {
      suggestions: {
        terms: {
          field: isFieldObject(field) ? field.name : field,
          include: `${getEscapedQuery(query)}.*`,
          execution_hint: executionHint,
          shard_size: shardSize
        }
      }
    }
  };
  const subTypeNested = isFieldObject(field) && (0, _common.getFieldSubtypeNested)(field);

  if (isFieldObject(field) && subTypeNested) {
    return { ...body,
      aggs: {
        nestedSuggestions: {
          nested: {
            path: subTypeNested.nested.path
          },
          aggs: body.aggs
        }
      }
    };
  }

  return body;
}