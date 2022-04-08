"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dropLastBucketFn = void 0;

var _helpers = require("../../helpers");

var _drop_last_bucket = require("../series/drop_last_bucket");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// @ts-expect-error no typed yet
const dropLastBucketFn = ({
  response,
  panel,
  series
}) => next => results => {
  const shouldDropLastBucket = (0, _helpers.isLastValueTimerangeMode)(panel);

  if (shouldDropLastBucket) {
    const fn = (0, _drop_last_bucket.dropLastBucket)(response, panel, series);
    return fn(next)(results);
  }

  return next(results);
};

exports.dropLastBucketFn = dropLastBucketFn;