"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFileCacheKey = exports.generateFileHash = void 0;

var _fs = require("fs");

var _crypto = require("crypto");

var Rx = _interopRequireWildcard(require("rxjs"));

var _operators = require("rxjs/operators");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const generateFileHash = fd => {
  const hash = (0, _crypto.createHash)('sha1');
  const read = (0, _fs.createReadStream)(null, {
    fd,
    start: 0,
    autoClose: false
  });
  return Rx.merge(Rx.fromEvent(read, 'data'), Rx.fromEvent(read, 'error').pipe((0, _operators.map)(error => {
    throw error;
  }))).pipe((0, _operators.takeUntil)(Rx.fromEvent(read, 'end'))).forEach(chunk => hash.update(chunk)).then(() => hash.digest('hex'));
};

exports.generateFileHash = generateFileHash;

const getFileCacheKey = (path, stat) => `${path}:${stat.ino}:${stat.size}:${stat.mtime.getTime()}`;

exports.getFileCacheKey = getFileCacheKey;