"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildAggBody = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const buildAggBody = (fieldName, scriptFields) => {
  var _scriptFields$fieldNa;

  return (_scriptFields$fieldNa = scriptFields[fieldName]) !== null && _scriptFields$fieldNa !== void 0 ? _scriptFields$fieldNa : {
    field: fieldName
  };
};

exports.buildAggBody = buildAggBody;