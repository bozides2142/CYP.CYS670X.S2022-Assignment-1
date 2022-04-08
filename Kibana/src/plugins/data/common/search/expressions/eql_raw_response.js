"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.eqlRawResponse = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const name = 'eql_raw_response';

const flatten = obj => {
  const _flatten = (o, path = []) => {
    return Object.keys(o).map(k => {
      if (typeof o[k] === 'object' && o[k] !== null && !Array.isArray(o[k])) {
        return _flatten(o[k], [...path, k]);
      } else {
        const key = [...path, k].join('.');
        return {
          [key]: o[k]
        };
      }
    }).flat();
  };

  return Object.assign({}, ..._flatten(obj));
};

const parseEventDocs = (events, joinKeys) => {
  return events.map(hit => hit.fields || hit._source).filter(hit => hit).map(event => flatten(event)).map(event => {
    if (joinKeys) {
      event.joinKeys = joinKeys;
    }

    return event;
  });
};

const parseResponse = hits => {
  if (hits.sequences) {
    return hits.sequences.flatMap(sequence => parseEventDocs(sequence.events, sequence.join_keys));
  }

  return parseEventDocs(hits.events);
};

const eqlRawResponse = {
  name,
  to: {
    datatable: context => {
      // improved handling needs to be added when we know some usecases
      const rows = parseResponse(context.body.hits);
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
          type: 'eql',
          source: '*'
        },
        columns,
        rows
      };
    }
  }
};
exports.eqlRawResponse = eqlRawResponse;