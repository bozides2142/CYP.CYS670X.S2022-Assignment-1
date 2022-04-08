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
  }),
  // Cloud requires the ability to hide internal node attributes from users.
  filteredNodeAttributes: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
    defaultValue: []
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
  }),
  // Cloud requires the ability to hide internal node attributes from users.
  filteredNodeAttributes: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
    defaultValue: []
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
    if ((0, _lodash.get)(completeConfig, 'xpack.ilm.enabled') === undefined) {
      return completeConfig;
    }

    addDeprecation({
      configPath: 'xpack.ilm.enabled',
      level: 'critical',
      title: _i18n.i18n.translate('xpack.indexLifecycleMgmt.deprecations.enabledTitle', {
        defaultMessage: 'Setting "xpack.ilm.enabled" is deprecated'
      }),
      message: _i18n.i18n.translate('xpack.indexLifecycleMgmt.deprecations.enabledMessage', {
        defaultMessage: 'To disallow users from accessing the Index Lifecycle Policies UI, use the "xpack.ilm.ui.enabled" setting instead of "xpack.ilm.enabled".'
      }),
      correctiveActions: {
        manualSteps: [_i18n.i18n.translate('xpack.indexLifecycleMgmt.deprecations.enabled.manualStepOneMessage', {
          defaultMessage: 'Open the kibana.yml config file.'
        }), _i18n.i18n.translate('xpack.indexLifecycleMgmt.deprecations.enabled.manualStepTwoMessage', {
          defaultMessage: 'Change the "xpack.ilm.enabled" setting to "xpack.ilm.ui.enabled".'
        })]
      }
    });
    return completeConfig;
  }]
};
const config = kibanaVersion.major < 8 ? config7x : configLatest;
exports.config = config;