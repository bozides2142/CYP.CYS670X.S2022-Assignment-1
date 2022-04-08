"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFilterHistogram = void 0;

var _esQuery = require("@kbn/es-query");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/** @internal */
const createFilterHistogram = getFieldFormatsStart => {
  return (aggConfig, key) => {
    const {
      deserialize
    } = getFieldFormatsStart();
    const value = parseInt(key, 10);
    const params = {
      gte: value,
      lt: value + (typeof aggConfig.params.used_interval === 'number' ? aggConfig.params.used_interval : aggConfig.params.interval)
    };
    return (0, _esQuery.buildRangeFilter)(aggConfig.params.field, params, aggConfig.getIndexPattern(), deserialize(aggConfig.toSerializedFieldFormat()).convert(key));
  };
};

exports.createFilterHistogram = createFilterHistogram;