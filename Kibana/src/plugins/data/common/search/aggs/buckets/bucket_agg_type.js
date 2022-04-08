"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BucketAggType = void 0;
exports.isBucketAggType = isBucketAggType;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _agg_type = require("../agg_type");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const bucketType = 'buckets';

class BucketAggType extends _agg_type.AggType {
  getShiftedKey(agg, key, timeShift) {
    return key;
  }

  getTimeShiftInterval(agg) {
    return undefined;
  }

  orderBuckets(agg, a, b) {
    return Number(a.key) - Number(b.key);
  }

  constructor(config) {
    super(config);
    (0, _defineProperty2.default)(this, "getKey", void 0);
    (0, _defineProperty2.default)(this, "type", bucketType);

    this.getKey = config.getKey || ((bucket, key) => {
      return key || bucket.key;
    });

    if (config.getShiftedKey) {
      this.getShiftedKey = config.getShiftedKey;
    }

    if (config.orderBuckets) {
      this.orderBuckets = config.orderBuckets;
    }

    if (config.getTimeShiftInterval) {
      this.getTimeShiftInterval = config.getTimeShiftInterval;
    }

    if (config.splitForTimeShift) {
      this.splitForTimeShift = config.splitForTimeShift;
    }
  }

}

exports.BucketAggType = BucketAggType;

function isBucketAggType(aggConfig) {
  return aggConfig && aggConfig.type === bucketType;
}