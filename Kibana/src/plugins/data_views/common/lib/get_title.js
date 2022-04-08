"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTitle = getTitle;

var _constants = require("../constants");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
async function getTitle(client, indexPatternId) {
  const savedObject = await client.get(_constants.DATA_VIEW_SAVED_OBJECT_TYPE, indexPatternId);

  if (savedObject.error) {
    throw new Error(`Unable to get index-pattern title: ${savedObject.error.message}`);
  }

  return savedObject.attributes.title;
}