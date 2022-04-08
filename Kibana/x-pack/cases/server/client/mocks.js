"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCasesClientMock = exports.createCasesClientFactory = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createCasesSubClientMock = () => {
  return {
    create: jest.fn(),
    find: jest.fn(),
    resolve: jest.fn(),
    get: jest.fn(),
    push: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getTags: jest.fn(),
    getReporters: jest.fn(),
    getCasesByAlertID: jest.fn()
  };
};

const createMetricsSubClientMock = () => {
  return {
    getCaseMetrics: jest.fn()
  };
};

const createAttachmentsSubClientMock = () => {
  return {
    add: jest.fn(),
    deleteAll: jest.fn(),
    delete: jest.fn(),
    find: jest.fn(),
    getAll: jest.fn(),
    get: jest.fn(),
    update: jest.fn(),
    getAllAlertsAttachToCase: jest.fn()
  };
};

const createUserActionsSubClientMock = () => {
  return {
    getAll: jest.fn()
  };
};

const createConfigureSubClientMock = () => {
  return {
    get: jest.fn(),
    getConnectors: jest.fn(),
    update: jest.fn(),
    create: jest.fn()
  };
};

const createStatsSubClientMock = () => {
  return {
    getStatusTotalsByType: jest.fn()
  };
};

const createCasesClientMock = () => {
  const client = {
    cases: createCasesSubClientMock(),
    attachments: createAttachmentsSubClientMock(),
    userActions: createUserActionsSubClientMock(),
    configure: createConfigureSubClientMock(),
    stats: createStatsSubClientMock(),
    metrics: createMetricsSubClientMock()
  };
  return client;
};

exports.createCasesClientMock = createCasesClientMock;

const createCasesClientFactory = () => {
  const factory = {
    initialize: jest.fn(),
    create: jest.fn()
  };
  return factory;
};

exports.createCasesClientFactory = createCasesClientFactory;