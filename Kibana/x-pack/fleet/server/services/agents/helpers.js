"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.agentSOAttributesToFleetServerAgentDoc = agentSOAttributesToFleetServerAgentDoc;
exports.searchHitToAgent = searchHitToAgent;

var _agent_status = require("../../../common/services/agent_status");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function searchHitToAgent(hit) {
  var _hit$_source, _hit$_source$packages, _hit$_source2; // @ts-expect-error @elastic/elasticsearch MultiGetHit._source is optional


  const agent = {
    id: hit._id,
    ...hit._source,
    policy_revision: (_hit$_source = hit._source) === null || _hit$_source === void 0 ? void 0 : _hit$_source.policy_revision_idx,
    access_api_key: undefined,
    status: undefined,
    packages: (_hit$_source$packages = (_hit$_source2 = hit._source) === null || _hit$_source2 === void 0 ? void 0 : _hit$_source2.packages) !== null && _hit$_source$packages !== void 0 ? _hit$_source$packages : []
  };
  agent.status = (0, _agent_status.getAgentStatus)(agent);
  return agent;
}

function agentSOAttributesToFleetServerAgentDoc(data) {
  const {
    policy_revision: policyRevison,
    ...rest
  } = data;
  const doc = { ...rest
  };

  if (policyRevison !== undefined) {
    doc.policy_revision_idx = policyRevison;
  }

  if (!doc.updated_at) {
    doc.updated_at = new Date().toISOString();
  }

  return doc;
}