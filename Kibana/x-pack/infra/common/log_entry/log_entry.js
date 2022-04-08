"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logTimestampColumnRT = exports.logMessagePartRT = exports.logMessageFieldPartRT = exports.logMessageConstantPartRT = exports.logMessageColumnRT = exports.logFieldColumnRT = exports.logEntryRT = exports.logEntryFieldRT = exports.logEntryContextRT = exports.logColumnRT = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

var _typed_json = require("../typed_json");

var _log_entry_cursor = require("./log_entry_cursor");

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

/**
 * message parts
 */


const logMessageConstantPartRT = rt.type({
  constant: rt.string
});
exports.logMessageConstantPartRT = logMessageConstantPartRT;
const logMessageFieldPartRT = rt.type({
  field: rt.string,
  value: _typed_json.jsonArrayRT,
  highlights: rt.array(rt.string)
});
exports.logMessageFieldPartRT = logMessageFieldPartRT;
const logMessagePartRT = rt.union([logMessageConstantPartRT, logMessageFieldPartRT]);
exports.logMessagePartRT = logMessagePartRT;
/**
 * columns
 */

const logTimestampColumnRT = rt.type({
  columnId: rt.string,
  timestamp: rt.number
});
exports.logTimestampColumnRT = logTimestampColumnRT;
const logFieldColumnRT = rt.type({
  columnId: rt.string,
  field: rt.string,
  value: _typed_json.jsonArrayRT,
  highlights: rt.array(rt.string)
});
exports.logFieldColumnRT = logFieldColumnRT;
const logMessageColumnRT = rt.type({
  columnId: rt.string,
  message: rt.array(logMessagePartRT)
});
exports.logMessageColumnRT = logMessageColumnRT;
const logColumnRT = rt.union([logTimestampColumnRT, logFieldColumnRT, logMessageColumnRT]);
exports.logColumnRT = logColumnRT;
/**
 * fields
 */

const logEntryContextRT = rt.union([rt.type({}), rt.type({
  'container.id': rt.string
}), rt.type({
  'host.name': rt.string,
  'log.file.path': rt.string
})]);
exports.logEntryContextRT = logEntryContextRT;
const logEntryFieldRT = rt.type({
  field: rt.string,
  value: _typed_json.jsonArrayRT
});
exports.logEntryFieldRT = logEntryFieldRT;
/**
 * entry
 */

const logEntryRT = rt.type({
  id: rt.string,
  index: rt.string,
  cursor: _log_entry_cursor.logEntryCursorRT,
  columns: rt.array(logColumnRT),
  context: logEntryContextRT
});
exports.logEntryRT = logEntryRT;