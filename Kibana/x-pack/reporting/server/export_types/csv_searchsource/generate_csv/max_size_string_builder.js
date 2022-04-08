"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MaxSizeStringBuilder = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class MaxSizeStringBuilder {
  constructor(stream, maxSizeBytes, bom = '') {
    (0, _defineProperty2.default)(this, "size", 0);
    (0, _defineProperty2.default)(this, "pristine", true);
    this.stream = stream;
    this.maxSizeBytes = maxSizeBytes;
    this.bom = bom;
  }

  tryAppend(chunk) {
    const byteLength = Buffer.byteLength(chunk);

    if (this.size + byteLength > this.maxSizeBytes) {
      return false;
    }

    if (this.pristine) {
      this.stream.write(this.bom);
      this.pristine = false;
    }

    this.stream.write(chunk);
    this.size += byteLength;
    return true;
  }

  getSizeInBytes() {
    return this.size;
  }

}

exports.MaxSizeStringBuilder = MaxSizeStringBuilder;