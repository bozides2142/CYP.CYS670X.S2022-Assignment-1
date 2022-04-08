"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jsonFromBase64StringRT = exports.createErrorFromShardFailure = exports.createAsyncRequestRTs = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

var _jsonStableStringify = _interopRequireDefault(require("json-stable-stringify"));

var _typed_json = require("../../common/typed_json");

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


const jsonFromBase64StringRT = new rt.Type('JSONFromBase64String', _typed_json.jsonValueRT.is, (value, context) => {
  try {
    return rt.success(JSON.parse(Buffer.from(value, 'base64').toString()));
  } catch (error) {
    return rt.failure(error, context);
  }
}, a => Buffer.from((0, _jsonStableStringify.default)(a)).toString('base64'));
exports.jsonFromBase64StringRT = jsonFromBase64StringRT;

const createAsyncRequestRTs = (stateCodec, paramsCodec) => {
  const asyncRecoveredRequestRT = rt.type({
    id: stateCodec,
    params: paramsCodec
  });
  const asyncInitialRequestRT = rt.type({
    id: rt.undefined,
    params: paramsCodec
  });
  const asyncRequestRT = rt.union([asyncRecoveredRequestRT, asyncInitialRequestRT]);
  return {
    asyncInitialRequestRT,
    asyncRecoveredRequestRT,
    asyncRequestRT
  };
};

exports.createAsyncRequestRTs = createAsyncRequestRTs;

const createErrorFromShardFailure = failure => {
  var _failure$index, _failure$node, _failure$shard, _failure$reason$reaso, _failure$reason;

  return {
    type: 'shardFailure',
    shardInfo: {
      index: (_failure$index = failure.index) !== null && _failure$index !== void 0 ? _failure$index : null,
      node: (_failure$node = failure.node) !== null && _failure$node !== void 0 ? _failure$node : null,
      shard: (_failure$shard = failure.shard) !== null && _failure$shard !== void 0 ? _failure$shard : null
    },
    message: (_failure$reason$reaso = (_failure$reason = failure.reason) === null || _failure$reason === void 0 ? void 0 : _failure$reason.reason) !== null && _failure$reason$reaso !== void 0 ? _failure$reason$reaso : null
  };
};

exports.createErrorFromShardFailure = createErrorFromShardFailure;