"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "BATCH_SIZE", {
  enumerable: true,
  get: function () {
    return _constants.BATCH_SIZE;
  }
});
Object.defineProperty(exports, "DEFAULT_TIMEOUT", {
  enumerable: true,
  get: function () {
    return _constants.DEFAULT_TIMEOUT;
  }
});
Object.defineProperty(exports, "INDEX_AUTO_EXPAND_REPLICAS", {
  enumerable: true,
  get: function () {
    return _constants.INDEX_AUTO_EXPAND_REPLICAS;
  }
});
Object.defineProperty(exports, "INDEX_NUMBER_OF_SHARDS", {
  enumerable: true,
  get: function () {
    return _constants.INDEX_NUMBER_OF_SHARDS;
  }
});
Object.defineProperty(exports, "WAIT_FOR_ALL_SHARDS_TO_BE_ACTIVE", {
  enumerable: true,
  get: function () {
    return _constants.WAIT_FOR_ALL_SHARDS_TO_BE_ACTIVE;
  }
});
Object.defineProperty(exports, "bulkOverwriteTransformedDocuments", {
  enumerable: true,
  get: function () {
    return _bulk_overwrite_transformed_documents.bulkOverwriteTransformedDocuments;
  }
});
Object.defineProperty(exports, "calculateExcludeFilters", {
  enumerable: true,
  get: function () {
    return _calculate_exclude_filters.calculateExcludeFilters;
  }
});
Object.defineProperty(exports, "checkForUnknownDocs", {
  enumerable: true,
  get: function () {
    return _check_for_unknown_docs.checkForUnknownDocs;
  }
});
Object.defineProperty(exports, "cloneIndex", {
  enumerable: true,
  get: function () {
    return _clone_index.cloneIndex;
  }
});
Object.defineProperty(exports, "closePit", {
  enumerable: true,
  get: function () {
    return _close_pit.closePit;
  }
});
Object.defineProperty(exports, "createIndex", {
  enumerable: true,
  get: function () {
    return _create_index.createIndex;
  }
});
Object.defineProperty(exports, "fetchIndices", {
  enumerable: true,
  get: function () {
    return _fetch_indices.fetchIndices;
  }
});
exports.isLeftTypeof = isLeftTypeof;
Object.defineProperty(exports, "openPit", {
  enumerable: true,
  get: function () {
    return _open_pit.openPit;
  }
});
Object.defineProperty(exports, "pickupUpdatedMappings", {
  enumerable: true,
  get: function () {
    return _pickup_updated_mappings.pickupUpdatedMappings;
  }
});
Object.defineProperty(exports, "pitKeepAlive", {
  enumerable: true,
  get: function () {
    return _open_pit.pitKeepAlive;
  }
});
Object.defineProperty(exports, "readWithPit", {
  enumerable: true,
  get: function () {
    return _read_with_pit.readWithPit;
  }
});
Object.defineProperty(exports, "refreshIndex", {
  enumerable: true,
  get: function () {
    return _refresh_index.refreshIndex;
  }
});
Object.defineProperty(exports, "reindex", {
  enumerable: true,
  get: function () {
    return _reindex.reindex;
  }
});
Object.defineProperty(exports, "removeWriteBlock", {
  enumerable: true,
  get: function () {
    return _remove_write_block.removeWriteBlock;
  }
});
Object.defineProperty(exports, "searchForOutdatedDocuments", {
  enumerable: true,
  get: function () {
    return _search_for_outdated_documents.searchForOutdatedDocuments;
  }
});
Object.defineProperty(exports, "setWriteBlock", {
  enumerable: true,
  get: function () {
    return _set_write_block.setWriteBlock;
  }
});
Object.defineProperty(exports, "transformDocs", {
  enumerable: true,
  get: function () {
    return _transform_docs.transformDocs;
  }
});
Object.defineProperty(exports, "updateAliases", {
  enumerable: true,
  get: function () {
    return _update_aliases.updateAliases;
  }
});
Object.defineProperty(exports, "updateAndPickupMappings", {
  enumerable: true,
  get: function () {
    return _update_and_pickup_mappings.updateAndPickupMappings;
  }
});
Object.defineProperty(exports, "verifyReindex", {
  enumerable: true,
  get: function () {
    return _verify_reindex.verifyReindex;
  }
});
Object.defineProperty(exports, "waitForIndexStatusYellow", {
  enumerable: true,
  get: function () {
    return _wait_for_index_status_yellow.waitForIndexStatusYellow;
  }
});
Object.defineProperty(exports, "waitForPickupUpdatedMappingsTask", {
  enumerable: true,
  get: function () {
    return _wait_for_pickup_updated_mappings_task.waitForPickupUpdatedMappingsTask;
  }
});
Object.defineProperty(exports, "waitForReindexTask", {
  enumerable: true,
  get: function () {
    return _wait_for_reindex_task.waitForReindexTask;
  }
});
Object.defineProperty(exports, "waitForTask", {
  enumerable: true,
  get: function () {
    return _wait_for_task.waitForTask;
  }
});

var _constants = require("./constants");

var _fetch_indices = require("./fetch_indices");

var _set_write_block = require("./set_write_block");

var _remove_write_block = require("./remove_write_block");

var _clone_index = require("./clone_index");

var _wait_for_index_status_yellow = require("./wait_for_index_status_yellow");

var _wait_for_task = require("./wait_for_task");

var _pickup_updated_mappings = require("./pickup_updated_mappings");

var _open_pit = require("./open_pit");

var _read_with_pit = require("./read_with_pit");

var _close_pit = require("./close_pit");

var _transform_docs = require("./transform_docs");

var _refresh_index = require("./refresh_index");

var _reindex = require("./reindex");

var _wait_for_reindex_task = require("./wait_for_reindex_task");

var _verify_reindex = require("./verify_reindex");

var _update_aliases = require("./update_aliases");

var _create_index = require("./create_index");

var _update_and_pickup_mappings = require("./update_and_pickup_mappings");

var _check_for_unknown_docs = require("./check_for_unknown_docs");

var _wait_for_pickup_updated_mappings_task = require("./wait_for_pickup_updated_mappings_task");

var _search_for_outdated_documents = require("./search_for_outdated_documents");

var _bulk_overwrite_transformed_documents = require("./bulk_overwrite_transformed_documents");

var _calculate_exclude_filters = require("./calculate_exclude_filters");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Type guard for narrowing the type of a left
 */
function isLeftTypeof(res, typeString) {
  return res.type === typeString;
}