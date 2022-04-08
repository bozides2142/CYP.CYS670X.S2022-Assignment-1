"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.esRawResponse = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const name = 'es_raw_response';

// flattens elasticsearch object into table rows
function flatten(obj, keyPrefix = '') {
  let topLevelKeys = {};
  const nestedRows = [];
  const prefix = keyPrefix ? keyPrefix + '.' : '';
  Object.keys(obj).forEach(key => {
    if (Array.isArray(obj[key])) {
      nestedRows.push(...obj[key].map(nestedRow => flatten(nestedRow, prefix + key)).reduce((acc, object) => [...acc, ...object], []));
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      const subRows = flatten(obj[key], prefix + key);

      if (subRows.length === 1) {
        topLevelKeys = { ...topLevelKeys,
          ...subRows[0]
        };
      } else {
        nestedRows.push(...subRows);
      }
    } else {
      topLevelKeys[prefix + key] = obj[key];
    }
  });

  if (nestedRows.length === 0) {
    return [topLevelKeys];
  } else {
    return nestedRows.map(nestedRow => ({ ...nestedRow,
      ...topLevelKeys
    }));
  }
}

const parseRawDocs = hits => {
  return hits.hits.map(hit => hit.fields || hit._source).filter(hit => hit);
};

const convertResult = body => {
  return !body.aggregations ? parseRawDocs(body.hits) : flatten(body.aggregations);
};

const esRawResponse = {
  name,
  to: {
    datatable: context => {
      const rows = convertResult(context.body);
      const columns = rows.length ? Object.keys(rows[0]).map(key => ({
        id: key,
        name: key,
        meta: {
          type: typeof rows[0][key],
          field: key,
          params: {}
        }
      })) : [];
      return {
        type: 'datatable',
        meta: {
          type: 'esdsl',
          source: '*'
        },
        columns,
        rows
      };
    }
  }
};
exports.esRawResponse = esRawResponse;