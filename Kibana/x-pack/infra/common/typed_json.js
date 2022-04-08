"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jsonValueRT = exports.jsonScalarRT = exports.jsonObjectRT = exports.jsonArrayRT = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

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


const jsonScalarRT = rt.union([rt.null, rt.boolean, rt.number, rt.string]);
exports.jsonScalarRT = jsonScalarRT;
const jsonValueRT = rt.recursion('JsonValue', () => rt.union([jsonScalarRT, jsonArrayRT, jsonObjectRT]));
exports.jsonValueRT = jsonValueRT;
const jsonArrayRT = rt.recursion('JsonArray', () => rt.array(jsonValueRT));
exports.jsonArrayRT = jsonArrayRT;
const jsonObjectRT = rt.recursion('JsonObject', () => rt.record(rt.string, jsonValueRT));
exports.jsonObjectRT = jsonObjectRT;