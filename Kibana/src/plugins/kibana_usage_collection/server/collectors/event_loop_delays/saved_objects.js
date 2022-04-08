"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SAVED_OBJECTS_DAILY_TYPE = void 0;
exports.deleteHistogramSavedObjects = deleteHistogramSavedObjects;
exports.registerSavedObjectTypes = registerSavedObjectTypes;
exports.serializeSavedObjectId = serializeSavedObjectId;
exports.storeHistogram = storeHistogram;

var _moment = _interopRequireDefault(require("moment"));

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const SAVED_OBJECTS_DAILY_TYPE = 'event_loop_delays_daily';
exports.SAVED_OBJECTS_DAILY_TYPE = SAVED_OBJECTS_DAILY_TYPE;

function registerSavedObjectTypes(registerType) {
  registerType({
    name: SAVED_OBJECTS_DAILY_TYPE,
    hidden: true,
    namespaceType: 'agnostic',
    mappings: {
      dynamic: false,
      properties: {
        // This type requires `lastUpdatedAt` to be indexed so we can use it when rolling up totals (lastUpdatedAt < now-90d)
        lastUpdatedAt: {
          type: 'date'
        }
      }
    }
  });
}

function serializeSavedObjectId({
  date,
  pid,
  instanceUuid
}) {
  const formattedDate = (0, _moment.default)(date).format('DDMMYYYY');
  return `${instanceUuid}::${pid}::${formattedDate}`;
}

async function deleteHistogramSavedObjects(internalRepository, daysTimeRange = 3) {
  const {
    saved_objects: savedObjects
  } = await internalRepository.find({
    type: SAVED_OBJECTS_DAILY_TYPE,
    filter: `${SAVED_OBJECTS_DAILY_TYPE}.attributes.lastUpdatedAt < "now-${daysTimeRange}d/d"`
  });
  return await Promise.allSettled(savedObjects.map(async savedObject => {
    return await internalRepository.delete(SAVED_OBJECTS_DAILY_TYPE, savedObject.id);
  }));
}

async function storeHistogram(histogram, internalRepository, instanceUuid) {
  const pid = process.pid;
  const id = serializeSavedObjectId({
    date: histogram.lastUpdatedAt,
    pid,
    instanceUuid
  });
  return await internalRepository.create(SAVED_OBJECTS_DAILY_TYPE, { ...histogram,
    processId: pid,
    instanceUuid
  }, {
    id,
    overwrite: true
  });
}