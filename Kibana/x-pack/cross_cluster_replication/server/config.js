"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = void 0;

var _semver = require("semver");

var _i18n = require("@kbn/i18n");

var _lodash = require("lodash");

var _configSchema = require("@kbn/config-schema");

var _constants = require("../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const kibanaVersion = new _semver.SemVer(_constants.MAJOR_VERSION); // -------------------------------
// >= 8.x
// -------------------------------

const schemaLatest = _configSchema.schema.object({
  ui: _configSchema.schema.object({
    enabled: _configSchema.schema.boolean({
      defaultValue: true
    })
  })
}, {
  defaultValue: undefined
});

const configLatest = {
  exposeToBrowser: {
    ui: true
  },
  schema: schemaLatest,
  deprecations: () => []
}; // -------------------------------
// 7.x
// -------------------------------

const schema7x = _configSchema.schema.object({
  enabled: _configSchema.schema.boolean({
    defaultValue: true
  }),
  ui: _configSchema.schema.object({
    enabled: _configSchema.schema.boolean({
      defaultValue: true
    })
  })
}, {
  defaultValue: undefined
});

const config7x = {
  exposeToBrowser: {
    ui: true
  },
  schema: schema7x,
  deprecations: () => [(completeConfig, rootPath, addDeprecation) => {
    if ((0, _lodash.get)(completeConfig, 'xpack.ccr.enabled') === undefined) {
      return completeConfig;
    }

    addDeprecation({
      configPath: 'xpack.ccr.enabled',
      level: 'critical',
      title: _i18n.i18n.translate('xpack.crossClusterReplication.deprecations.enabledTitle', {
        defaultMessage: 'Setting "xpack.ccr.enabled" is deprecated'
      }),
      message: _i18n.i18n.translate('xpack.crossClusterReplication.deprecations.enabledMessage', {
        defaultMessage: 'To disallow users from accessing the Cross-Cluster Replication UI, use the "xpack.ccr.ui.enabled" setting instead of "xpack.ccr.enabled".'
      }),
      correctiveActions: {
        manualSteps: [_i18n.i18n.translate('xpack.crossClusterReplication.deprecations.enabled.manualStepOneMessage', {
          defaultMessage: 'Open the kibana.yml config file.'
        }), _i18n.i18n.translate('xpack.crossClusterReplication.deprecations.enabled.manualStepTwoMessage', {
          defaultMessage: 'Change the "xpack.ccr.enabled" setting to "xpack.ccr.ui.enabled".'
        })]
      }
    });
    return completeConfig;
  }]
};
const config = kibanaVersion.major < 8 ? config7x : configLatest;
exports.config = config;