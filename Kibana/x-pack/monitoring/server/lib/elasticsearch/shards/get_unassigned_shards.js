"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUnassignedShards = getUnassignedShards;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// Methods for calculating metrics for
// - Number of Primary Shards
// - Number of Replica Shards
// - Unassigned Primary Shards
// - Unassigned Replica Shards

function getUnassignedShards(indexShardStats) {
  let unassignedShards = 0;
  unassignedShards += indexShardStats.unassigned.primary;
  unassignedShards += indexShardStats.unassigned.replica;
  return unassignedShards;
}