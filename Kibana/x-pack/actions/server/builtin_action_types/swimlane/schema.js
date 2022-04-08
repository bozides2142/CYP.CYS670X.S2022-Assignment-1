"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SwimlaneServiceConfigurationSchema = exports.SwimlaneServiceConfiguration = exports.SwimlaneSecretsConfigurationSchema = exports.SwimlaneSecretsConfiguration = exports.ExecutorSubActionPushParamsSchema = exports.ExecutorParamsSchema = exports.ConfigMappingSchema = exports.ConfigMapping = exports.ConfigMapSchema = exports.ConfigMap = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ConfigMap = {
  id: _configSchema.schema.string(),
  key: _configSchema.schema.string(),
  name: _configSchema.schema.string(),
  fieldType: _configSchema.schema.string()
};
exports.ConfigMap = ConfigMap;

const ConfigMapSchema = _configSchema.schema.object(ConfigMap);

exports.ConfigMapSchema = ConfigMapSchema;
const ConfigMapping = {
  ruleNameConfig: _configSchema.schema.nullable(ConfigMapSchema),
  alertIdConfig: _configSchema.schema.nullable(ConfigMapSchema),
  caseIdConfig: _configSchema.schema.nullable(ConfigMapSchema),
  caseNameConfig: _configSchema.schema.nullable(ConfigMapSchema),
  commentsConfig: _configSchema.schema.nullable(ConfigMapSchema),
  severityConfig: _configSchema.schema.nullable(ConfigMapSchema),
  descriptionConfig: _configSchema.schema.nullable(ConfigMapSchema)
};
exports.ConfigMapping = ConfigMapping;

const ConfigMappingSchema = _configSchema.schema.object(ConfigMapping);

exports.ConfigMappingSchema = ConfigMappingSchema;
const SwimlaneServiceConfiguration = {
  apiUrl: _configSchema.schema.string(),
  appId: _configSchema.schema.string(),
  connectorType: _configSchema.schema.oneOf([_configSchema.schema.literal('all'), _configSchema.schema.literal('alerts'), _configSchema.schema.literal('cases')]),
  mappings: ConfigMappingSchema
};
exports.SwimlaneServiceConfiguration = SwimlaneServiceConfiguration;

const SwimlaneServiceConfigurationSchema = _configSchema.schema.object(SwimlaneServiceConfiguration);

exports.SwimlaneServiceConfigurationSchema = SwimlaneServiceConfigurationSchema;
const SwimlaneSecretsConfiguration = {
  apiToken: _configSchema.schema.string()
};
exports.SwimlaneSecretsConfiguration = SwimlaneSecretsConfiguration;

const SwimlaneSecretsConfigurationSchema = _configSchema.schema.object(SwimlaneSecretsConfiguration);

exports.SwimlaneSecretsConfigurationSchema = SwimlaneSecretsConfigurationSchema;
const SwimlaneFields = {
  alertId: _configSchema.schema.nullable(_configSchema.schema.string()),
  ruleName: _configSchema.schema.nullable(_configSchema.schema.string()),
  caseId: _configSchema.schema.nullable(_configSchema.schema.string()),
  caseName: _configSchema.schema.nullable(_configSchema.schema.string()),
  severity: _configSchema.schema.nullable(_configSchema.schema.string()),
  description: _configSchema.schema.nullable(_configSchema.schema.string())
};

const ExecutorSubActionPushParamsSchema = _configSchema.schema.object({
  incident: _configSchema.schema.object({ ...SwimlaneFields,
    externalId: _configSchema.schema.nullable(_configSchema.schema.string())
  }),
  comments: _configSchema.schema.nullable(_configSchema.schema.arrayOf(_configSchema.schema.object({
    comment: _configSchema.schema.string(),
    commentId: _configSchema.schema.string()
  })))
});

exports.ExecutorSubActionPushParamsSchema = ExecutorSubActionPushParamsSchema;

const ExecutorParamsSchema = _configSchema.schema.oneOf([_configSchema.schema.object({
  subAction: _configSchema.schema.literal('pushToService'),
  subActionParams: ExecutorSubActionPushParamsSchema
})]);

exports.ExecutorParamsSchema = ExecutorParamsSchema;