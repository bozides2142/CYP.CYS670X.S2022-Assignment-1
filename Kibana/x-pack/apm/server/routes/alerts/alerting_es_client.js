"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.alertingEsClient = alertingEsClient;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function alertingEsClient({
  scopedClusterClient,
  params
}) {
  const response = await scopedClusterClient.asCurrentUser.search({ ...params,
    ignore_unavailable: true
  });
  return response.body;
}