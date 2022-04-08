"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapNodesInfo = mapNodesInfo;

var _lodash = require("lodash");

var _calculate_node_type = require("../calculate_node_type");

var _get_node_type_class_label = require("../get_node_type_class_label");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * @param {Array} nodeHits: info about each node from the hits in the get_nodes query
 * @param {Object} clusterStats: cluster stats from cluster state document
 * @param {Object} nodesShardCount: per-node information about shards
 * @return {Object} summarized info about each node keyed by nodeId
 */


function mapNodesInfo(nodeHits, clusterStats, nodesShardCount) {
  var _clusterStats$cluster, _clusterStats$elastic, _clusterStats$elastic2, _clusterStats$elastic3;

  const clusterState = (_clusterStats$cluster = clusterStats === null || clusterStats === void 0 ? void 0 : clusterStats.cluster_state) !== null && _clusterStats$cluster !== void 0 ? _clusterStats$cluster : clusterStats === null || clusterStats === void 0 ? void 0 : (_clusterStats$elastic = clusterStats.elasticsearch) === null || _clusterStats$elastic === void 0 ? void 0 : (_clusterStats$elastic2 = _clusterStats$elastic.cluster) === null || _clusterStats$elastic2 === void 0 ? void 0 : (_clusterStats$elastic3 = _clusterStats$elastic2.stats) === null || _clusterStats$elastic3 === void 0 ? void 0 : _clusterStats$elastic3.state;
  return nodeHits.reduce((prev, node) => {
    var _node$_source$elastic, _ref, _sourceNode$uuid, _node$_source$service, _node$_source$service2, _nodesShardCount$node, _nodesShardCount$node2;

    const sourceNode = node._source.source_node || ((_node$_source$elastic = node._source.elasticsearch) === null || _node$_source$elastic === void 0 ? void 0 : _node$_source$elastic.node);
    if (!sourceNode) return prev;
    const calculatedNodeType = (0, _calculate_node_type.calculateNodeType)(sourceNode, clusterState === null || clusterState === void 0 ? void 0 : clusterState.master_node);
    const {
      nodeType,
      nodeTypeLabel,
      nodeTypeClass
    } = (0, _get_node_type_class_label.getNodeTypeClassLabel)(sourceNode, calculatedNodeType);
    const uuid = (_ref = (_sourceNode$uuid = sourceNode === null || sourceNode === void 0 ? void 0 : sourceNode.uuid) !== null && _sourceNode$uuid !== void 0 ? _sourceNode$uuid : sourceNode === null || sourceNode === void 0 ? void 0 : sourceNode.id) !== null && _ref !== void 0 ? _ref : undefined;

    if (!uuid) {
      return prev;
    }

    const isOnline = !(0, _lodash.isUndefined)(clusterState !== null && clusterState !== void 0 && clusterState.nodes ? clusterState.nodes[uuid] : undefined);
    return { ...prev,
      [uuid]: {
        name: sourceNode === null || sourceNode === void 0 ? void 0 : sourceNode.name,
        transport_address: (_node$_source$service = (_node$_source$service2 = node._source.service) === null || _node$_source$service2 === void 0 ? void 0 : _node$_source$service2.address) !== null && _node$_source$service !== void 0 ? _node$_source$service : sourceNode === null || sourceNode === void 0 ? void 0 : sourceNode.transport_address,
        type: nodeType,
        isOnline,
        nodeTypeLabel,
        nodeTypeClass,
        shardCount: (_nodesShardCount$node = nodesShardCount === null || nodesShardCount === void 0 ? void 0 : (_nodesShardCount$node2 = nodesShardCount.nodes[uuid]) === null || _nodesShardCount$node2 === void 0 ? void 0 : _nodesShardCount$node2.shardCount) !== null && _nodesShardCount$node !== void 0 ? _nodesShardCount$node : 0
      }
    };
  }, {});
}