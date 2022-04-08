"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkForUnknownDocs = void 0;

var Either = _interopRequireWildcard(require("fp-ts/lib/Either"));

var _catch_retryable_es_client_errors = require("./catch_retryable_es_client_errors");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const checkForUnknownDocs = ({
  client,
  indexName,
  unusedTypesQuery,
  knownTypes
}) => () => {
  const query = createUnknownDocQuery(unusedTypesQuery, knownTypes);
  return client.search({
    index: indexName,
    body: {
      query
    }
  }).then(response => {
    const {
      hits
    } = response.body.hits;

    if (hits.length) {
      return Either.left({
        type: 'unknown_docs_found',
        unknownDocs: hits.map(hit => {
          var _hit$_source$type, _hit$_source;

          return {
            id: hit._id,
            type: (_hit$_source$type = (_hit$_source = hit._source) === null || _hit$_source === void 0 ? void 0 : _hit$_source.type) !== null && _hit$_source$type !== void 0 ? _hit$_source$type : 'unknown'
          };
        })
      });
    } else {
      return Either.right({});
    }
  }).catch(_catch_retryable_es_client_errors.catchRetryableEsClientErrors);
};

exports.checkForUnknownDocs = checkForUnknownDocs;

const createUnknownDocQuery = (unusedTypesQuery, knownTypes) => {
  return {
    bool: {
      must: unusedTypesQuery,
      must_not: knownTypes.map(type => ({
        term: {
          type
        }
      }))
    }
  };
};