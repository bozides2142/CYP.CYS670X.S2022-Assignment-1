"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TabifyBuckets = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = require("lodash");

var _moment = _interopRequireDefault(require("moment"));

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const isRangeEqual = (range1, range2) => (range1 === null || range1 === void 0 ? void 0 : range1.from) === (range2 === null || range2 === void 0 ? void 0 : range2.from) && (range1 === null || range1 === void 0 ? void 0 : range1.to) === (range2 === null || range2 === void 0 ? void 0 : range2.to);

class TabifyBuckets {
  constructor(aggResp, aggParams, timeRange) {
    (0, _defineProperty2.default)(this, "length", void 0);
    (0, _defineProperty2.default)(this, "objectMode", void 0);
    (0, _defineProperty2.default)(this, "buckets", void 0);
    (0, _defineProperty2.default)(this, "_keys", []);

    if (aggResp && aggResp.buckets) {
      this.buckets = aggResp.buckets;
    } else if (aggResp) {
      // Some Bucket Aggs only return a single bucket (like filter).
      // In those instances, the aggResp is the content of the single bucket.
      this.buckets = [aggResp];
    } else {
      this.buckets = [];
    }

    this.objectMode = (0, _lodash.isPlainObject)(this.buckets);

    if (this.objectMode) {
      this._keys = (0, _lodash.keys)(this.buckets);
      this.length = this._keys.length;
    } else {
      this.length = this.buckets.length;
    }

    if (this.length && aggParams) {
      this.orderBucketsAccordingToParams(aggParams);

      if (aggParams.drop_partials) {
        this.dropPartials(aggParams, timeRange);
      }
    }
  }

  forEach(fn) {
    const buckets = this.buckets;

    if (this.objectMode) {
      this._keys.forEach(key => {
        fn(buckets[key], key);
      });
    } else {
      buckets.forEach(bucket => {
        fn(bucket, bucket.key);
      });
    }
  }

  orderBucketsAccordingToParams(params) {
    if (params.filters && this.objectMode) {
      this._keys = params.filters.map(filter => {
        const query = (0, _lodash.get)(filter, 'input.query.query_string.query', filter.input.query);
        const queryString = typeof query === 'string' ? query : JSON.stringify(query);
        return filter.label || queryString || '*';
      });
    } else if (params.ranges && this.objectMode) {
      this._keys = params.ranges.map(range => (0, _lodash.findKey)(this.buckets, el => isRangeEqual(el, range)));
    } else if (params.ranges && params.field.type !== 'date') {
      let ranges = params.ranges;

      if (params.ipRangeType) {
        ranges = params.ipRangeType === 'mask' ? ranges.mask : ranges.fromTo;
      }

      this.buckets = ranges.map(range => {
        if (range.mask) {
          return this.buckets.find(el => el.key === range.mask);
        }

        return this.buckets.find(el => isRangeEqual(el, range));
      });
    }
  } // dropPartials should only be called if the aggParam setting is enabled,
  // and the agg field is the same as the Time Range.


  dropPartials(params, timeRange) {
    if (!timeRange || this.buckets.length <= 1 || this.objectMode || !timeRange.timeFields.includes(params.field.name)) {
      return;
    }

    const interval = this.buckets[1].key - this.buckets[0].key;
    this.buckets = this.buckets.filter(bucket => {
      if ((0, _moment.default)(bucket.key).isBefore(timeRange.from)) {
        return false;
      }

      if ((0, _moment.default)(bucket.key + interval).isAfter(timeRange.to)) {
        return false;
      }

      return true;
    });
    this.length = this.buckets.length;
  }

}

exports.TabifyBuckets = TabifyBuckets;