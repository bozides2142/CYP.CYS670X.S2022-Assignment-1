"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cloneIndex = void 0;

var Either = _interopRequireWildcard(require("fp-ts/lib/Either"));

var TaskEither = _interopRequireWildcard(require("fp-ts/lib/TaskEither"));

var _pipeable = require("fp-ts/lib/pipeable");

var _catch_retryable_es_client_errors = require("./catch_retryable_es_client_errors");

var _wait_for_index_status_yellow = require("./wait_for_index_status_yellow");

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
 * Makes a clone of the source index into the target.
 *
 * @remarks
 * This method adds some additional logic to the ES clone index API:
 *  - it is idempotent, if it gets called multiple times subsequent calls will
 *    wait for the first clone operation to complete (up to 60s)
 *  - the first call will wait up to 120s for the cluster state and all shards
 *    to be updated.
 */
const cloneIndex = ({
  client,
  source,
  target,
  timeout = _constants.DEFAULT_TIMEOUT
}) => {
  const cloneTask = () => {
    return client.indices.clone({
      index: source,
      target,
      wait_for_active_shards: _constants.WAIT_FOR_ALL_SHARDS_TO_BE_ACTIVE,
      body: {
        settings: {
          index: {
            // The source we're cloning from will have a write block set, so
            // we need to remove it to allow writes to our newly cloned index
            'blocks.write': false,
            number_of_shards: _constants.INDEX_NUMBER_OF_SHARDS,
            auto_expand_replicas: _constants.INDEX_AUTO_EXPAND_REPLICAS,
            // Set an explicit refresh interval so that we don't inherit the
            // value from incorrectly configured index templates (not required
            // after we adopt system indices)
            refresh_interval: '1s',
            // Bump priority so that recovery happens before newer indices
            priority: 10
          }
        }
      },
      timeout
    }, {
      maxRetries: 0
      /** handle retry ourselves for now */

    }).then(res => {
      /**
       * - acknowledged=false, we timed out before the cluster state was
       *   updated with the newly created index, but it probably will be
       *   created sometime soon.
       * - shards_acknowledged=false, we timed out before all shards were
       *   started
       * - acknowledged=true, shards_acknowledged=true, cloning complete
       */
      return Either.right({
        acknowledged: res.body.acknowledged,
        shardsAcknowledged: res.body.shards_acknowledged
      });
    }).catch(error => {
      var _error$body, _error$body$error, _error$body2, _error$body2$error;

      if ((error === null || error === void 0 ? void 0 : (_error$body = error.body) === null || _error$body === void 0 ? void 0 : (_error$body$error = _error$body.error) === null || _error$body$error === void 0 ? void 0 : _error$body$error.type) === 'index_not_found_exception') {
        return Either.left({
          type: 'index_not_found_exception',
          index: error.body.error.index
        });
      } else if ((error === null || error === void 0 ? void 0 : (_error$body2 = error.body) === null || _error$body2 === void 0 ? void 0 : (_error$body2$error = _error$body2.error) === null || _error$body2$error === void 0 ? void 0 : _error$body2$error.type) === 'resource_already_exists_exception') {
        /**
         * If the target index already exists it means a previous clone
         * operation had already been started. However, we can't be sure
         * that all shards were started so return shardsAcknowledged: false
         */
        return Either.right({
          acknowledged: true,
          shardsAcknowledged: false
        });
      } else {
        throw error;
      }
    }).catch(_catch_retryable_es_client_errors.catchRetryableEsClientErrors);
  };

  return (0, _pipeable.pipe)(cloneTask, TaskEither.chain(res => {
    if (res.acknowledged && res.shardsAcknowledged) {
      // If the cluster state was updated and all shards ackd we're done
      return TaskEither.right(res);
    } else {
      // Otherwise, wait until the target index has a 'yellow' status.
      return (0, _pipeable.pipe)((0, _wait_for_index_status_yellow.waitForIndexStatusYellow)({
        client,
        index: target,
        timeout
      }), TaskEither.map(value => {
        /** When the index status is 'yellow' we know that all shards were started */
        return {
          acknowledged: true,
          shardsAcknowledged: true
        };
      }));
    }
  }));
};

exports.cloneIndex = cloneIndex;