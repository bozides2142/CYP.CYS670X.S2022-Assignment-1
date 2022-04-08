"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimedItemBuffer = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _item_buffer = require("./item_buffer");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class TimedItemBuffer extends _item_buffer.ItemBuffer {
  constructor(params) {
    super(params);
    (0, _defineProperty2.default)(this, "timer", void 0);
    (0, _defineProperty2.default)(this, "onTimeout", () => {
      this.flush();
    });
    this.params = params;
  }

  write(item) {
    super.write(item);

    if (this.params.maxItemAge && this.length === 1) {
      this.timer = setTimeout(this.onTimeout, this.params.maxItemAge);
    }
  }

  clear() {
    clearTimeout(this.timer);
    super.clear();
  }

  flush() {
    clearTimeout(this.timer);
    super.flush();
  }

}

exports.TimedItemBuffer = TimedItemBuffer;