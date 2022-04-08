"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAnnotationBuckets = getAnnotationBuckets;

var _lodash = require("lodash");

var _helpers = require("../../helpers");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const concatenateValues = values => values.join(',');

function getAnnotationBuckets(resp, annotation) {
  const buckets = (0, _lodash.get)(resp, `aggregations.${annotation.id}.buckets`, []);
  return buckets.filter(bucket => !(0, _lodash.isEmpty)(bucket.hits.hits.hits)).map(bucket => ({
    key: bucket.key,
    docs: bucket.hits.hits.hits.map(doc => Object.keys(doc.fields).reduce((acc, key) => {
      (0, _helpers.overwrite)(acc, key, concatenateValues(doc.fields[key]));
      return acc;
    }, {}))
  }));
}