"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalizeIndexShards = normalizeIndexShards;
exports.normalizeNodeShards = normalizeNodeShards;

var _lodash = require("lodash");

var _nodes = require("../nodes");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function normalizeNodeShards(masterNode) {
  return (nodes, node) => {
    if (node.key && node.node_ids) {
      var _node$node_names$buck;

      const nodeIds = node.node_ids.buckets.map(b => b.key);
      const _node = { ...node,
        node_ids: nodeIds
      };
      return { ...nodes,
        [node.key]: {
          shardCount: node.doc_count,
          indexCount: node.index_count.value,
          // this field is always missing, problem with package?  elasticsearch.node.name ECS field doesn't exist
          name: ((_node$node_names$buck = node.node_names.buckets[0]) === null || _node$node_names$buck === void 0 ? void 0 : _node$node_names$buck.key) || 'NO NAME',
          node_ids: nodeIds,
          type: (0, _nodes.calculateNodeType)(_node, masterNode) // put the "star" icon on the node link in the shard allocator

        }
      };
    }

    return nodes;
  };
}

const countShards = shardBuckets => {
  let primaryShards = 0;
  let replicaShards = 0;
  shardBuckets.forEach(shard => {
    var _shard$primary$bucket;

    const primaryMap = (_shard$primary$bucket = shard.primary.buckets) !== null && _shard$primary$bucket !== void 0 ? _shard$primary$bucket : [];
    const primaryBucket = primaryMap.find(b => b.key_as_string === 'true');

    if (primaryBucket !== undefined) {
      primaryShards += primaryBucket.doc_count;
    }

    const replicaBucket = primaryMap.find(b => b.key_as_string === 'false');

    if (replicaBucket !== undefined) {
      replicaShards += replicaBucket.doc_count;
    }
  });
  return {
    primaryShards,
    replicaShards
  };
};
/*
 * Reducer function for a set of indices to key the array by index name, and
 * summarize the shard data.
 * @return reducer function for set of indices
 */


function normalizeIndexShards(indices, index) {
  var _index$states$buckets, _index$states;

  const stateBuckets = (_index$states$buckets = (_index$states = index.states) === null || _index$states === void 0 ? void 0 : _index$states.buckets) !== null && _index$states$buckets !== void 0 ? _index$states$buckets : [];
  const [assignedShardBuckets, unassignedShardBuckets] = (0, _lodash.partition)(stateBuckets, b => {
    return b.key === 'STARTED' || b.key === 'RELOCATING';
  });
  const {
    primaryShards: primary,
    replicaShards: replica
  } = countShards(assignedShardBuckets);
  const {
    primaryShards: unassignedPrimary,
    replicaShards: unassignedReplica
  } = countShards(unassignedShardBuckets);
  let status = 'green';

  if (unassignedReplica > 0) {
    status = 'yellow';
  }

  if (unassignedPrimary > 0) {
    status = 'red';
  }

  return { ...indices,
    [index.key]: {
      status,
      primary,
      replica,
      unassigned: {
        primary: unassignedPrimary,
        replica: unassignedReplica
      }
    }
  };
}