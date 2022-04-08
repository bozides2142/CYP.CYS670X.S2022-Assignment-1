"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.invalidateAPIKeys = invalidateAPIKeys;

var _app_context = require("../app_context");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function invalidateAPIKeys(ids) {
  const security = _app_context.appContextService.getSecurity();

  if (!security) {
    throw new Error('Missing security plugin');
  }

  try {
    const res = await security.authc.apiKeys.invalidateAsInternalUser({
      ids
    });
    return res;
  } catch (err) {
    throw err;
  }
}