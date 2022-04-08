"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createBulkOperationBody = exports.bulkOverwriteTransformedDocuments = void 0;

var Either = _interopRequireWildcard(require("fp-ts/lib/Either"));

var _elasticsearch = require("@elastic/elasticsearch");

var _catch_retryable_es_client_errors = require("./catch_retryable_es_client_errors");

var _es_errors = require("./es_errors");

var _constants = require("./constants");

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
 * Given a document and index, creates a valid body for the Bulk API.
 */
const createBulkOperationBody = (doc, index) => {
  return [{
    index: {
      _index: index,
      _id: doc._id,
      // overwrite existing documents
      op_type: 'index',
      // use optimistic concurrency control to ensure that outdated
      // documents are only overwritten once with the latest version
      if_seq_no: doc._seq_no,
      if_primary_term: doc._primary_term
    }
  }, doc._source];
};
/** @internal */


exports.createBulkOperationBody = createBulkOperationBody;

/**
 * Write the up-to-date transformed documents to the index, overwriting any
 * documents that are still on their outdated version.
 */
const bulkOverwriteTransformedDocuments = ({
  client,
  index,
  transformedDocs,
  refresh = false
}) => () => {
  const body = transformedDocs.flatMap(doc => {
    return createBulkOperationBody(doc, index);
  });
  return client.bulk({
    // Because we only add aliases in the MARK_VERSION_INDEX_READY step we
    // can't bulkIndex to an alias with require_alias=true. This means if
    // users tamper during this operation (delete indices or restore a
    // snapshot), we could end up auto-creating an index without the correct
    // mappings. Such tampering could lead to many other problems and is
    // probably unlikely so for now we'll accept this risk and wait till
    // system indices puts in place a hard control.
    require_alias: false,
    wait_for_active_shards: _constants.WAIT_FOR_ALL_SHARDS_TO_BE_ACTIVE,
    refresh,
    filter_path: ['items.*.error'],
    body
  }).then(res => {
    var _res$body$items;

    // Filter out version_conflict_engine_exception since these just mean
    // that another instance already updated these documents
    const errors = ((_res$body$items = res.body.items) !== null && _res$body$items !== void 0 ? _res$body$items : []).filter(item => {
      var _item$index;

      return (_item$index = item.index) === null || _item$index === void 0 ? void 0 : _item$index.error;
    }).map(item => item.index.error).filter(({
      type
    }) => type !== 'version_conflict_engine_exception');

    if (errors.length === 0) {
      return Either.right('bulk_index_succeeded');
    } else {
      if (errors.every(_es_errors.isWriteBlockException)) {
        return Either.left({
          type: 'target_index_had_write_block'
        });
      }

      if (errors.every(_es_errors.isIndexNotFoundException)) {
        return Either.left({
          type: 'index_not_found_exception',
          index
        });
      }

      throw new Error(JSON.stringify(errors));
    }
  }).catch(error => {
    if (error instanceof _elasticsearch.errors.ResponseError && error.statusCode === 413) {
      return Either.left({
        type: 'request_entity_too_large_exception'
      });
    } else {
      throw error;
    }
  }).catch(_catch_retryable_es_client_errors.catchRetryableEsClientErrors);
};

exports.bulkOverwriteTransformedDocuments = bulkOverwriteTransformedDocuments;