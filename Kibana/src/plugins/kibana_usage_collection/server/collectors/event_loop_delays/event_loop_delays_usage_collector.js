"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerEventLoopDelaysCollector = registerEventLoopDelaysCollector;

var _rxjs = require("rxjs");

var _rollups = require("./rollups");

var _saved_objects = require("./saved_objects");

var _schema = require("./schema");

var _constants = require("./constants");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function registerEventLoopDelaysCollector(logger, usageCollection, registerType, getSavedObjectsClient) {
  (0, _saved_objects.registerSavedObjectTypes)(registerType);
  (0, _rxjs.timer)(_constants.ROLL_INDICES_START, _constants.ROLL_DAILY_INDICES_INTERVAL).subscribe(() => (0, _rollups.rollDailyData)(logger, getSavedObjectsClient()));
  const collector = usageCollection.makeUsageCollector({
    type: 'event_loop_delays',
    isReady: () => typeof getSavedObjectsClient() !== 'undefined',
    schema: _schema.eventLoopDelaysUsageSchema,
    fetch: async () => {
      const internalRepository = getSavedObjectsClient();

      if (!internalRepository) {
        return {
          daily: []
        };
      }

      const {
        saved_objects: savedObjects
      } = await internalRepository.find({
        type: _saved_objects.SAVED_OBJECTS_DAILY_TYPE,
        sortField: 'updated_at',
        sortOrder: 'desc'
      });
      return {
        daily: savedObjects.map(savedObject => savedObject.attributes)
      };
    }
  });
  usageCollection.registerCollector(collector);
}