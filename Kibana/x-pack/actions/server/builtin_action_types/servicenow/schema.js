"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExternalIncidentServiceSecretConfigurationSchema = exports.ExternalIncidentServiceSecretConfiguration = exports.ExternalIncidentServiceConfigurationSchema = exports.ExternalIncidentServiceConfigurationBaseSchema = exports.ExternalIncidentServiceConfigurationBase = exports.ExternalIncidentServiceConfiguration = exports.ExecutorSubActionPushParamsSchemaSIR = exports.ExecutorSubActionPushParamsSchemaITSM = exports.ExecutorSubActionHandshakeParamsSchema = exports.ExecutorSubActionGetIncidentParamsSchema = exports.ExecutorSubActionGetChoicesParamsSchema = exports.ExecutorSubActionCommonFieldsParamsSchema = exports.ExecutorSubActionAddEventParamsSchema = exports.ExecutorParamsSchemaSIR = exports.ExecutorParamsSchemaITSM = exports.ExecutorParamsSchemaITOM = void 0;

var _configSchema = require("@kbn/config-schema");

var _config = require("./config");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ExternalIncidentServiceConfigurationBase = {
  apiUrl: _configSchema.schema.string()
};
exports.ExternalIncidentServiceConfigurationBase = ExternalIncidentServiceConfigurationBase;
const ExternalIncidentServiceConfiguration = { ...ExternalIncidentServiceConfigurationBase,
  usesTableApi: _configSchema.schema.boolean({
    defaultValue: true
  })
};
exports.ExternalIncidentServiceConfiguration = ExternalIncidentServiceConfiguration;

const ExternalIncidentServiceConfigurationBaseSchema = _configSchema.schema.object(ExternalIncidentServiceConfigurationBase);

exports.ExternalIncidentServiceConfigurationBaseSchema = ExternalIncidentServiceConfigurationBaseSchema;

const ExternalIncidentServiceConfigurationSchema = _configSchema.schema.object(ExternalIncidentServiceConfiguration);

exports.ExternalIncidentServiceConfigurationSchema = ExternalIncidentServiceConfigurationSchema;
const ExternalIncidentServiceSecretConfiguration = {
  password: _configSchema.schema.string(),
  username: _configSchema.schema.string()
};
exports.ExternalIncidentServiceSecretConfiguration = ExternalIncidentServiceSecretConfiguration;

const ExternalIncidentServiceSecretConfigurationSchema = _configSchema.schema.object(ExternalIncidentServiceSecretConfiguration);

exports.ExternalIncidentServiceSecretConfigurationSchema = ExternalIncidentServiceSecretConfigurationSchema;

const CommentsSchema = _configSchema.schema.nullable(_configSchema.schema.arrayOf(_configSchema.schema.object({
  comment: _configSchema.schema.string(),
  commentId: _configSchema.schema.string()
})));

const CommonAttributes = {
  short_description: _configSchema.schema.string(),
  description: _configSchema.schema.nullable(_configSchema.schema.string()),
  externalId: _configSchema.schema.nullable(_configSchema.schema.string()),
  category: _configSchema.schema.nullable(_configSchema.schema.string()),
  subcategory: _configSchema.schema.nullable(_configSchema.schema.string()),
  correlation_id: _configSchema.schema.nullable(_configSchema.schema.string({
    defaultValue: _config.DEFAULT_ALERTS_GROUPING_KEY
  })),
  correlation_display: _configSchema.schema.nullable(_configSchema.schema.string())
}; // Schema for ServiceNow Incident Management (ITSM)

const ExecutorSubActionPushParamsSchemaITSM = _configSchema.schema.object({
  incident: _configSchema.schema.object({ ...CommonAttributes,
    severity: _configSchema.schema.nullable(_configSchema.schema.string()),
    urgency: _configSchema.schema.nullable(_configSchema.schema.string()),
    impact: _configSchema.schema.nullable(_configSchema.schema.string())
  }),
  comments: CommentsSchema
}); // Schema for ServiceNow Security Incident Response (SIR)


exports.ExecutorSubActionPushParamsSchemaITSM = ExecutorSubActionPushParamsSchemaITSM;

const ExecutorSubActionPushParamsSchemaSIR = _configSchema.schema.object({
  incident: _configSchema.schema.object({ ...CommonAttributes,
    dest_ip: _configSchema.schema.oneOf([_configSchema.schema.nullable(_configSchema.schema.string()), _configSchema.schema.nullable(_configSchema.schema.arrayOf(_configSchema.schema.string()))], {
      defaultValue: null
    }),
    malware_hash: _configSchema.schema.oneOf([_configSchema.schema.nullable(_configSchema.schema.string()), _configSchema.schema.nullable(_configSchema.schema.arrayOf(_configSchema.schema.string()))], {
      defaultValue: null
    }),
    malware_url: _configSchema.schema.oneOf([_configSchema.schema.nullable(_configSchema.schema.string()), _configSchema.schema.nullable(_configSchema.schema.arrayOf(_configSchema.schema.string()))], {
      defaultValue: null
    }),
    source_ip: _configSchema.schema.oneOf([_configSchema.schema.nullable(_configSchema.schema.string()), _configSchema.schema.nullable(_configSchema.schema.arrayOf(_configSchema.schema.string()))], {
      defaultValue: null
    }),
    priority: _configSchema.schema.nullable(_configSchema.schema.string())
  }),
  comments: CommentsSchema
}); // Schema for ServiceNow ITOM


