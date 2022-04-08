"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.searchForOutdatedDocuments = void 0;

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

/**
 * Search for outdated saved object documents with the provided query. Will
 * return one batch of documents. Searching should be repeated until no more
 * outdated documents can be found.
 *
 * Used for testing only
 */
const searchForOutdatedDocuments = (client, options) => () => {
  return client.search({
    index: options.targetIndex,
    // Return the _seq_no and _primary_term so we can use optimistic
    // concurrency control for updates
    seq_no_primary_term: true,
    size: options.batchSize,
    body: {
      query: options.outdatedDocumentsQuery,
      // Optimize search performance by sorting by the "natural" index order
      sort: ['_doc']
    },
    // Return an error when targeting missing or closed indices
    allow_no_indices: false,
    // Don't return partial results if timeouts or shard failures are
    // encountered. This is important because 0 search hits is interpreted as
    // there being no more outdated documents left that require
    // transformation. Although the default is `false`, we set this
    // explicitly to avoid users overriding the
    // search.default_allow_partial_results cluster setting to true.
    allow_partial_search_results: false,
    // Improve performance by not calculating the total number of hits
    // matching the query.
    track_total_hits: false,
    // Reduce the response payload size by only returning the data we care about
    filter_path: ['hits.hits._id', 'hits.hits._source', 'hits.hits._seq_no', 'hits.hits._primary_term']
  }).then(res => {
    var _ref, _res$body$hits;

    return Either.right({
      outdatedDocuments: (_ref = (_res$body$hits = res.body.hits) === null || _res$body$hits === void 0 ? void 0 : _res$body$hits.hits) !== null && _ref !== void 0 ? _ref : []
    });
  }).catch(_catch_retryable_es_client_errors.catchRetryableEsClientErrors);
};

exports.searchForOutdatedDocuments = searchForOutdatedDocuments;