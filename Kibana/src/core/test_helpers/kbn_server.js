"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRoot = createRoot;
exports.createRootWithCorePlugins = createRootWithCorePlugins;
exports.createRootWithSettings = createRootWithSettings;
exports.createTestServers = createTestServers;
exports.getSupertest = getSupertest;
exports.request = void 0;

var _devUtils = require("@kbn/dev-utils");

var _utils = require("@kbn/utils");

var _test = require("@kbn/test");

var _lodash = require("lodash");

var _rxjs = require("rxjs");

var _supertest = _interopRequireDefault(require("supertest"));

var _config = require("../server/config");

var _root = require("../server/root");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const DEFAULTS_SETTINGS = {
  server: {
    autoListen: true,
    // Use the ephemeral port to make sure that tests use the first available
    // port and aren't affected by the timing issues in test environment.
    port: 0,
    xsrf: {
      disableProtection: true
    }
  },
  logging: {
    root: {
      level: 'off'
    }
  },
  plugins: {},
  migrations: {
    skip: false
  }
};

function createRootWithSettings(settings, cliArgs = {}) {
  const env = _config.Env.createDefault(_utils.REPO_ROOT, {
    configs: [],
    cliArgs: {
      dev: false,
      watch: false,
      basePath: false,
      runExamples: false,
      oss: true,
      disableOptimizer: true,
      cache: true,
      dist: false,
      ...cliArgs
    }
  });

  return new _root.Root({
    getConfig$: () => new _rxjs.BehaviorSubject((0, _lodash.defaultsDeep)({}, settings, DEFAULTS_SETTINGS))
  }, env);
}
/**
 * Returns supertest request attached to the core's internal native Node server.
 * @param root
 * @param method
 * @param path
 */


function getSupertest(root, method, path) {
  const testUserCredentials = Buffer.from(`${_test.systemIndicesSuperuser.username}:${_test.systemIndicesSuperuser.password}`);
  return (0, _supertest.default)(root.server.http.httpServer.server.listener)[method](path).set('Authorization', `Basic ${testUserCredentials.toString('base64')}`);
}
/**
 * Creates an instance of Root with default configuration
 * tailored for unit tests.
 *
 * @param {Object} [settings={}] Any config overrides for this instance.
 * @returns {Root}
 */


function createRoot(settings = {}, cliArgs = {}) {
  return createRootWithSettings(settings, cliArgs);
}
/**
 *  Creates an instance of Root, including all of the core plugins,
 *  with default configuration tailored for unit tests.
 *
 *  @param {Object} [settings={}] Any config overrides for this instance.
 *  @returns {Root}
 */


function createRootWithCorePlugins(settings = {}, cliArgs = {}) {
  const DEFAULT_SETTINGS_WITH_CORE_PLUGINS = {
    elasticsearch: {
      hosts: [_test.esTestConfig.getUrl()],
      username: _test.kibanaServerTestUser.username,
      password: _test.kibanaServerTestUser.password
    },
    // Log ES deprecations to surface these in CI
    logging: {
      loggers: [{
        name: 'root',
        level: 'error',
        appenders: ['console']
      }, {
        name: 'elasticsearch.deprecation',
        level: 'all',
        appenders: ['deprecation']
      }],
      appenders: {
        deprecation: {
          type: 'console',
          layout: {
            type: 'json'
          }
        },
        console: {
          type: 'console',
          layout: {
            type: 'pattern'
          }
        }
      }
    },
    // createRootWithSettings sets default value to "true", so undefined should be threatened as "true".
    ...(cliArgs.oss === false ? {
      // reporting loads headless browser, that prevents nodejs process from exiting and causes test flakiness
      xpack: {
        reporting: {
          enabled: false
        }
      }
    } : {})
  };
  return createRootWithSettings((0, _lodash.defaultsDeep)({}, settings, DEFAULT_SETTINGS_WITH_CORE_PLUGINS), cliArgs);
}

const request = {
  delete: (root, path) => getSupertest(root, 'delete', path),
  get: (root, path) => getSupertest(root, 'get', path),
  head: (root, path) => getSupertest(root, 'head', path),
  post: (root, path) => getSupertest(root, 'post', path),
  put: (root, path) => getSupertest(root, 'put', path)
};
exports.request = request;

/**
 * Creates an instance of the Root, including all of the core "legacy" plugins,
 * with default configuration tailored for unit tests, and starts es.
 *
 * @param options
 * @prop settings Any config overrides for this instance.
 * @prop adjustTimeout A function(t) => this.timeout(t) that adjust the timeout of a
 * test, ensuring the test properly waits for the server to boot without timing out.
 */
function createTestServers({
  adjustTimeout,
  settings = {}
}) {
  var _settings$es$license, _settings$es, _settings$users, _settings$es2, _settings$kbn;

  if (!adjustTimeout) {
    throw new Error('adjustTimeout is required in order to avoid flaky tests');
  }

  const license = (_settings$es$license = (_settings$es = settings.es) === null || _settings$es === void 0 ? void 0 : _settings$es.license) !== null && _settings$es$license !== void 0 ? _settings$es$license : 'basic';
  const usersToBeAdded = (_settings$users = settings.users) !== null && _settings$users !== void 0 ? _settings$users : [];

  if (usersToBeAdded.length > 0) {
    if (license !== 'trial') {
      throw new Error('Adding users is only supported by createTestServers when using a trial license');
    }
  }

  const log = new _devUtils.ToolingLog({
    level: 'debug',
    writeTo: process.stdout
  });
  const es = (0, _test.createTestEsCluster)((0, _lodash.defaultsDeep)({}, (_settings$es2 = settings.es) !== null && _settings$es2 !== void 0 ? _settings$es2 : {}, {
    log,
    license
  })); // Add time for KBN and adding users

  adjustTimeout(es.getStartTimeout() + 100000);
  const kbnSettings = (_settings$kbn = settings.kbn) !== null && _settings$kbn !== void 0 ? _settings$kbn : {};
  return {
    startES: async () => {
      await es.start();

      if (['gold', 'trial'].includes(license)) {
        // Override provided configs
        kbnSettings.elasticsearch = {
          hosts: es.getHostUrls(),
          username: _test.kibanaServerTestUser.username,
          password: _test.kibanaServerTestUser.password
        };
      }

      return {
        stop: async () => await es.cleanup(),
        es,
        hosts: es.getHostUrls(),
        username: _test.kibanaServerTestUser.username,
        password: _test.kibanaServerTestUser.password
      };
    },
    startKibana: async () => {
      const root = createRootWithCorePlugins(kbnSettings);
      await root.preboot();
      const coreSetup = await root.setup();
      const coreStart = await root.start();
      return {
        root,
        coreSetup,
        coreStart,
        stop: async () => await root.shutdown()
      };
    }
  };
}