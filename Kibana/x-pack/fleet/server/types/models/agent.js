"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NewAgentActionSchema = exports.AgentTypeSchema = void 0;

var _configSchema = require("@kbn/config-schema");

var _common = require("../../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const AgentTypeSchema = _configSchema.schema.oneOf([_configSchema.schema.literal(_common.AGENT_TYPE_EPHEMERAL), _configSchema.schema.literal(_common.AGENT_TYPE_PERMANENT), _configSchema.schema.literal(_common.AGENT_TYPE_TEMPORARY)]);

exports.AgentTypeSchema = AgentTypeSchema;

const NewAgentActionSchema = _configSchema.schema.oneOf([_configSchema.schema.object({
  type: _configSchema.schema.oneOf([_configSchema.schema.literal('POLICY_CHANGE'), _configSchema.schema.literal('UNENROLL'), _configSchema.schema.literal('UPGRADE'), _configSchema.schema.literal('POLICY_REASSIGN')]),
  data: _configSchema.schema.maybe(_configSchema.schema.any()),
  ack_data: _configSchema.schema.maybe(_configSchema.schema.any())
}), _configSchema.schema.object({
  type: _configSchema.schema.oneOf([_configSchema.schema.literal('SETTINGS')]),
  data: _configSchema.schema.object({
    log_level: _configSchema.schema.oneOf([_configSchema.schema.literal('debug'), _configSchema.schema.literal('info'), _configSchema.schema.literal('warning'), _configSchema.schema.literal('error')])
  })
})]);

exports.NewAgentActionSchema = NewAgentActionSchema;