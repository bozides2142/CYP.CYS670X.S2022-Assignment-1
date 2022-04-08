"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ensureValidConfiguration = ensureValidConfiguration;

var _errors = require("../errors");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const ignoredPaths = ['dev.', 'elastic.apm.'];
const invalidConfigExitCode = 78;
const legacyInvalidConfigExitCode = 64;

async function ensureValidConfiguration(configService, params) {
  try {
    await configService.validate(params);
  } catch (e) {
    throw new _errors.CriticalError(e.message, 'InvalidConfig', invalidConfigExitCode, e);
  }

  const unusedPaths = await configService.getUnusedPaths();
  const unusedConfigKeys = unusedPaths.filter(unusedPath => {
    return !ignoredPaths.some(ignoredPath => unusedPath.startsWith(ignoredPath));
  });

  if (unusedConfigKeys.length > 0) {
    const message = `Unknown configuration key(s): ${unusedConfigKeys.map(key => `"${key}"`).join(', ')}. Check for spelling errors and ensure that expected plugins are installed.`;
    throw new _errors.CriticalError(message, 'InvalidConfig', legacyInvalidConfigExitCode);
  }
}