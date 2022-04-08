"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decodeOrThrow = exports.createPlainError = void 0;
exports.excess = excess;
exports.throwErrors = exports.formatErrors = void 0;

var _Either = require("fp-ts/lib/Either");

var _function = require("fp-ts/lib/function");

var _pipeable = require("fp-ts/lib/pipeable");

var rt = _interopRequireWildcard(require("io-ts"));

var _fp = require("lodash/fp");

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
 * @deprecated Use packages/kbn-securitysolution-io-ts-utils/src/format_errors/index.ts
 * Bug fix for the TODO is in the format_errors package
 */


const formatErrors = errors => {
  const err = errors.map(error => {
    if (error.message != null) {
      return error.message;
    } else {
      const keyContext = error.context.filter(entry => entry.key != null && !Number.isInteger(+entry.key) && entry.key.trim() !== '').map(entry => entry.key).join(',');
      const nameContext = error.context.find(entry => {
        // TODO: Put in fix for optional chaining https://github.com/cypress-io/cypress/issues/9298
        if (entry.type && entry.type.name) {
          return entry.type.name.length > 0;
        }

        return false;
      });
      const suppliedValue = keyContext !== '' ? keyContext : nameContext != null ? nameContext.type.name : '';
      const value = (0, _fp.isObject)(error.value) ? JSON.stringify(error.value) : error.value;
      return `Invalid value "${value}" supplied to "${suppliedValue}"`;
    }
  });
  return [...new Set(err)];
};

exports.formatErrors = formatErrors;

const createPlainError = message => new Error(message);

exports.createPlainError = createPlainError;

const throwErrors = createError => errors => {
  throw createError(formatErrors(errors).join());
};

exports.throwErrors = throwErrors;

const decodeOrThrow = (runtimeType, createError = createPlainError) => inputValue => (0, _pipeable.pipe)(runtimeType.decode(inputValue), (0, _Either.fold)(throwErrors(createError), _function.identity));

exports.decodeOrThrow = decodeOrThrow;

const getExcessProps = (props, r) => {
  const ex = [];

  for (const k of Object.keys(r)) {
    if (!Object.prototype.hasOwnProperty.call(props, k)) {
      ex.push(k);
    }
  }

  return ex;
};

function excess(codec) {
  const r = new rt.InterfaceType(codec.name, codec.is, (i, c) => _Either.either.chain(rt.UnknownRecord.validate(i, c), s => {
    const ex = getExcessProps(codec.props, s);
    return ex.length > 0 ? rt.failure(i, c, `Invalid value ${JSON.stringify(i)} supplied to : ${codec.name}, excess properties: ${JSON.stringify(ex)}`) : codec.validate(i, c);
  }), codec.encode, codec.props);
  return r;
}