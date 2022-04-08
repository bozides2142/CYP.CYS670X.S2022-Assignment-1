"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createHttpServer = exports.createCoreContext = void 0;

var _rxjs = require("rxjs");

var _moment = _interopRequireDefault(require("moment"));

var _utils = require("@kbn/utils");

var _configSchema = require("@kbn/config-schema");

var _config = require("../config");

var _http_service = require("./http_service");

var _mocks = require("../config/mocks");

var _logging_system = require("../logging/logging_system.mock");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const coreId = Symbol('core');

const env = _config.Env.createDefault(_utils.REPO_ROOT, (0, _mocks.getEnvOptions)());

const logger = _logging_system.loggingSystemMock.create();

const configService = _mocks.configServiceMock.create();

configService.atPath.mockImplementation(path => {
  if (path === 'server') {
    return new _rxjs.BehaviorSubject({
      hosts: ['localhost'],
      maxPayload: new _configSchema.ByteSizeValue(1024),
      autoListen: true,
      ssl: {
        enabled: false
      },
      cors: {
        enabled: false
      },
      compression: {
        enabled: true
      },
      xsrf: {
        disableProtection: true,
        allowlist: []
      },
      securityResponseHeaders: {},
      customResponseHeaders: {},
      requestId: {
        allowFromAnyIp: true,
        ipAllowlist: []
      },
      shutdownTimeout: _moment.default.duration(30, 'seconds'),
      keepaliveTimeout: 120_000,
      socketTimeout: 120_000
    });
  }

  if (path === 'externalUrl') {
    return new _rxjs.BehaviorSubject({
      policy: []
    });
  }

  if (path === 'csp') {
    return new _rxjs.BehaviorSubject({
      strict: false,
      disableEmbedding: false,
      warnLegacyBrowsers: true
    });
  }

  throw new Error(`Unexpected config path: ${path}`);
});
const defaultContext = {
  coreId,
  env,
  logger,
  configService
};

const createCoreContext = (overrides = {}) => ({ ...defaultContext,
  ...overrides
});
/**
 * Creates a concrete HttpServer with a mocked context.
 */


exports.createCoreContext = createCoreContext;

const createHttpServer = (overrides = {}) => {
  return new _http_service.HttpService(createCoreContext(overrides));
};

exports.createHttpServer = createHttpServer;