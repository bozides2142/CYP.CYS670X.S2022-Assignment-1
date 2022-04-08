"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.open = exports.fstat = exports.close = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _util = require("util");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// can't use fs/promises when working with streams using file descriptors
// see https://github.com/nodejs/node/issues/35862
const open = (0, _util.promisify)(_fs.default.open);
exports.open = open;
const close = (0, _util.promisify)(_fs.default.close);
exports.close = close;
const fstat = (0, _util.promisify)(_fs.default.fstat);
exports.fstat = fstat;