"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateAndPickupMappings = void 0;

var Either = _interopRequireWildcard(require("fp-ts/lib/Either"));

var TaskEither = _interopRequireWildcard(require("fp-ts/lib/TaskEither"));

var _pipeable = require("fp-ts/lib/pipeable");

var _catch_retryable_es_client_errors = require("./catch_retryable_es_client_errors");

var _pickup_updated_mappings = require("./pickup_updated_mappings");

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
 * Updates an index's mappings and runs an pickupUpdatedMappings task so that the mapping
 * changes are "picked up". Returns a taskId to track progress.
 */
const updateAndPickupMappings = ({
  client,
  index,
  mappings
}) => {
  const putMappingTask = () => {
    return client.indices.putMapping({
      index,
      timeout: _constants.DEFAULT_TIMEOUT,
      body: mappings
    }).then(res => {
      // Ignore `acknowledged: false`. When the coordinating node accepts
      // the new cluster state update but not all nodes have applied the
      // update within the timeout `acknowledged` will be false. However,
      // retrying this update will always immediately result in `acknowledged:
      // true` even if there are still nodes which are falling behind with
      // cluster state updates.
      // For updateAndPickupMappings this means that there is the potential
      // that some existing document's fields won't be picked up if the node
      // on which the Kibana shard is running has fallen behind with cluster
      // state updates and the mapping update wasn't applied before we run
      // `pickupUpdatedMappings`. ES tries to limit this risk by blocking
      // index operations (including update_by_query used by
      // updateAndPickupMappings) if there are pending mappings changes. But
      // not all mapping changes will prevent this.
      return Either.right('update_mappings_succeeded');
    }).catch(_catch_retryable_es_client_errors.catchRetryableEsClientErrors);
  };

  return (0, _pipeable.pipe)(putMappingTask, TaskEither.chain(res => {
    return (0, _pickup_updated_mappings.pickupUpdatedMappings)(client, index);
  }));
};

exports.updateAndPickupMappings = updateAndPickupMappings;