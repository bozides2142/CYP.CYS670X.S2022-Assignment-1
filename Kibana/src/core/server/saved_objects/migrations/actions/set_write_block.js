"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setWriteBlock = void 0;

var Either = _interopRequireWildcard(require("fp-ts/lib/Either"));

var _elasticsearch = require("@elastic/elasticsearch");

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
 * Sets a write block in place for the given index. If the response includes
 * `acknowledged: true` all in-progress writes have drained and no further
 * writes to this index will be possible.
 *
 * The first time the write block is added to an index the response will
 * include `shards_acknowledged: true` but once the block is in place,
 * subsequent calls return `shards_acknowledged: false`
 */
const setWriteBlock = ({
  client,
  index
}) => () => {
  return client.indices.addBlock({
    index,
    block: 'write'
  }, {
    maxRetries: 0
    /** handle retry ourselves for now */

  }) // not typed yet
  .then(res => {
    return res.body.acknowledged === true ? Either.right('set_write_block_succeeded') : Either.left({
      type: 'retryable_es_client_error',
      message: 'set_write_block_failed'
    });
  }).catch(e => {
    if (e instanceof _elasticsearch.errors.ResponseError) {
      var _e$body, _e$body$error;

      if (((_e$body = e.body) === null || _e$body === void 0 ? void 0 : (_e$body$error = _e$body.error) === null || _e$body$error === void 0 ? void 0 : _e$body$error.type) === 'index_not_found_exception') {
        return Either.left({
          type: 'index_not_found_exception',
          index
        });
      }
    }

    throw e;
  }).catch(_catch_retryable_es_client_errors.catchRetryableEsClientErrors);
}; //


exports.setWriteBlock = setWriteBlock;