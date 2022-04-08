"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkColumnForPrecisionError = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/** @public **/
const checkColumnForPrecisionError = column => {
  var _column$meta$sourcePa;

  return (_column$meta$sourcePa = column.meta.sourceParams) === null || _column$meta$sourcePa === void 0 ? void 0 : _column$meta$sourcePa.hasPrecisionError;
};

exports.checkColumnForPrecisionError = checkColumnForPrecisionError;