"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEsErrorMessage = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getEsCause = (obj = {}, causes = []) => {
  const updated = [...causes];

  if (obj.caused_by) {
    var _obj$caused_by;

    if ((_obj$caused_by = obj.caused_by) !== null && _obj$caused_by !== void 0 && _obj$caused_by.reason) {
      var _obj$caused_by2;

      updated.push((_obj$caused_by2 = obj.caused_by) === null || _obj$caused_by2 === void 0 ? void 0 : _obj$caused_by2.reason);
    } // Recursively find all the "caused by" reasons


    return getEsCause(obj.caused_by, updated);
  }

  if (obj.failed_shards && obj.failed_shards.length) {
    for (const failure of obj.failed_shards) {
      if (failure && failure.reason) {
        updated.push(...getEsCause(failure.reason));
      }
    }
  }

  return updated.filter(Boolean);
};

const getEsErrorMessage = error => {
  var _error$error$meta$bod, _error$error, _error$error$meta, _error$error$meta$bod2, _error$meta, _error$meta$body;

  let message = error === null || error === void 0 ? void 0 : error.message;
  const apiError = (_error$error$meta$bod = error === null || error === void 0 ? void 0 : (_error$error = error.error) === null || _error$error === void 0 ? void 0 : (_error$error$meta = _error$error.meta) === null || _error$error$meta === void 0 ? void 0 : (_error$error$meta$bod2 = _error$error$meta.body) === null || _error$error$meta$bod2 === void 0 ? void 0 : _error$error$meta$bod2.error) !== null && _error$error$meta$bod !== void 0 ? _error$error$meta$bod : error === null || error === void 0 ? void 0 : (_error$meta = error.meta) === null || _error$meta === void 0 ? void 0 : (_error$meta$body = _error$meta.body) === null || _error$meta$body === void 0 ? void 0 : _error$meta$body.error;

  if (apiError) {
    message += `, caused by: "${getEsCause(apiError)}"`;
  }

  return message;
};

exports.getEsErrorMessage = getEsErrorMessage;