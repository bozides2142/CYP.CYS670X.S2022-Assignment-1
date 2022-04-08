"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readWithPit = void 0;

var Either = _interopRequireWildcard(require("fp-ts/lib/Either"));

var _catch_retryable_es_client_errors = require("./catch_retryable_es_client_errors");

var _open_pit = require("./open_pit");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/*
 * Requests documents from the index using PIT mechanism.
 * */
const readWithPit = ({
  client,
  pitId,
  query,
  batchSize,
  searchAfter,
  seqNoPrimaryTerm
}) => () => {
  return client.search({
    seq_no_primary_term: seqNoPrimaryTerm,
    body: {
      // Sort fields are required to use searchAfter
      sort: {
        // the most efficient option as order is not important for the migration
        _shard_doc: {
          order: 'asc'
        }
      },
      pit: {
        id: pitId,
        keep_alive: _open_pit.pitKeepAlive
      },
      size: batchSize,
      search_after: searchAfter,

      /**
       * We want to know how many documents we need to process so we can log the progress.
       * But we also want to increase the performance of these requests,
       * so we ask ES to report the total count only on the first request (when searchAfter does not exist)
       */
      track_total_hits: typeof searchAfter === 'undefined',
      query
    }
  }).then(response => {
    var _response$body$hits$t;

    const totalHits = typeof response.body.hits.total === 'number' ? response.body.hits.total // This format is to be removed in 8.0
    : (_response$body$hits$t = response.body.hits.total) === null || _response$body$hits$t === void 0 ? void 0 : _response$body$hits$t.value;
    const hits = response.body.hits.hits;

    if (hits.length > 0) {
      return Either.right({
        // @ts-expect-error @elastic/elasticsearch _source is optional
        outdatedDocuments: hits,
        lastHitSortValue: hits[hits.length - 1].sort,
        totalHits
      });
    }

    return Either.right({
      outdatedDocuments: [],
      lastHitSortValue: undefined,
      totalHits
    });
  }).catch(_catch_retryable_es_client_errors.catchRetryableEsClientErrors);
};

exports.readWithPit = readWithPit;