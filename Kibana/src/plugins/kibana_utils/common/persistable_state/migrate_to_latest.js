"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migrateToLatest = migrateToLatest;

var _compare = _interopRequireDefault(require("semver/functions/compare"));

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function migrateToLatest(migrations, {
  state,
  version: oldVersion
}) {
  const versions = Object.keys(migrations || {}).filter(v => (0, _compare.default)(v, oldVersion) > 0).sort(_compare.default);
  if (!versions.length) return state;

  for (const version of versions) {
    state = migrations[version](state);
  }

  return state;
}