"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isSavedObjectOlderThan = isSavedObjectOlderThan;
exports.rollUiCounterIndices = rollUiCounterIndices;

var _moment = _interopRequireDefault(require("moment"));

var _constants = require("./constants");

var _ui_counter_saved_object_type = require("../ui_counter_saved_object_type");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function isSavedObjectOlderThan({
  numberOfDays,
  startDate,
  doc
}) {
  const {
    updated_at: updatedAt
  } = doc;
  const today = (0, _moment.default)(startDate).startOf('day');
  const updateDay = (0, _moment.default)(updatedAt).startOf('day');
  const diffInDays = today.diff(updateDay, 'days');

  if (diffInDays > numberOfDays) {
    return true;
  }

  return false;
}

async function rollUiCounterIndices(logger, stopUsingUiCounterIndicies$, savedObjectsClient) {
  if (!savedObjectsClient) {
    return;
  }

  const now = (0, _moment.default)();

  try {
    const {
      saved_objects: rawUiCounterDocs
    } = await savedObjectsClient.find({
      type: _ui_counter_saved_object_type.UI_COUNTER_SAVED_OBJECT_TYPE,
      perPage: 1000 // Process 1000 at a time as a compromise of speed and overload

    });

    if (rawUiCounterDocs.length === 0) {
      /**
       * @deprecated 7.13 to be removed in 8.0.0
       * Stop triggering rollups when we've rolled up all documents.
       *
       * This Saved Object registry is no longer used.
       * Migration from one SO registry to another is not yet supported.
       * In a future release we can remove this piece of code and
       * migrate any docs to the Usage Counters Saved object.
       */
      stopUsingUiCounterIndicies$.complete();
    }

    const docsToDelete = rawUiCounterDocs.filter(doc => isSavedObjectOlderThan({
      numberOfDays: _constants.UI_COUNTERS_KEEP_DOCS_FOR_DAYS,
      startDate: now,
      doc
    }));
    return await Promise.all(docsToDelete.map(({
      id
    }) => savedObjectsClient.delete(_ui_counter_saved_object_type.UI_COUNTER_SAVED_OBJECT_TYPE, id)));
  } catch (err) {
    logger.warn(`Failed to rollup UI Counters saved objects.`);
    logger.warn(err);
  }
}