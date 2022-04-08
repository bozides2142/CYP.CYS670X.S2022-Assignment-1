"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nextActionMap = exports.next = void 0;

var Actions = _interopRequireWildcard(require("./actions"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const nextActionMap = (client, transformRawDocs) => {
  return {
    INIT: state => Actions.fetchIndices({
      client,
      indices: [state.currentAlias, state.versionAlias]
    }),
    WAIT_FOR_YELLOW_SOURCE: state => Actions.waitForIndexStatusYellow({
      client,
      index: state.sourceIndex.value
    }),
    CHECK_UNKNOWN_DOCUMENTS: state => Actions.checkForUnknownDocs({
      client,
      indexName: state.sourceIndex.value,
      unusedTypesQuery: state.unusedTypesQuery,
      knownTypes: state.knownTypes
    }),
    SET_SOURCE_WRITE_BLOCK: state => Actions.setWriteBlock({
      client,
      index: state.sourceIndex.value
    }),
    CALCULATE_EXCLUDE_FILTERS: state => Actions.calculateExcludeFilters({
      client,
      excludeFromUpgradeFilterHooks: state.excludeFromUpgradeFilterHooks
    }),
    CREATE_NEW_TARGET: state => Actions.createIndex({
      client,
      indexName: state.targetIndex,
      mappings: state.targetIndexMappings
    }),
    CREATE_REINDEX_TEMP: state => Actions.createIndex({
      client,
      indexName: state.tempIndex,
      mappings: state.tempIndexMappings
    }),
    REINDEX_SOURCE_TO_TEMP_OPEN_PIT: state => Actions.openPit({
      client,
      index: state.sourceIndex.value
    }),
    REINDEX_SOURCE_TO_TEMP_READ: state => Actions.readWithPit({
      client,
      pitId: state.sourceIndexPitId,

      /* When reading we use a source query to exclude saved objects types which
       * are no longer used. These saved objects will still be kept in the outdated
       * index for backup purposes, but won't be available in the upgraded index.
       */
      query: state.unusedTypesQuery,
      batchSize: state.batchSize,
      searchAfter: state.lastHitSortValue
    }),
    REINDEX_SOURCE_TO_TEMP_CLOSE_PIT: state => Actions.closePit({
      client,
      pitId: state.sourceIndexPitId
    }),
    REINDEX_SOURCE_TO_TEMP_TRANSFORM: state => Actions.transformDocs({
      transformRawDocs,
      outdatedDocuments: state.outdatedDocuments
    }),
    REINDEX_SOURCE_TO_TEMP_INDEX_BULK: state => Actions.bulkOverwriteTransformedDocuments({
      client,
      index: state.tempIndex,
      transformedDocs: state.transformedDocBatches[state.currentBatch],

      /**
       * Since we don't run a search against the target index, we disable "refresh" to speed up
       * the migration process.
       * Although any further step must run "refresh" for the target index
       * before we reach out to the OUTDATED_DOCUMENTS_SEARCH_OPEN_PIT step.
       * Right now, it's performed during REFRESH_TARGET step.
       */
      refresh: false
    }),
    SET_TEMP_WRITE_BLOCK: state => Actions.setWriteBlock({
      client,
      index: state.tempIndex
    }),
    CLONE_TEMP_TO_TARGET: state => Actions.cloneIndex({
      client,
      source: state.tempIndex,
      target: state.targetIndex
    }),
    REFRESH_TARGET: state => Actions.refreshIndex({
      client,
      targetIndex: state.targetIndex
    }),
    UPDATE_TARGET_MAPPINGS: state => Actions.updateAndPickupMappings({
      client,
      index: state.targetIndex,
      mappings: state.targetIndexMappings
    }),
    UPDATE_TARGET_MAPPINGS_WAIT_FOR_TASK: state => Actions.waitForPickupUpdatedMappingsTask({
      client,
      taskId: state.updateTargetMappingsTaskId,
      timeout: '60s'
    }),
    OUTDATED_DOCUMENTS_SEARCH_OPEN_PIT: state => Actions.openPit({
      client,
      index: state.targetIndex
    }),
    OUTDATED_DOCUMENTS_SEARCH_READ: state => Actions.readWithPit({
      client,
      pitId: state.pitId,
      // search for outdated documents only
      query: state.outdatedDocumentsQuery,
      batchSize: state.batchSize,
      searchAfter: state.lastHitSortValue
    }),
    OUTDATED_DOCUMENTS_SEARCH_CLOSE_PIT: state => Actions.closePit({
      client,
      pitId: state.pitId
    }),
    OUTDATED_DOCUMENTS_REFRESH: state => Actions.refreshIndex({
      client,
      targetIndex: state.targetIndex
    }),
    OUTDATED_DOCUMENTS_TRANSFORM: state => Actions.transformDocs({
      transformRawDocs,
      outdatedDocuments: state.outdatedDocuments
    }),
    TRANSFORMED_DOCUMENTS_BULK_INDEX: state => Actions.bulkOverwriteTransformedDocuments({
      client,
      index: state.targetIndex,
      transformedDocs: state.transformedDocBatches[state.currentBatch]
      /**
       * Since we don't run a search against the target index, we disable "refresh" to speed up
       * the migration process.
       * Although any further step must run "refresh" for the target index
       * before we reach out to the MARK_VERSION_INDEX_READY step.
       * Right now, it's performed during OUTDATED_DOCUMENTS_REFRESH step.
       */

    }),
    MARK_VERSION_INDEX_READY: state => Actions.updateAliases({
      client,
      aliasActions: state.versionIndexReadyActions.value
    }),
    MARK_VERSION_INDEX_READY_CONFLICT: state => Actions.fetchIndices({
      client,
      indices: [state.currentAlias, state.versionAlias]
    }),
    LEGACY_SET_WRITE_BLOCK: state => Actions.setWriteBlock({
      client,
      index: state.legacyIndex
    }),
    LEGACY_CREATE_REINDEX_TARGET: state => Actions.createIndex({
      client,
      indexName: state.sourceIndex.value,
      mappings: state.legacyReindexTargetMappings
    }),
    LEGACY_REINDEX: state => Actions.reindex({
      client,
      sourceIndex: state.legacyIndex,
      targetIndex: state.sourceIndex.value,
      reindexScript: state.preMigrationScript,
      requireAlias: false,
      unusedTypesQuery: state.unusedTypesQuery
    }),
    LEGACY_REINDEX_WAIT_FOR_TASK: state => Actions.waitForReindexTask({
      client,
      taskId: state.legacyReindexTaskId,
      timeout: '60s'
    }),
    LEGACY_DELETE: state => Actions.updateAliases({
      client,
      aliasActions: state.legacyPreMigrationDoneActions
    })
  };
};

exports.nextActionMap = nextActionMap;

const next = (client, transformRawDocs) => {
  const map = nextActionMap(client, transformRawDocs);
  return state => {
    const delay = fn => {
      return () => {
        return state.retryDelay > 0 ? new Promise(resolve => setTimeout(resolve, state.retryDelay)).then(fn) : fn();
      };
    };

    if (state.controlState === 'DONE' || state.controlState === 'FATAL') {
      // Return null if we're in one of the terminating states
      return null;
    } else {
      // Otherwise return the delayed action
      // We use an explicit cast as otherwise TS infers `(state: never) => ...`
      // here because state is inferred to be the intersection of all states
      // instead of the union.
      const nextAction = map[state.controlState];
      return delay(nextAction(state));
    }
  };
};

exports.next = next;