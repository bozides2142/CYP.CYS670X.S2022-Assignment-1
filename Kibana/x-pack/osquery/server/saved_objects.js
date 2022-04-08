"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initSavedObjects = void 0;

var _saved_object_mappings = require("./lib/saved_query/saved_object_mappings");

var _saved_object_mappings2 = require("./routes/usage/saved_object_mappings");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const initSavedObjects = savedObjects => {
  savedObjects.registerType(_saved_object_mappings2.usageMetricType);
  savedObjects.registerType(_saved_object_mappings.savedQueryType);
  savedObjects.registerType(_saved_object_mappings.packType);
};

exports.initSavedObjects = initSavedObjects;