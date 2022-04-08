"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.invalidateAgentKey = invalidateAgentKey;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function invalidateAgentKey({
  context,
  id
}) {
  const {
    body: {
      invalidated_api_keys: invalidatedAgentKeys
    }
  } = await context.core.elasticsearch.client.asCurrentUser.security.invalidateApiKey({
    body: {
      ids: [id],
      owner: true
    }
  });
  return {
    invalidatedAgentKeys
  };
}