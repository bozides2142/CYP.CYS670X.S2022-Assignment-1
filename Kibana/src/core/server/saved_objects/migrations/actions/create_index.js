"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createIndex = void 0;

var Either = _interopRequireWildcard(require("fp-ts/lib/Either"));

var TaskEither = _interopRequireWildcard(require("fp-ts/lib/TaskEither"));

var _pipeable = require("fp-ts/lib/pipeable");

var _catch_retryable_es_client_errors = require("./catch_retryable_es_client_errors");

var _constants = require("./constants");

var _wait_for_index_status_yellow = require("./wait_for_index_status_yellow");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function aliasArrayToRecord(aliases) {
  const result = {};

  for (const alias of aliases) {
    result[alias] = {};
  }

  return result;
}
/** @internal */


/**
 * Creates an index with the given mappings
 *
 * @remarks
 * This method adds some additional logic to the ES create index API:
 *  - it is idempotent, if it gets called multiple times subsequent calls will
 *    wait for the first create operation to complete (up to 60s)
 *  - the first call will wait up to 120s for the cluster state and all shards
 *    to be updated.
 */
const createIndex = ({
  client,
  indexName,
  mappings,
  aliases = []
}) => {
  const createIndexTask = () => {
    const aliasesObject = aliasArrayToRecord(aliases);
    return client.indices.create({
      index: indexName,
      // wait until all shards are available before creating the index
      // (since number_of_shards=1 this does not have any effect atm)
      wait_for_active_shards: _constants.WAIT_FOR_ALL_SHARDS_TO_BE_ACTIVE,
      // Wait up to 60s for the cluster state to update and all shards to be
      // started
      timeout: _constants.DEFAULT_TIMEOUT,
      body: {
        mappings,
        aliases: aliasesObject,
        settings: {
          index: {
            // ES rule of thumb: shards should be several GB to 10's of GB, so
            // Kibana is unlikely to cross that limit.
            number_of_shards: 1,
            auto_expand_replicas: _constants.INDEX_AUTO_EXPAND_REPLICAS,
            // Set an explicit refresh interval so that we don't inherit the
            // value from incorrectly configured index templates (not required
            // after we adopt system indices)
            refresh_interval: '1s',
            // Bump priority so that recovery happens before newer indices
            priority: 10
          }
        }
      }
    }, {
      maxRetries: 0
      /** handle retry ourselves for now */

    }).then(res => {
      /**
       * - acknowledged=false, we timed out before the cluster state was
       *   updated on all nodes with the newly created index, but it
       *   probably will be created sometime soon.
       * - shards_acknowledged=false, we timed out before all shards were
       *   started
       * - acknowledged=true, shards_acknowledged=true, index creation complete
       */
      return Either.right({
        acknowledged: Boolean(res.body.acknowledged),
        shardsAcknowledged: res.body.shards_acknowledged
      });
    }).catch(error => {
      var _error$body, _error$body$error;

      if ((error === null || error === void 0 ? void 0 : (_error$body = error.body) === null || _error$body === void 0 ? void 0 : (_error$body$error = _error$body.error) === null || _error$body$error === void 0 ? void 0 : _error$body$error.type) === 'resource_already_exists_exception') {
        /**
         * If the target index already exists it means a previous create
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

  return (0, _pipeable.pipe)(createIndexTask, TaskEither.chain(res => {
    if (res.acknowledged && res.shardsAcknowledged) {
      // If the cluster state was updated and all shards ackd we're done
      return TaskEither.right('create_index_succeeded');
    } else {
      // Otherwise, wait until the target index has a 'yellow' status.
      return (0, _pipeable.pipe)((0, _wait_for_index_status_yellow.waitForIndexStatusYellow)({
        client,
        index: indexName,
        timeout: _constants.DEFAULT_TIMEOUT
      }), TaskEither.map(() => {
        /** When the index status is 'yellow' we know that all shards were started */
        return 'create_index_succeeded';
      }));
    }
  }));
};

exports.createIndex = createIndex;