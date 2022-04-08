"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExecutionContextContainer = exports.BAGGAGE_MAX_PER_NAME_VALUE_PAIRS = exports.BAGGAGE_HEADER = void 0;
exports.getParentContextFrom = getParentContextFrom;

var _classPrivateFieldGet2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldGet"));

var _classPrivateFieldSet2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldSet"));

function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }

function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// Switch to the standard Baggage header. blocked by
// https://github.com/elastic/apm-agent-nodejs/issues/2102
const BAGGAGE_HEADER = 'x-kbn-context';
exports.BAGGAGE_HEADER = BAGGAGE_HEADER;

function getParentContextFrom(headers) {
  const header = headers[BAGGAGE_HEADER];
  return parseHeader(header);
}

function parseHeader(header) {
  if (!header) return undefined;

  try {
    return JSON.parse(decodeURIComponent(header));
  } catch (e) {
    return undefined;
  }
} // Maximum number of bytes per a single name-value pair allowed by w3c spec
// https://w3c.github.io/baggage/


const BAGGAGE_MAX_PER_NAME_VALUE_PAIRS = 4096; // a single character can use up to 4 bytes

exports.BAGGAGE_MAX_PER_NAME_VALUE_PAIRS = BAGGAGE_MAX_PER_NAME_VALUE_PAIRS;
const MAX_BAGGAGE_LENGTH = BAGGAGE_MAX_PER_NAME_VALUE_PAIRS / 4; // Limits the header value to max allowed "baggage" header property name-value pair
// It will help us switch to the "baggage" header when it becomes the standard.
// The trimmed value in the logs is better than nothing.

function enforceMaxLength(header) {
  return header.slice(0, MAX_BAGGAGE_LENGTH);
}
/**
 * @public
 */


function stringify(ctx) {
  const encodeURIComponentIfNotEmpty = val => encodeURIComponent(val || '');

  const stringifiedCtx = `${encodeURIComponentIfNotEmpty(ctx.type)}:${encodeURIComponentIfNotEmpty(ctx.name)}:${encodeURIComponentIfNotEmpty(ctx.id)}`;
  return ctx.child ? `${stringifiedCtx};${stringify(ctx.child)}` : stringifiedCtx;
}

var _context = /*#__PURE__*/new WeakMap();

class ExecutionContextContainer {
  constructor(context, parent) {
    _classPrivateFieldInitSpec(this, _context, {
      writable: true,
      value: void 0
    });

    (0, _classPrivateFieldSet2.default)(this, _context, parent ? { ...parent.toJSON(),
      child: context
    } : context);
  }

  toString() {
    return enforceMaxLength(stringify((0, _classPrivateFieldGet2.default)(this, _context)));
  }

  toJSON() {
    return (0, _classPrivateFieldGet2.default)(this, _context);
  }

}

exports.ExecutionContextContainer = ExecutionContextContainer;