"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNestedTermClauseForReference = void 0;
exports.getReferencesFilter = getReferencesFilter;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function getReferencesFilter({
  references,
  operator = 'OR',
  maxTermsPerClause = 1000
}) {
  if (operator === 'AND') {
    return {
      bool: {
        must: references.map(getNestedTermClauseForReference)
      }
    };
  } else {
    return {
      bool: {
        should: getAggregatedTermsClauses(references, maxTermsPerClause),
        minimum_should_match: 1
      }
    };
  }
}

const getAggregatedTermsClauses = (references, maxTermsPerClause) => {
  const refTypeToIds = references.reduce((map, {
    type,
    id
  }) => {
    var _map$get;

    const ids = (_map$get = map.get(type)) !== null && _map$get !== void 0 ? _map$get : [];
    map.set(type, [...ids, id]);
    return map;
  }, new Map()); // we create chunks per type to avoid generating `terms` clauses with too many terms

  const typeIdChunks = [...refTypeToIds.entries()].flatMap(([type, ids]) => {
    return createChunks(ids, maxTermsPerClause).map(chunkIds => ({
      type,
      ids: chunkIds
    }));
  });
  return typeIdChunks.map(({
    type,
    ids
  }) => getNestedTermsClausesForReferences(type, ids));
};

const createChunks = (array, chunkSize) => {
  const chunks = [];

  for (let i = 0, len = array.length; i < len; i += chunkSize) chunks.push(array.slice(i, i + chunkSize));

  return chunks;
};

const getNestedTermClauseForReference = reference => {
  return {
    nested: {
      path: 'references',
      query: {
        bool: {
          must: [{
            term: {
              'references.id': reference.id
            }
          }, {
            term: {
              'references.type': reference.type
            }
          }]
        }
      }
    }
  };
};

exports.getNestedTermClauseForReference = getNestedTermClauseForReference;

const getNestedTermsClausesForReferences = (type, ids) => {
  return {
    nested: {
      path: 'references',
      query: {
        bool: {
          must: [{
            terms: {
              'references.id': ids
            }
          }, {
            term: {
              'references.type': type
            }
          }]
        }
      }
    }
  };
};