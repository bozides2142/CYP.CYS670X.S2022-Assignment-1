"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "AgentNotFoundError", {
  enumerable: true,
  get: function () {
    return _errors.AgentNotFoundError;
  }
});
Object.defineProperty(exports, "FleetUnauthorizedError", {
  enumerable: true,
  get: function () {
    return _errors.FleetUnauthorizedError;
  }
});
exports.config = void 0;
Object.defineProperty(exports, "getRegistryUrl", {
  enumerable: true,
  get: function () {
    return _services.getRegistryUrl;
  }
});
exports.plugin = void 0;
Object.defineProperty(exports, "relativeDownloadUrlFromArtifact", {
  enumerable: true,
  get: function () {
    return _mappings.relativeDownloadUrlFromArtifact;
  }
});

var _configSchema = require("@kbn/config-schema");

var _types = require("./types");

var _plugin = require("./plugin");

var _services = require("./services");

var _errors = require("./errors");

var _mappings = require("./services/artifacts/mappings");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const config = {
  exposeToBrowser: {
    epm: true,
    agents: true
  },
  deprecations: ({
    renameFromRoot,
    unused,
    unusedFromRoot
  }) => [// Unused settings before Fleet server exists
  unused('agents.kibana', {
    level: 'critical'
  }), unused('agents.maxConcurrentConnections', {
    level: 'critical'
  }), unused('agents.agentPolicyRolloutRateLimitIntervalMs', {
    level: 'critical'
  }), unused('agents.agentPolicyRolloutRateLimitRequestPerInterval', {
    level: 'critical'
  }), unused('agents.pollingRequestTimeout', {
    level: 'critical'
  }), unused('agents.tlsCheckDisabled', {
    level: 'critical'
  }), unused('agents.fleetServerEnabled', {
    level: 'critical'
  }), // Deprecate default policy flags
  (fullConfig, fromPath, addDeprecation) => {
    var _fullConfig$xpack, _fullConfig$xpack$fle;

    if (((fullConfig === null || fullConfig === void 0 ? void 0 : (_fullConfig$xpack = fullConfig.xpack) === null || _fullConfig$xpack === void 0 ? void 0 : (_fullConfig$xpack$fle = _fullConfig$xpack.fleet) === null || _fullConfig$xpack$fle === void 0 ? void 0 : _fullConfig$xpack$fle.agentPolicies) || []).find(policy => policy.is_default)) {
      addDeprecation({
        configPath: 'xpack.fleet.agentPolicies.is_default',
        message: `Config key [xpack.fleet.agentPolicies.is_default] is deprecated.`,
        correctiveActions: {
          manualSteps: [`Create a dedicated policy instead through the UI or API.`]
        },
        level: 'warning'
      });
    }

    return fullConfig;
  }, (fullConfig, fromPath, addDeprecation) => {
    var _fullConfig$xpack2, _fullConfig$xpack2$fl;

    if (((fullConfig === null || fullConfig === void 0 ? void 0 : (_fullConfig$xpack2 = fullConfig.xpack) === null || _fullConfig$xpack2 === void 0 ? void 0 : (_fullConfig$xpack2$fl = _fullConfig$xpack2.fleet) === null || _fullConfig$xpack2$fl === void 0 ? void 0 : _fullConfig$xpack2$fl.agentPolicies) || []).find(policy => policy.is_default_fleet_server)) {
      addDeprecation({
        configPath: 'xpack.fleet.agentPolicies.is_default_fleet_server',
        message: `Config key [xpack.fleet.agentPolicies.is_default_fleet_server] is deprecated.`,
        correctiveActions: {
          manualSteps: [`Create a dedicated fleet server policy instead through the UI or API.`]
        },
        level: 'warning'
      });
    }

    return fullConfig;
  }, // Renaming elasticsearch.host => elasticsearch.hosts
  (fullConfig, fromPath, addDeprecation) => {
    var _fullConfig$xpack3, _fullConfig$xpack3$fl, _fullConfig$xpack3$fl2, _fullConfig$xpack3$fl3;

    const oldValue = fullConfig === null || fullConfig === void 0 ? void 0 : (_fullConfig$xpack3 = fullConfig.xpack) === null || _fullConfig$xpack3 === void 0 ? void 0 : (_fullConfig$xpack3$fl = _fullConfig$xpack3.fleet) === null || _fullConfig$xpack3$fl === void 0 ? void 0 : (_fullConfig$xpack3$fl2 = _fullConfig$xpack3$fl.agents) === null || _fullConfig$xpack3$fl2 === void 0 ? void 0 : (_fullConfig$xpack3$fl3 = _fullConfig$xpack3$fl2.elasticsearch) === null || _fullConfig$xpack3$fl3 === void 0 ? void 0 : _fullConfig$xpack3$fl3.host;

    if (oldValue) {
      delete fullConfig.xpack.fleet.agents.elasticsearch.host;
      fullConfig.xpack.fleet.agents.elasticsearch.hosts = [oldValue];
      addDeprecation({
        configPath: 'xpack.fleet.agents.elasticsearch.host',
        message: `Config key [xpack.fleet.agents.elasticsearch.host] is deprecated and replaced by [xpack.fleet.agents.elasticsearch.hosts]`,
        correctiveActions: {
          manualSteps: [`Use [xpack.fleet.agents.elasticsearch.hosts] with an array of host instead.`]
        },
        level: 'critical'
      });
    }

    return fullConfig;
  }],
  schema: _configSchema.schema.object({
    registryUrl: _configSchema.schema.maybe(_configSchema.schema.uri({
      scheme: ['http', 'https']
    })),
    registryProxyUrl: _configSchema.schema.maybe(_configSchema.schema.uri({
      scheme: ['http', 'https']
    })),
    agents: _configSchema.schema.object({
      enabled: _configSchema.schema.boolean({
        defaultValue: true
      }),
      elasticsearch: _configSchema.schema.object({
        hosts: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.uri({
          scheme: ['http', 'https']
        }))),
        ca_sha256: _configSchema.schema.maybe(_configSchema.schema.string())
      }),
      fleet_server: _configSchema.schema.maybe(_configSchema.schema.object({
        hosts: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.uri({
          scheme: ['http', 'https']
        })))
      }))
    }),
    packages: _types.PreconfiguredPackagesSchema,
    agentPolicies: _types.PreconfiguredAgentPoliciesSchema,
    outputs: _types.PreconfiguredOutputsSchema,
    agentIdVerificationEnabled: _configSchema.schema.boolean({
      defaultValue: true
    }),
    developer: _configSchema.schema.object({
      disableRegistryVersionCheck: _configSchema.schema.boolean({
        defaultValue: false
      }),
      allowAgentUpgradeSourceUri: _configSchema.schema.boolean({
        defaultValue: false
      })
    })
  })
};
exports.config = config;

const plugin = initializerContext => {
  return new _plugin.FleetPlugin(initializerContext);
};

exports.plugin = plugin;