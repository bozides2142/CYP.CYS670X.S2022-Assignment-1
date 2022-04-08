"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.comparisonRangeRt = void 0;
Object.defineProperty(exports, "environmentRt", {
  enumerable: true,
  get: function () {
    return _environment_rt.environmentRt;
  }
});
exports.rangeRt = exports.offsetRt = exports.kueryRt = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _ioTsUtils = require("@kbn/io-ts-utils");

var _environment_rt = require("../../common/environment_rt");

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const rangeRt = t.type({
  start: _ioTsUtils.isoToEpochRt,
  end: _ioTsUtils.isoToEpochRt
});
exports.rangeRt = rangeRt;
const offsetRt = t.partial({
  offset: t.string
});
exports.offsetRt = offsetRt;
const comparisonRangeRt = t.partial({
  comparisonStart: _ioTsUtils.isoToEpochRt,
  comparisonEnd: _ioTsUtils.isoToEpochRt
});
exports.comparisonRangeRt = comparisonRangeRt;
const kueryRt = t.type({
  kuery: t.string
});
exports.kueryRt = kueryRt;