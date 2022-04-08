"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.usageMetricType = exports.usageMetricSavedObjectMappings = void 0;

var _types = require("../../../common/types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const usageMetricSavedObjectMappings = {
  properties: {
    count: {
      type: 'long'
    },
    errors: {
      type: 'long'
    }
  }
};
exports.usageMetricSavedObjectMappings = usageMetricSavedObjectMappings;
const usageMetricType = {
  name: _types.usageMetricSavedObjectType,
  hidden: false,
  namespaceType: 'agnostic',
  mappings: usageMetricSavedObjectMappings
};
exports.usageMetricType = usageMetricType;