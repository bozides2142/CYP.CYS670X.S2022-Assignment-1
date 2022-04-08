"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rollDailyData = rollDailyData;

var _saved_objects = require("../saved_objects");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * daily rollup function. Deletes histogram saved objects older than 3 days
 * @param logger
 * @param savedObjectsClient
 */
async function rollDailyData(logger, savedObjectsClient) {
  if (!savedObjectsClient) {
    return;
  }

  try {
    const settledDeletes = await (0, _saved_objects.deleteHistogramSavedObjects)(savedObjectsClient);
    const failedDeletes = settledDeletes.filter(({
      status
    }) => status !== 'fulfilled');

    if (failedDeletes.length) {
      throw failedDeletes;
    }
  } catch (err) {
    logger.debug(`Failed to rollup transactional to daily entries`);
    logger.debug(err);
  }
}