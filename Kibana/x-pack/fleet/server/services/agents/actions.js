"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bulkCreateAgentActions = bulkCreateAgentActions;
exports.createAgentAction = createAgentAction;

var _uuid = _interopRequireDefault(require("uuid"));

var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ONE_MONTH_IN_MS = 2592000000;

async function createAgentAction(esClient, newAgentAction) {
  const id = _uuid.default.v4();

  const body = {
    '@timestamp': new Date().toISOString(),
    expiration: new Date(Date.now() + ONE_MONTH_IN_MS).toISOString(),
    agents: [newAgentAction.agent_id],
    action_id: id,
    data: newAgentAction.data,
    type: newAgentAction.type
  };
  await esClient.create({
    index: _constants.AGENT_ACTIONS_INDEX,
    id,
    body,
    refresh: 'wait_for'
  });
  return {
    id,
    ...newAgentAction
  };
}

async function bulkCreateAgentActions(esClient, newAgentActions) {
  const actions = newAgentActions.map(newAgentAction => {
    const id = _uuid.default.v4();

    return {
      id,
      ...newAgentAction
    };
  });

  if (actions.length === 0) {
    return actions;
  }

  await esClient.bulk({
    index: _constants.AGENT_ACTIONS_INDEX,
    body: actions.flatMap(action => {
      const body = {
        '@timestamp': new Date().toISOString(),
        expiration: new Date(Date.now() + ONE_MONTH_IN_MS).toISOString(),
        agents: [action.agent_id],
        action_id: action.id,
        data: action.data,
        type: action.type
      };
      return [{
        create: {
          _id: action.id
        }
      }, body];
    })
  });
  return actions;
}