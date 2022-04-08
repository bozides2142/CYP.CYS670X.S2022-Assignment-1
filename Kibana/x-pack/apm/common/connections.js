"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NodeType = void 0;
exports.getNodeName = getNodeName;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

let NodeType;
exports.NodeType = NodeType;

(function (NodeType) {
  NodeType["service"] = "service";
  NodeType["backend"] = "backend";
})(NodeType || (exports.NodeType = NodeType = {}));

function getNodeName(node) {
  return node.type === NodeType.service ? node.serviceName : node.backendName;
}