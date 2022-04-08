"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFilterIpRange = void 0;

var _esQuery = require("@kbn/es-query");

var _cidr_mask = require("../lib/cidr_mask");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const createFilterIpRange = (aggConfig, key) => {
  let range;

  if (key.type === 'mask') {
    range = new _cidr_mask.CidrMask(key.mask).getRange();
  } else {
    range = {
      from: key.from ? key.from : -Infinity,
      to: key.to ? key.to : Infinity
    };
  }

  return (0, _esQuery.buildRangeFilter)(aggConfig.params.field, {
    gte: range.from,
    lte: range.to
  }, aggConfig.getIndexPattern());
};

exports.createFilterIpRange = createFilterIpRange;