"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasFleetServers = hasFleetServers;

var _constants = require("../../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Check if at least one fleet server is connected
 */


async function hasFleetServers(esClient) {
  const res = await esClient.search({
    index: _constants.FLEET_SERVER_SERVERS_INDEX,
    ignore_unavailable: true
  }); // @ts-expect-error value is number | TotalHits

  return res.body.hits.total.value > 0;
}