exports.ExecutorSubActionPushParamsSchemaSIR = ExecutorSubActionPushParamsSchemaSIR;

const ExecutorSubActionAddEventParamsSchema = _configSchema.schema.object({
  source: _configSchema.schema.nullable(_configSchema.schema.string()),
  event_class: _configSchema.schema.nullable(_configSchema.schema.string()),
  resource: _configSchema.schema.nullable(_configSchema.schema.string()),
  node: _configSchema.schema.nullable(_configSchema.schema.string()),
  metric_name: _configSchema.schema.nullable(_configSchema.schema.string()),
  type: _configSchema.schema.nullable(_configSchema.schema.string()),
  severity: _configSchema.schema.nullable(_configSchema.schema.string()),
  description: _configSchema.schema.nullable(_configSchema.schema.string()),
  additional_info: _configSchema.schema.nullable(_configSchema.schema.string()),
  message_key: _configSchema.schema.nullable(_configSchema.schema.string({
    defaultValue: _config.DEFAULT_ALERTS_GROUPING_KEY
  })),
  time_of_event: _configSchema.schema.nullable(_configSchema.schema.string())
});

exports.ExecutorSubActionAddEventParamsSchema = ExecutorSubActionAddEventParamsSchema;

const ExecutorSubActionGetIncidentParamsSchema = _configSchema.schema.object({
  externalId: _configSchema.schema.string()
}); // Reserved for future implementation


exports.ExecutorSubActionGetIncidentParamsSchema = ExecutorSubActionGetIncidentParamsSchema;

const ExecutorSubActionHandshakeParamsSchema = _configSchema.schema.object({});

exports.ExecutorSubActionHandshakeParamsSchema = ExecutorSubActionHandshakeParamsSchema;

const ExecutorSubActionCommonFieldsParamsSchema = _configSchema.schema.object({});

exports.ExecutorSubActionCommonFieldsParamsSchema = ExecutorSubActionCommonFieldsParamsSchema;

const ExecutorSubActionGetChoicesParamsSchema = _configSchema.schema.object({
  fields: _configSchema.schema.arrayOf(_configSchema.schema.string())
}); // Executor parameters for ServiceNow Incident Management (ITSM)


exports.ExecutorSubActionGetChoicesParamsSchema = ExecutorSubActionGetChoicesParamsSchema;

const ExecutorParamsSchemaITSM = _configSchema.schema.oneOf([_configSchema.schema.object({
  subAction: _configSchema.schema.literal('getFields'),
  subActionParams: ExecutorSubActionCommonFieldsParamsSchema
}), _configSchema.schema.object({
  subAction: _configSchema.schema.literal('getIncident'),
  subActionParams: ExecutorSubActionGetIncidentParamsSchema
}), _configSchema.schema.object({
  subAction: _configSchema.schema.literal('handshake'),
  subActionParams: ExecutorSubActionHandshakeParamsSchema
}), _configSchema.schema.object({
  subAction: _configSchema.schema.literal('pushToService'),
  subActionParams: ExecutorSubActionPushParamsSchemaITSM
}), _configSchema.schema.object({
  subAction: _configSchema.schema.literal('getChoices'),
  subActionParams: ExecutorSubActionGetChoicesParamsSchema
})]); // Executor parameters for ServiceNow Security Incident Response (SIR)


exports.ExecutorParamsSchemaITSM = ExecutorParamsSchemaITSM;

const ExecutorParamsSchemaSIR = _configSchema.schema.oneOf([_configSchema.schema.object({
  subAction: _configSchema.schema.literal('getFields'),
  subActionParams: ExecutorSubActionCommonFieldsParamsSchema
}), _configSchema.schema.object({
  subAction: _configSchema.schema.literal('getIncident'),
  subActionParams: ExecutorSubActionGetIncidentParamsSchema
}), _configSchema.schema.object({
  subAction: _configSchema.schema.literal('handshake'),
  subActionParams: ExecutorSubActionHandshakeParamsSchema
}), _configSchema.schema.object({
  subAction: _configSchema.schema.literal('pushToService'),
  subActionParams: ExecutorSubActionPushParamsSchemaSIR
}), _configSchema.schema.object({
  subAction: _configSchema.schema.literal('getChoices'),
  subActionParams: ExecutorSubActionGetChoicesParamsSchema
})]); // Executor parameters for ITOM


exports.ExecutorParamsSchemaSIR = ExecutorParamsSchemaSIR;

const ExecutorParamsSchemaITOM = _configSchema.schema.oneOf([_configSchema.schema.object({
  subAction: _configSchema.schema.literal('addEvent'),
  subActionParams: ExecutorSubActionAddEventParamsSchema
}), _configSchema.schema.object({
  subAction: _configSchema.schema.literal('getChoices'),
  subActionParams: ExecutorSubActionGetChoicesParamsSchema
})]);

exports.ExecutorParamsSchemaITOM = ExecutorParamsSchemaITOM;