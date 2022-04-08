"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rollTotals = rollTotals;

var _constants = require("../../../../../usage_collection/common/constants");

var _saved_objects_types = require("../saved_objects_types");

var _utils = require("./utils");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Moves all the daily documents into aggregated "total" documents as we don't care about any granularity after 90 days
 * @param logger
 * @param savedObjectsClient
 */
async function rollTotals(logger, savedObjectsClient) {
  if (!savedObjectsClient) {
    return;
  }

  try {
    const [{
      saved_objects: rawApplicationUsageTotals
    }, {
      saved_objects: rawApplicationUsageDaily
    }] = await Promise.all([savedObjectsClient.find({
      perPage: 10000,
      type: _saved_objects_types.SAVED_OBJECTS_TOTAL_TYPE
    }), savedObjectsClient.find({
      perPage: 10000,
      type: _saved_objects_types.SAVED_OBJECTS_DAILY_TYPE,
      filter: `${_saved_objects_types.SAVED_OBJECTS_DAILY_TYPE}.attributes.timestamp < now-90d`
    })]);
    const existingTotals = rawApplicationUsageTotals.reduce((acc, {
      attributes: {
        appId,
        viewId = _constants.MAIN_APP_DEFAULT_VIEW_ID,
        numberOfClicks,
        minutesOnScreen
      }
    }) => {
      const key = viewId === _constants.MAIN_APP_DEFAULT_VIEW_ID ? appId : (0, _utils.serializeKey)(appId, viewId);
      return { ...acc,
        // No need to sum because there should be 1 document per appId only
        [key]: {
          appId,
          viewId,
          numberOfClicks,
          minutesOnScreen
        }
      };
    }, {});
    const totals = rawApplicationUsageDaily.reduce((acc, {
      attributes
    }) => {
      const {
        appId,
        viewId = _constants.MAIN_APP_DEFAULT_VIEW_ID,
        numberOfClicks,
        minutesOnScreen
      } = attributes;
      const key = viewId === _constants.MAIN_APP_DEFAULT_VIEW_ID ? appId : (0, _utils.serializeKey)(appId, viewId);
      const existing = acc[key] || {
        minutesOnScreen: 0,
        numberOfClicks: 0
      };
      return { ...acc,
        [key]: {
          appId,
          viewId,
          numberOfClicks: numberOfClicks + existing.numberOfClicks,
          minutesOnScreen: minutesOnScreen + existing.minutesOnScreen
        }
      };
    }, existingTotals);
    await Promise.all([Object.entries(totals).length && savedObjectsClient.bulkCreate(Object.entries(totals).map(([id, entry]) => ({
      type: _saved_objects_types.SAVED_OBJECTS_TOTAL_TYPE,
      id,
      attributes: entry
    })), {
      overwrite: true
    }), ...rawApplicationUsageDaily.map(({
      id
    }) => savedObjectsClient.delete(_saved_objects_types.SAVED_OBJECTS_DAILY_TYPE, id) // There is no bulkDelete :(
    )]);
  } catch (err) {
    logger.debug(`Failed to rollup daily entries to totals`);
    logger.debug(err);
  }
}