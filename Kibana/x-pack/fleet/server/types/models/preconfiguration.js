"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PreconfiguredPackagesSchema = exports.PreconfiguredOutputsSchema = exports.PreconfiguredAgentPoliciesSchema = void 0;

var _i18n = require("@kbn/i18n");

var _configSchema = require("@kbn/config-schema");

var _valid = _interopRequireDefault(require("semver/functions/valid"));

var _constants = require("../../constants");

var _common = require("../../../common");

var _agent_policy = require("./agent_policy");

var _package_policy = require("./package_policy");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const varsSchema = _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.object({
  name: _configSchema.schema.string(),
  type: _configSchema.schema.maybe(_configSchema.schema.string()),
  value: _configSchema.schema.maybe(_configSchema.schema.any()),
  frozen: _configSchema.schema.maybe(_configSchema.schema.boolean())
})));

const PreconfiguredPackagesSchema = _configSchema.schema.arrayOf(_configSchema.schema.object({
  name: _configSchema.schema.string(),
  version: _configSchema.schema.string({
    validate: value => {
      if (value !== _constants.PRECONFIGURATION_LATEST_KEYWORD && !(0, _valid.default)(value)) {
        return _i18n.i18n.translate('xpack.fleet.config.invalidPackageVersionError', {
          defaultMessage: 'must be a valid semver, or the keyword `latest`'
        });
      }
    }
  })
}), {
  defaultValue: []
});

exports.PreconfiguredPackagesSchema = PreconfiguredPackagesSchema;

function validatePreconfiguredOutputs(outputs) {
  const acc = {
    names: new Set(),
    ids: new Set(),
    is_default_exists: false,
    is_default_monitoring_exists: false
  };

  for (const output of outputs) {
    if (acc.names.has(output.name)) {
      return 'preconfigured outputs need to have unique names.';
    }

    if (acc.ids.has(output.id)) {
      return 'preconfigured outputs need to have unique ids.';
    }

    if (acc.is_default_exists && output.is_default) {
      return 'preconfigured outputs can only have one default output.';
    }

    if (acc.is_default_monitoring_exists && output.is_default_monitoring) {
      return 'preconfigured outputs can only have one default monitoring output.';
    }

    acc.ids.add(output.id);
    acc.names.add(output.name);
    acc.is_default_exists = acc.is_default_exists || output.is_default;
    acc.is_default_monitoring_exists = acc.is_default_exists || output.is_default_monitoring;
  }
}

const PreconfiguredOutputsSchema = _configSchema.schema.arrayOf(_configSchema.schema.object({
  id: _configSchema.schema.string(),
  is_default: _configSchema.schema.boolean({
    defaultValue: false
  }),
  is_default_monitoring: _configSchema.schema.boolean({
    defaultValue: false
  }),
  name: _configSchema.schema.string(),
  type: _configSchema.schema.oneOf([_configSchema.schema.literal(_common.outputType.Elasticsearch)]),
  hosts: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.uri({
    scheme: ['http', 'https']
  }))),
  ca_sha256: _configSchema.schema.maybe(_configSchema.schema.string()),
  ca_trusted_fingerprint: _configSchema.schema.maybe(_configSchema.schema.string()),
  config: _configSchema.schema.maybe(_configSchema.schema.object({}, {
    unknowns: 'allow'
  }))
}), {
  defaultValue: [],
  validate: validatePreconfiguredOutputs
});

exports.PreconfiguredOutputsSchema = PreconfiguredOutputsSchema;

const PreconfiguredAgentPoliciesSchema = _configSchema.schema.arrayOf(_configSchema.schema.object({ ..._agent_policy.AgentPolicyBaseSchema,
  namespace: _configSchema.schema.maybe(_package_policy.NamespaceSchema),
  id: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.number()])),
  is_default: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  is_default_fleet_server: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  has_fleet_server: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  data_output_id: _configSchema.schema.maybe(_configSchema.schema.string()),
  monitoring_output_id: _configSchema.schema.maybe(_configSchema.schema.string()),
  package_policies: _configSchema.schema.arrayOf(_configSchema.schema.object({
    id: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.number()])),
    name: _configSchema.schema.string(),
    package: _configSchema.schema.object({
      name: _configSchema.schema.string()
    }),
    description: _configSchema.schema.maybe(_configSchema.schema.string()),
    namespace: _configSchema.schema.maybe(_package_policy.NamespaceSchema),
    inputs: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.object({
      type: _configSchema.schema.string(),
      enabled: _configSchema.schema.maybe(_configSchema.schema.boolean()),
      keep_enabled: _configSchema.schema.maybe(_configSchema.schema.boolean()),
      vars: varsSchema,
      streams: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.object({
        data_stream: _configSchema.schema.object({
          type: _configSchema.schema.maybe(_configSchema.schema.string()),
          dataset: _configSchema.schema.string()
        }),
        enabled: _configSchema.schema.maybe(_configSchema.schema.boolean()),
        keep_enabled: _configSchema.schema.maybe(_configSchema.schema.boolean()),
        vars: varsSchema
      })))
    })))
  }))
}), {
  defaultValue: []
});

exports.PreconfiguredAgentPoliciesSchema = PreconfiguredAgentPoliciesSchema;