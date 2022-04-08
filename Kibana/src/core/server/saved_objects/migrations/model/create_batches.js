"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createBatches = createBatches;

var Either = _interopRequireWildcard(require("fp-ts/lib/Either"));

var _bulk_overwrite_transformed_documents = require("../actions/bulk_overwrite_transformed_documents");

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
 * Creates batches of documents to be used by the bulk API. Each batch will
 * have a request body content length that's <= maxBatchSizeBytes
 */
function createBatches(docs, index, maxBatchSizeBytes) {
  /* To build up the NDJSON request body we construct an array of objects like:
   * [
   *   {"index": ...}
   *   {"title": "my saved object"}
   *   ...
   * ]
   * However, when we call JSON.stringify on this array the resulting string
   * will be surrounded by `[]` which won't be present in the NDJSON so these
   * two characters need to be removed from the size calculation.
   */
  const BRACKETS_BYTES = 2;
  /* Each document in the NDJSON (including the last one) needs to be
   * terminated by a newline, so we need to account for an extra newline
   * character
   */

  const NDJSON_NEW_LINE_BYTES = 1;
  const batches = [[]];
  let currBatch = 0;
  let currBatchSizeBytes = 0;

  for (const doc of docs) {
    const bulkOperationBody = (0, _bulk_overwrite_transformed_documents.createBulkOperationBody)(doc, index);
    const docSizeBytes = Buffer.byteLength(JSON.stringify(bulkOperationBody), 'utf8') - BRACKETS_BYTES + NDJSON_NEW_LINE_BYTES;

    if (docSizeBytes > maxBatchSizeBytes) {
      return Either.left({
        type: 'document_exceeds_batch_size_bytes',
        docSizeBytes,
        maxBatchSizeBytes,
        document: doc
      });
    } else if (currBatchSizeBytes + docSizeBytes <= maxBatchSizeBytes) {
      batches[currBatch].push(doc);
      currBatchSizeBytes = currBatchSizeBytes + docSizeBytes;
    } else {
      currBatch++;
      batches[currBatch] = [doc];
      currBatchSizeBytes = docSizeBytes;
    }
  }

  return Either.right(batches);
}