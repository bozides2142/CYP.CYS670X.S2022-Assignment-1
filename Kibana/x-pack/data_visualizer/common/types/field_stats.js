"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isIKibanaSearchResponse = void 0;
exports.isValidField = isValidField;
exports.isValidFieldStats = isValidFieldStats;

var _object_utils = require("../utils/object_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function isValidField(arg) {
  return (0, _object_utils.isPopulatedObject)(arg, ['fieldName', 'type']) && typeof arg.fieldName === 'string';
}

const isIKibanaSearchResponse = arg => {
  return (0, _object_utils.isPopulatedObject)(arg, ['rawResponse']);
};

exports.isIKibanaSearchResponse = isIKibanaSearchResponse;

function isValidFieldStats(arg) {
  return (0, _object_utils.isPopulatedObject)(arg, ['fieldName', 'type', 'count']);
}