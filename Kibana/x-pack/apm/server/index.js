"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "APMPlugin", {
  enumerable: true,
  get: function () {
    return _plugin.APMPlugin;
  }
});
Object.defineProperty(exports, "APM_SERVER_FEATURE_ID", {
  enumerable: true,
  get: function () {
    return _alert_types.APM_SERVER_FEATURE_ID;
  }
});
exports.plugin = exports.config = void 0;

var _configSchema = require("@kbn/config-schema");

var _common = require("../../observability/common");

var _aggregated_transactions = require("../common/aggregated_transactions");

var _plugin = require("./plugin");

var _alert_types = require("../common/alert_types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// All options should be documented in the APM configuration settings: https://github.com/elastic/kibana/blob/main/docs/settings/apm-settings.asciidoc
// and be included on cloud allow list unless there are specific reasons not to


const configSchema = _configSchema.schema.object({
  autoCreateApmDataView: _configSchema.schema.boolean({
    defaultValue: true
  }),
  serviceMapEnabled: _configSchema.schema.boolean({
    defaultValue: true
  }),
  serviceMapFingerprintBucketSize: _configSchema.schema.number({
    defaultValue: 100
  }),
  serviceMapTraceIdBucketSize: _configSchema.schema.number({
    defaultValue: 65
  }),
  serviceMapFingerprintGlobalBucketSize: _configSchema.schema.number({
    defaultValue: 1000
  }),
  serviceMapTraceIdGlobalBucketSize: _configSchema.schema.number({
    defaultValue: 6
  }),
  serviceMapMaxTracesPerRequest: _configSchema.schema.number({
    defaultValue: 50
  }),
  ui: _configSchema.schema.object({
    enabled: _configSchema.schema.boolean({
      defaultValue: true
    }),
    transactionGroupBucketSize: _configSchema.schema.number({
      defaultValue: 1000
    }),
    maxTraceItems: _configSchema.schema.number({
      defaultValue: 1000
    })
  }),
  searchAggregatedTransactions: _configSchema.schema.oneOf([_configSchema.schema.literal(_aggregated_transactions.SearchAggregatedTransactionSetting.auto), _configSchema.schema.literal(_aggregated_transactions.SearchAggregatedTransactionSetting.always), _configSchema.schema.literal(_aggregated_transactions.SearchAggregatedTransactionSetting.never)], {
    defaultValue: _aggregated_transactions.SearchAggregatedTransactionSetting.auto
  }),
  telemetryCollectionEnabled: _configSchema.schema.boolean({
    defaultValue: true
  }),
  metricsInterval: _configSchema.schema.number({
    defaultValue: 30
  }),
  profilingEnabled: _configSchema.schema.boolean({
    defaultValue: false
  }),
  agent: _configSchema.schema.object({
    migrations: _configSchema.schema.object({
      enabled: _configSchema.schema.boolean({
        defaultValue: false
      })
    })
  }),
  indices: _configSchema.schema.object({
    transaction: _configSchema.schema.string({
      defaultValue: 'traces-apm*,apm-*'
    }),
    span: _configSchema.schema.string({
      defaultValue: 'traces-apm*,apm-*'
    }),
    error: _configSchema.schema.string({
      defaultValue: 'logs-apm*,apm-*'
    }),
    metric: _configSchema.schema.string({
      defaultValue: 'metrics-apm*,apm-*'
    }),
    sourcemap: _configSchema.schema.string({
      defaultValue: 'apm-*'
    }),
    onboarding: _configSchema.schema.string({
      defaultValue: 'apm-*'
    })
  })
}); // plugin config


const config = {
  deprecations: ({
    rename,
    renameFromRoot,
    deprecateFromRoot,
    unusedFromRoot
  }) => [rename('autocreateApmIndexPattern', 'autoCreateApmDataView', {
    level: 'warning'
  }), renameFromRoot('apm_oss.transactionIndices', 'xpack.apm.indices.transaction', {
    level: 'warning'
  }), renameFromRoot('apm_oss.spanIndices', 'xpack.apm.indices.span', {
    level: 'warning'
  }), renameFromRoot('apm_oss.errorIndices', 'xpack.apm.indices.error', {
    level: 'warning'
  }), renameFromRoot('apm_oss.metricsIndices', 'xpack.apm.indices.metric', {
    level: 'warning'
  }), renameFromRoot('apm_oss.sourcemapIndices', 'xpack.apm.indices.sourcemap', {
    level: 'warning'
  }), renameFromRoot('apm_oss.onboardingIndices', 'xpack.apm.indices.onboarding', {
    level: 'warning'
  }), deprecateFromRoot('apm_oss.enabled', '8.0.0', {
    level: 'warning'
  }), unusedFromRoot('apm_oss.fleetMode', {
    level: 'warning'
  }), unusedFromRoot('apm_oss.indexPattern', {
    level: 'warning'
  }), renameFromRoot('xpack.apm.maxServiceEnvironments', `uiSettings.overrides[${_common.maxSuggestions}]`, {
    level: 'warning'
  }), renameFromRoot('xpack.apm.maxServiceSelections', `uiSettings.overrides[${_common.maxSuggestions}]`, {
    level: 'warning'
  })],
  exposeToBrowser: {
    serviceMapEnabled: true,
    ui: true,
    profilingEnabled: true
  },
  schema: configSchema
};
exports.config = config;

const plugin = initContext => new _plugin.APMPlugin(initContext);

exports.plugin = plugin;