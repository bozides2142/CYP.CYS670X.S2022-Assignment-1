"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.times = times;
exports.memoize = memoize;
exports.browserTick = void 0;

var _times2 = _interopRequireDefault(require("lodash/times"));

var _memoize2 = _interopRequireDefault(require("lodash/memoize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function times(count, iteratee) {
  if (iteratee === undefined) {
    return (0, _times2.default)(count);
  }

  return (0, _times2.default)(count, iteratee);
}

function memoize(func, resolver) {
  return (0, _memoize2.default)(func, resolver);
}

var browserTick = function browserTick(callback) {
  requestAnimationFrame(callback);
};

exports.browserTick = browserTick;