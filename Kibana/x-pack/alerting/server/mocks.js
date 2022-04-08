"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.alertsMock = void 0;
Object.defineProperty(exports, "rulesClientMock", {
  enumerable: true,
  get: function () {
    return _rules_client.rulesClientMock;
  }
});

var _rules_client = require("./rules_client.mock");

var _mocks = require("../../../../src/core/server/mocks");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createSetupMock = () => {
  const mock = {
    registerType: jest.fn(),
    getSecurityHealth: jest.fn()
  };
  return mock;
};

const createStartMock = () => {
  const mock = {
    listTypes: jest.fn(),
    getAlertingAuthorizationWithRequest: jest.fn(),
    getRulesClientWithRequest: jest.fn().mockResolvedValue(_rules_client.rulesClientMock.create()),
    getFrameworkHealth: jest.fn()
  };
  return mock;
};

const createAlertInstanceFactoryMock = () => {
  const mock = {
    hasScheduledActions: jest.fn(),
    isThrottled: jest.fn(),
    getScheduledActionOptions: jest.fn(),
    unscheduleActions: jest.fn(),
    getState: jest.fn(),
    scheduleActions: jest.fn(),
    replaceState: jest.fn(),
    updateLastScheduledActions: jest.fn(),
    toJSON: jest.fn(),
    toRaw: jest.fn()
  }; // support chaining

  mock.replaceState.mockReturnValue(mock);
  mock.unscheduleActions.mockReturnValue(mock);
  mock.scheduleActions.mockReturnValue(mock);
  return mock;
};

const createAbortableSearchClientMock = () => {
  const mock = {
    search: jest.fn()
  };
  return mock;
};

const createAbortableSearchServiceMock = () => {
  return {
    asInternalUser: createAbortableSearchClientMock(),
    asCurrentUser: createAbortableSearchClientMock()
  };
};

const createAlertServicesMock = () => {
  const alertInstanceFactoryMock = createAlertInstanceFactoryMock();
  return {
    alertInstanceFactory: jest.fn().mockReturnValue(alertInstanceFactoryMock),
    savedObjectsClient: _mocks.savedObjectsClientMock.create(),
    scopedClusterClient: _mocks.elasticsearchServiceMock.createScopedClusterClient(),
    shouldWriteAlerts: () => true,
    shouldStopExecution: () => true,
    search: createAbortableSearchServiceMock()
  };
};

const alertsMock = {
  createAlertInstanceFactory: createAlertInstanceFactoryMock,
  createSetup: createSetupMock,
  createStart: createStartMock,
  createAlertServices: createAlertServicesMock
};
exports.alertsMock = alertsMock;