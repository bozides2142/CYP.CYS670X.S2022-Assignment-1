"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reindex = void 0;

var Either = _interopRequireWildcard(require("fp-ts/lib/Either"));

var Option = _interopRequireWildcard(require("fp-ts/lib/Option"));

var _catch_retryable_es_client_errors = require("./catch_retryable_es_client_errors");

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
 * Reindex documents from the `sourceIndex` into the `targetIndex`. Returns a
 * task ID which can be tracked for progress.
 *
 * @remarks This action is idempotent allowing several Kibana instances to run
 * this in parallel. By using `op_type: 'create', conflicts: 'proceed'` there
 * will be only one write per reindexed document.
 */
const reindex = ({
  client,
  sourceIndex,
  targetIndex,
  reindexScript,
  requireAlias,
  unusedTypesQuery
}) => () => {
  return client.reindex({
    // Require targetIndex to be an alias. Prevents a new index from being
    // created if targetIndex doesn't exist.
    require_alias: requireAlias,
    body: {
      // Ignore version conflicts from existing documents
      conflicts: 'proceed',
      source: {
        index: sourceIndex,
        // Set reindex batch size
        size: _constants.BATCH_SIZE,
        // Exclude saved object types
        query: unusedTypesQuery
      },
      dest: {
        index: targetIndex,
        // Don't override existing documents, only create if missing
        op_type: 'create'
      },
      script: Option.fold(() => undefined, script => ({
        source: script,
        lang: 'painless'
      }))(reindexScript)
    },
    // force a refresh so that we can query the target index
    refresh: true,
    // Create a task and return task id instead of blocking until complete
    wait_for_completion: false
  }).then(({
    body: {
      task: taskId
    }
  }) => {
    return Either.right({
      taskId: String(taskId)
    });
  }).catch(_catch_retryable_es_client_errors.catchRetryableEsClientErrors);
};

exports.reindex = reindex;