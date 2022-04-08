"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rollDailyData = rollDailyData;

var _moment = _interopRequireDefault(require("moment"));

var _server = require("../../../../../../core/server");

var _application_usage = require("../../../../../usage_collection/common/application_usage");

var _saved_objects_types = require("../saved_objects_types");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Aggregates all the transactional events into daily aggregates
 * @param logger
 * @param savedObjectsClient
 */
async function rollDailyData(logger, savedObjectsClient) {
  if (!savedObjectsClient) {
    return false;
  }

  try {
    let toCreate;

    do {
      toCreate = new Map();
      const {
        saved_objects: rawApplicationUsageTransactional
      } = await savedObjectsClient.find({
        type: _saved_objects_types.SAVED_OBJECTS_TRANSACTIONAL_TYPE,
        perPage: 1000 // Process 1000 at a time as a compromise of speed and overload

      });

      for (const doc of rawApplicationUsageTransactional) {
        const {
          attributes: {
            appId,
            viewId,
            minutesOnScreen,
            numberOfClicks,
            timestamp
          }
        } = doc;
        const dayId = (0, _moment.default)(timestamp).format('YYYY-MM-DD');
        const dailyId = (0, _application_usage.getDailyId)({
          dayId,
          appId,
          viewId
        });
        const existingDoc = toCreate.get(dailyId) || (await getDailyDoc(savedObjectsClient, dailyId, appId, viewId, dayId));
        toCreate.set(dailyId, { ...existingDoc,
          attributes: { ...existingDoc.attributes,
            minutesOnScreen: existingDoc.attributes.minutesOnScreen + minutesOnScreen,
            numberOfClicks: existingDoc.attributes.numberOfClicks + numberOfClicks
          }
        });
      }

      if (toCreate.size > 0) {
        await savedObjectsClient.bulkCreate([...toCreate.entries()].map(([id, {
          attributes,
          version
        }]) => ({
          type: _saved_objects_types.SAVED_OBJECTS_DAILY_TYPE,
          id,
          attributes,
          version // Providing version to ensure via conflict matching that only 1 Kibana instance (or interval) is taking care of the updates

        })), {
          overwrite: true
        });
        const promiseStatuses = await Promise.allSettled(rawApplicationUsageTransactional.map(({
          id
        }) => savedObjectsClient.delete(_saved_objects_types.SAVED_OBJECTS_TRANSACTIONAL_TYPE, id) // There is no bulkDelete :(
        ));
        const rejectedPromises = promiseStatuses.filter(settledResult => settledResult.status === 'rejected');

        if (rejectedPromises.length > 0) {
          throw new Error(`Failed to delete some items in ${_saved_objects_types.SAVED_OBJECTS_TRANSACTIONAL_TYPE}: ${JSON.stringify(rejectedPromises.map(({
            reason
          }) => reason))}`);
        }
      }
    } while (toCreate.size > 0);

    return true;
  } catch (err) {
    logger.debug(`Failed to rollup transactional to daily entries`);
    logger.debug(err);
    return false;
  }
}
/**
 * Gets daily doc from the SavedObjects repository. Creates a new one if not found
 * @param savedObjectsClient
 * @param id The ID of the document to retrieve (typically, `${appId}:${dayId}`)
 * @param appId The application ID
 * @param viewId The application view ID
 * @param dayId The date of the document in the format YYYY-MM-DD
 */


async function getDailyDoc(savedObjectsClient, id, appId, viewId, dayId) {
  try {
    const {
      attributes,
      version
    } = await savedObjectsClient.get(_saved_objects_types.SAVED_OBJECTS_DAILY_TYPE, id);
    return {
      attributes,
      version
    };
  } catch (err) {
    if (_server.SavedObjectsErrorHelpers.isNotFoundError(err)) {
      return {
        attributes: {
          appId,
          viewId,
          // Concatenating the day in YYYY-MM-DD form to T00:00:00Z to reduce the TZ effects
          timestamp: (0, _moment.default)(`${(0, _moment.default)(dayId).format('YYYY-MM-DD')}T00:00:00Z`).toISOString(),
          minutesOnScreen: 0,
          numberOfClicks: 0
        }
      };
    }

    throw err;
  }
}