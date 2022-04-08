"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findMaps = findMaps;

var _std = require("@kbn/std");

var _constants = require("../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function findMaps(savedObjectsClient, callback) {
  let nextPage = 1;
  let hasMorePages = false;

  do {
    const results = await savedObjectsClient.find({
      type: _constants.MAP_SAVED_OBJECT_TYPE,
      page: nextPage
    });
    await (0, _std.asyncForEach)(results.saved_objects, async savedObject => {
      await callback(savedObject);
    });
    nextPage++;
    hasMorePages = results.page * results.per_page <= results.total;
  } while (hasMorePages);
}