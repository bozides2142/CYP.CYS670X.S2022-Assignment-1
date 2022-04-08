"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  createAppContextStartContractMock: true,
  createFleetRequestHandlerContextMock: true,
  xpackMocks: true,
  createPackagePolicyServiceMock: true,
  createMockAgentPolicyService: true,
  createMockAgentService: true,
  createMockAgentClient: true,
  createMockPackageService: true
};
exports.xpackMocks = exports.createPackagePolicyServiceMock = exports.createMockPackageService = exports.createMockAgentService = exports.createMockAgentPolicyService = exports.createMockAgentClient = exports.createFleetRequestHandlerContextMock = exports.createAppContextStartContractMock = void 0;

var _rxjs = require("rxjs");

var _mocks = require("../../../../../src/core/server/mocks");

var _mocks2 = require("../../../../../src/plugins/data/server/mocks");

var _mocks3 = require("../../../../plugins/licensing/server/mocks");

var _mocks4 = require("../../../encrypted_saved_objects/server/mocks");

var _mocks5 = require("../../../security/server/mocks");

var _mocks__ = require("../telemetry/__mocks__");

var _common = require("../../common");

var _agent_service = require("../services/agents/agent_service.mock");

var _package_service = require("../services/epm/package_service.mock");

var _mocks6 = require("../services/artifacts/mocks");

Object.keys(_mocks6).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _mocks6[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _mocks6[key];
    }
  });
});
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// Export all mocks from artifacts

const createAppContextStartContractMock = () => {
  const config = {
    agents: {
      enabled: true,
      elasticsearch: {}
    },
    enabled: true,
    agentIdVerificationEnabled: true
  };
  const config$ = (0, _rxjs.of)(config);
  return {
    elasticsearch: _mocks.elasticsearchServiceMock.createStart(),
    data: _mocks2.dataPluginMock.createStartContract(),
    encryptedSavedObjectsStart: _mocks4.encryptedSavedObjectsMock.createStart(),
    savedObjects: _mocks.savedObjectsServiceMock.createStartContract(),
    securitySetup: _mocks5.securityMock.createSetup(),
    securityStart: _mocks5.securityMock.createStart(),
    logger: _mocks.loggingSystemMock.create().get(),
    isProductionMode: true,
    configInitialValue: {
      agents: {
        enabled: true,
        elasticsearch: {}
      },
      enabled: true,
      agentIdVerificationEnabled: true
    },
    config$,
    kibanaVersion: '8.99.0',
    // Fake version :)
    kibanaBranch: 'main',
    telemetryEventsSender: (0, _mocks__.createMockTelemetryEventsSender)()
  };
};

exports.createAppContextStartContractMock = createAppContextStartContractMock;

const createFleetRequestHandlerContextMock = () => {
  return {
    authz: (0, _common.createFleetAuthzMock)(),
    agentClient: {
      asCurrentUser: _agent_service.agentServiceMock.createClient(),
      asInternalUser: _agent_service.agentServiceMock.createClient()
    },
    epm: {
      internalSoClient: _mocks.savedObjectsClientMock.create()
    },
    spaceId: 'default'
  };
};

exports.createFleetRequestHandlerContextMock = createFleetRequestHandlerContextMock;

function createCoreRequestHandlerContextMock() {
  return {
    core: _mocks.coreMock.createRequestHandlerContext(),
    licensing: _mocks3.licensingMock.createRequestHandlerContext(),
    fleet: createFleetRequestHandlerContextMock()
  };
}

const xpackMocks = {
  createRequestHandlerContext: createCoreRequestHandlerContextMock
};
exports.xpackMocks = xpackMocks;

const createPackagePolicyServiceMock = () => {
  return {
    _compilePackagePolicyInputs: jest.fn(),
    buildPackagePolicyFromPackage: jest.fn(),
    buildPackagePolicyFromPackageWithVersion: jest.fn(),
    bulkCreate: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    get: jest.fn(),
    getByIDs: jest.fn(),
    list: jest.fn(),
    listIds: jest.fn(),
    update: jest.fn(),
    runExternalCallbacks: jest.fn(),
    runDeleteExternalCallbacks: jest.fn(),
    upgrade: jest.fn(),
    getUpgradeDryRunDiff: jest.fn(),
    getUpgradePackagePolicyInfo: jest.fn(),
    enrichPolicyWithDefaultsFromPackage: jest.fn()
  };
};
/**
 * Create mock AgentPolicyService
 */


exports.createPackagePolicyServiceMock = createPackagePolicyServiceMock;

const createMockAgentPolicyService = () => {
  return {
    get: jest.fn(),
    list: jest.fn(),
    getFullAgentPolicy: jest.fn(),
    getByIds: jest.fn()
  };
};
/**
 * Creates a mock AgentService
 */


exports.createMockAgentPolicyService = createMockAgentPolicyService;

const createMockAgentService = () => _agent_service.agentServiceMock.create();
/**
 * Creates a mock AgentClient
 */


exports.createMockAgentService = createMockAgentService;

const createMockAgentClient = () => _agent_service.agentServiceMock.createClient();
/**
 * Creates a mock PackageService
 */


exports.createMockAgentClient = createMockAgentClient;

const createMockPackageService = () => _package_service.packageServiceMock.create();

exports.createMockPackageService = createMockPackageService;