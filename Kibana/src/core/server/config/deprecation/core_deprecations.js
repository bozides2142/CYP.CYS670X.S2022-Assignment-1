"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.coreDeprecationProvider = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const rewriteBasePathDeprecation = (settings, fromPath, addDeprecation) => {
  var _settings$server, _settings$server2;

  if ((_settings$server = settings.server) !== null && _settings$server !== void 0 && _settings$server.basePath && !((_settings$server2 = settings.server) !== null && _settings$server2 !== void 0 && _settings$server2.rewriteBasePath)) {
    addDeprecation({
      configPath: 'server.basePath',
      title: 'Setting "server.rewriteBasePath" should be set when using "server.basePath"',
      message: 'You should set server.basePath along with server.rewriteBasePath. Starting in 7.0, Kibana ' + 'will expect that all requests start with server.basePath rather than expecting you to rewrite ' + 'the requests in your reverse proxy. Set server.rewriteBasePath to false to preserve the ' + 'current behavior and silence this warning.',
      level: 'warning',
      correctiveActions: {
        manualSteps: [`Set 'server.rewriteBasePath' in the config file, CLI flag, or environment variable (in Docker only).`, `Set to false to preserve the current behavior and silence this warning.`]
      }
    });
  }
};

const rewriteCorsSettings = (settings, fromPath, addDeprecation) => {
  var _settings$server3;

  const corsSettings = (_settings$server3 = settings.server) === null || _settings$server3 === void 0 ? void 0 : _settings$server3.cors;

  if (typeof corsSettings === 'boolean') {
    addDeprecation({
      configPath: 'server.cors',
      title: 'Setting "server.cors" is deprecated',
      message: '"server.cors" is deprecated and has been replaced by "server.cors.enabled"',
      level: 'warning',
      correctiveActions: {
        manualSteps: [`Replace "server.cors: ${corsSettings}" with "server.cors.enabled: ${corsSettings}"`]
      }
    });
    return {
      set: [{
        path: 'server.cors',
        value: {
          enabled: corsSettings
        }
      }]
    };
  }
};

const coreDeprecationProvider = () => [rewriteCorsSettings, rewriteBasePathDeprecation];

exports.coreDeprecationProvider = coreDeprecationProvider;