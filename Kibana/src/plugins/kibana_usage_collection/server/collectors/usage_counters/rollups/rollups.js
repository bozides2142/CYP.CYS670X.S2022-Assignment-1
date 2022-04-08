"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isSavedObjectOlderThan = isSavedObjectOlderThan;
exports.rollUsageCountersIndices = rollUsageCountersIndices;

var _moment = _interopRequireDefault(require("moment"));

var _constants = require("./constants");

var _server = require("../../../../../usage_collection/server");

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

async function rollUsageCountersIndices(logger, savedObjectsClient) {
  if (!savedObjectsClient) {
    return;
  }

  const now = (0, _moment.default)();

  try {
    const {
      saved_objects: rawUiCounterDocs
    } = await savedObjectsClient.find({
      type: _server.USAGE_COUNTERS_SAVED_OBJECT_TYPE,
      perPage: 1000 // Process 1000 at a time as a compromise of speed and overload

    });
    const docsToDelete = rawUiCounterDocs.filter(doc => isSavedObjectOlderThan({
      numberOfDays: _constants.USAGE_COUNTERS_KEEP_DOCS_FOR_DAYS,
      startDate: now,
      doc
    }));
    return await Promise.all(docsToDelete.map(({
      id
    }) => savedObjectsClient.delete(_server.USAGE_COUNTERS_SAVED_OBJECT_TYPE, id)));
  } catch (err) {
    logger.warn(`Failed to rollup Usage Counters saved objects.`);
    logger.warn(err);
  }
}