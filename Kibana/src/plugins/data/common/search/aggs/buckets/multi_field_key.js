"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MultiFieldKey = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const id = Symbol('id');

const isBucketLike = bucket => {
  return Boolean(bucket && typeof bucket === 'object' && 'key' in bucket);
};

function getKeysFromBucket(bucket) {
  if (!isBucketLike(bucket)) {
    throw new Error('bucket malformed - no key found');
  }

  return Array.isArray(bucket.key) ? bucket.key.map(keyPart => String(keyPart)) : [String(bucket.key)];
}

class MultiFieldKey {
  constructor(bucket) {
    (0, _defineProperty2.default)(this, id, void 0);
    (0, _defineProperty2.default)(this, "keys", void 0);
    this.keys = getKeysFromBucket(bucket);
    this[id] = MultiFieldKey.idBucket(bucket);
  }

  static idBucket(bucket) {
    return getKeysFromBucket(bucket).join(',');
  }

  toString() {
    return this[id];
  }

}

exports.MultiFieldKey = MultiFieldKey;