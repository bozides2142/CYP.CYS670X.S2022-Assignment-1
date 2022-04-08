"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PriorityCollection = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class PriorityCollection {
  constructor() {
    (0, _defineProperty2.default)(this, "array", []);
  }

  add(priority, value) {
    const foundIndex = this.array.findIndex(current => {
      if (priority === current.priority) {
        throw new Error('Already have entry with this priority');
      }

      return priority < current.priority;
    });
    const spliceIndex = foundIndex === -1 ? this.array.length : foundIndex;
    this.array.splice(spliceIndex, 0, {
      priority,
      value
    });
  }

  has(predicate) {
    return this.array.some(entry => predicate(entry.value));
  }

  toPrioritizedArray() {
    return this.array.map(entry => entry.value);
  }

}

exports.PriorityCollection = PriorityCollection;