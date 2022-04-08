"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "actionsAuthorizationMock", {
  enumerable: true,
  get: function () {
    return _actions_authorization.actionsAuthorizationMock;
  }
});
Object.defineProperty(exports, "actionsClientMock", {
  enumerable: true,
  get: function () {
    return _actions_client.actionsClientMock;
  }
});
exports.actionsMock = void 0;
exports.renderActionParameterTemplatesDefault = renderActionParameterTemplatesDefault;

var _actions_client = require("./actions_client.mock");

var _plugin = require("./plugin");

var _mocks = require("../../../../src/core/server/mocks");

var _actions_authorization = require("./authorization/actions_authorization.mock");

var _mocks2 = require("../../encrypted_saved_objects/server/mocks");

var _connector_token_client = require("./builtin_action_types/lib/connector_token_client");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const logger = _mocks.loggingSystemMock.create().get();

const createSetupMock = () => {
  const mock = {
    registerType: jest.fn(),
    isPreconfiguredConnector: jest.fn()
  };
  return mock;
};

const createStartMock = () => {
  const mock = {
    isActionTypeEnabled: jest.fn(),
    isActionExecutable: jest.fn(),
    getActionsClientWithRequest: jest.fn().mockResolvedValue(_actions_client.actionsClientMock.create()),
    getActionsAuthorizationWithRequest: jest.fn().mockReturnValue(_actions_authorization.actionsAuthorizationMock.create()),
    preconfiguredActions: [],
    renderActionParameterTemplates: jest.fn()
  };
  return mock;
}; // this is a default renderer that escapes nothing


function renderActionParameterTemplatesDefault(actionTypeId, actionId, params, variables) {
  return (0, _plugin.renderActionParameterTemplates)(undefined, actionTypeId, actionId, params, variables);
}

const createServicesMock = () => {
  const mock = {
    savedObjectsClient: _mocks.savedObjectsClientMock.create(),
    scopedClusterClient: _mocks.elasticsearchServiceMock.createScopedClusterClient().asCurrentUser,
    connectorTokenClient: new _connector_token_client.ConnectorTokenClient({
      unsecuredSavedObjectsClient: _mocks.savedObjectsClientMock.create(),
      encryptedSavedObjectsClient: _mocks2.encryptedSavedObjectsMock.createClient(),
      logger
    })
  };
  return mock;
};

const actionsMock = {
  createServices: createServicesMock,
  createSetup: createSetupMock,
  createStart: createStartMock
};
exports.actionsMock = actionsMock;