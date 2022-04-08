"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ES_CLIENT_TOTAL_HITS_RELATION = void 0;
exports.isMultiBucketAggregate = isMultiBucketAggregate;

var _object_utils = require("../util/object_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function isMultiBucketAggregate(arg) {
  return (0, _object_utils.isPopulatedObject)(arg, ['buckets']);
}

const ES_CLIENT_TOTAL_HITS_RELATION = {
  EQ: 'eq',
  GTE: 'gte'
};
exports.ES_CLIENT_TOTAL_HITS_RELATION = ES_CLIENT_TOTAL_HITS_RELATION;