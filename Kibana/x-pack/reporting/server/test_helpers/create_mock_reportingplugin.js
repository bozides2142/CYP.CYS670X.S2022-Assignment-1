"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMockReportingCore = exports.createMockPluginStart = exports.createMockPluginSetup = exports.createMockConfigSchema = exports.createMockConfig = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _rxjs = require("rxjs");

var _mocks = require("src/core/server/mocks");

var _mocks2 = require("src/plugins/data/server/mocks");

var _common = require("src/plugins/field_formats/common");

var _mocks3 = require("src/plugins/field_formats/common/mocks");

var _2 = require("../");

var _mocks4 = require("../../../features/server/mocks");

var _mocks5 = require("../../../licensing/server/mocks");

var _mock = require("../../../screenshotting/server/mock");

var _mocks6 = require("../../../security/server/mocks");

var _mocks7 = require("../../../task_manager/server/mocks");

var _config = require("../config");

var _lib = require("../lib");

var _services = require("../services");

var _create_mock_levellogger = require("./create_mock_levellogger");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


jest.mock('../routes');
jest.mock('../usage');

const createMockPluginSetup = setupMock => {
  return {
    features: _mocks4.featuresPluginMock.createSetup(),
    basePath: {
      set: jest.fn()
    },
    router: {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn()
    },
    security: _mocks6.securityMock.createSetup(),
    taskManager: _mocks7.taskManagerMock.createSetup(),
    logger: (0, _create_mock_levellogger.createMockLevelLogger)(),
    status: _mocks.statusServiceMock.createSetupContract(),
    ...setupMock
  };
};

exports.createMockPluginSetup = createMockPluginSetup;
const logger = (0, _create_mock_levellogger.createMockLevelLogger)();

const createMockReportingStore = async config => {
  const mockConfigSchema = createMockConfigSchema(config);

  const mockContext = _mocks.coreMock.createPluginInitializerContext(mockConfigSchema);

  const mockCore = new _2.ReportingCore(logger, mockContext);
  mockCore.setConfig(await (0, _config.buildConfig)(mockContext, _mocks.coreMock.createSetup(), logger));
  return new _lib.ReportingStore(mockCore, logger);
};

const createMockPluginStart = async (startMock, config) => {
  return {
    esClient: _mocks.elasticsearchServiceMock.createClusterClient(),
    savedObjects: {
      getScopedClient: jest.fn()
    },
    uiSettings: {
      asScopedToClient: () => ({
        get: jest.fn()
      })
    },
    data: _mocks2.dataPluginMock.createStartContract(),
    fieldFormats: () => Promise.resolve(_mocks3.fieldFormatsMock),
    store: await createMockReportingStore(config),
    taskManager: {
      schedule: jest.fn().mockImplementation(() => ({
        id: 'taskId'
      })),
      ensureScheduled: jest.fn()
    },
    licensing: { ..._mocks5.licensingMock.createStart(),
      license$: new _rxjs.BehaviorSubject({
        isAvailable: true,
        isActive: true,
        type: 'basic'
      })
    },
    logger,
    screenshotting: (0, _mock.createMockScreenshottingStart)(),
    ...startMock
  };
};

exports.createMockPluginStart = createMockPluginStart;

const createMockConfigSchema = (overrides = {}) => {
  // deeply merge the defaults and the provided partial schema
  return {
    index: '.reporting',
    encryptionKey: 'cool-encryption-key-where-did-you-find-it',
    ...overrides,
    kibanaServer: {
      hostname: 'localhost',
      port: 80,
      ...overrides.kibanaServer
    },
    queue: {
      indexInterval: 'week',
      pollEnabled: true,
      pollInterval: 3000,
      timeout: 120000,
      ...overrides.queue
    },
    csv: { ...overrides.csv
    },
    roles: {
      enabled: false,
      ...overrides.roles
    }
  };
};

exports.createMockConfigSchema = createMockConfigSchema;

const createMockConfig = reportingConfig => {
  const mockConfigGet = jest.fn().mockImplementation((...keys) => {
    return _lodash.default.get(reportingConfig, keys.join('.'));
  });
  return {
    get: mockConfigGet,
    kbnConfig: {
      get: mockConfigGet
    }
  };
};

exports.createMockConfig = createMockConfig;

const createMockReportingCore = async (config, setupDepsMock = undefined, startDepsMock = undefined) => {
  if (!setupDepsMock) {
    setupDepsMock = createMockPluginSetup({});
  }

  const context = _mocks.coreMock.createPluginInitializerContext(createMockConfigSchema());

  context.config = {
    get: () => config
  };
  const core = new _2.ReportingCore(logger, context);
  core.setConfig(createMockConfig(config));
  core.pluginSetup(setupDepsMock);
  await core.pluginSetsUp();

  if (!startDepsMock) {
    startDepsMock = await createMockPluginStart(context, config);
  }

  await core.pluginStart(startDepsMock);
  await core.pluginStartsUp();
  (0, _services.setFieldFormats)({
    fieldFormatServiceFactory() {
      const fieldFormatsRegistry = new _common.FieldFormatsRegistry();
      return Promise.resolve(fieldFormatsRegistry);
    }

  });
  return core;
};

exports.createMockReportingCore = createMockReportingCore;