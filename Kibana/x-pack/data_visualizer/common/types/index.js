"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isSavedSearchSavedObject = isSavedSearchSavedObject;

var _object_utils = require("../utils/object_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function isSavedSearchSavedObject(arg) {
  return (0, _object_utils.isPopulatedObject)(arg, ['id', 'type', 'attributes']);
}