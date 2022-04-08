"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAgentKeys = getAgentKeys;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getAgentKeys({
  context
}) {
  const body = {
    size: 1000,
    query: {
      bool: {
        filter: [{
          term: {
            'metadata.application': 'apm'
          }
        }]
      }
    }
  };
  const esClient = context.core.elasticsearch.client;
  const apiResponse = await esClient.asCurrentUser.transport.request({
    method: 'GET',
    path: '_security/_query/api_key',
    body
  });
  const agentKeys = apiResponse.body.api_keys.filter(({
    invalidated
  }) => !invalidated);
  return {
    agentKeys
  };
}