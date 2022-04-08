"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.waitForReindexTask = void 0;

var TaskEither = _interopRequireWildcard(require("fp-ts/lib/TaskEither"));

var Option = _interopRequireWildcard(require("fp-ts/lib/Option"));

var _function = require("fp-ts/lib/function");

var _wait_for_task = require("./wait_for_task");

var _es_errors = require("./es_errors");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const waitForReindexTask = (0, _function.flow)(_wait_for_task.waitForTask, TaskEither.chain(res => {
  if (Option.isSome(res.error)) {
    if (res.error.value.type === 'index_not_found_exception') {
      return TaskEither.left({
        type: 'index_not_found_exception',
        index: res.error.value.index
      });
    } else {
      throw new Error('Reindex failed with the following error:\n' + JSON.stringify(res.error));
    }
  } else if (Option.isSome(res.failures)) {
    const failureCauses = res.failures.value.map(failure => failure.cause);

    if (failureCauses.every(_es_errors.isWriteBlockException)) {
      return TaskEither.left({
        type: 'target_index_had_write_block'
      });
    } else if (failureCauses.every(_es_errors.isIncompatibleMappingException)) {
      return TaskEither.left({
        type: 'incompatible_mapping_exception'
      });
    } else {
      throw new Error('Reindex failed with the following failures:\n' + JSON.stringify(res.failures.value));
    }
  } else {
    return TaskEither.right('reindex_succeeded');
  }
}));
exports.waitForReindexTask = waitForReindexTask;