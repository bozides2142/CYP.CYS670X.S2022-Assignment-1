"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PassThroughStream = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _stream = require("stream");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class PassThroughStream extends _stream.PassThrough {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "bytesWritten", 0);
    (0, _defineProperty2.default)(this, "firstBytePromise", new Promise(resolve => {
      this.onFirstByte = resolve;
    }));
  }

  _write(chunk, encoding, callback) {
    const size = Buffer.isBuffer(chunk) ? chunk.byteLength : chunk.length;

    if (!this.bytesWritten && size) {
      var _this$onFirstByte;

      (_this$onFirstByte = this.onFirstByte) === null || _this$onFirstByte === void 0 ? void 0 : _this$onFirstByte.call(this);
    }

    this.bytesWritten += size;
    return super._write(chunk, encoding, callback);
  }

}

exports.PassThroughStream = PassThroughStream;