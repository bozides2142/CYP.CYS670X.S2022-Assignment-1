"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.regenerateIds = void 0;

var _uuid = require("uuid");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Takes an array of saved objects and returns an importStateMap of randomly-generated new IDs.
 *
 * @param objects The saved objects to generate new IDs for.
 */
const regenerateIds = objects => {
  const importStateMap = new Map();

  for (const {
    type,
    id
  } of objects) {
    importStateMap.set(`${type}:${id}`, {
      destinationId: (0, _uuid.v4)(),
      omitOriginId: true
    });
  }

  return importStateMap;
};

exports.regenerateIds = regenerateIds;