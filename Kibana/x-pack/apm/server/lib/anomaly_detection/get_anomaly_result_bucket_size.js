"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAnomalyResultBucketSize = getAnomalyResultBucketSize;

var _get_bucket_size = require("../helpers/get_bucket_size");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getAnomalyResultBucketSize({
  start,
  end
}) {
  return (0, _get_bucket_size.getBucketSize)({
    start,
    end,
    numBuckets: 100
  });
}