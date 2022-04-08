"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PutPreconfigurationSchema = exports.PostResetOnePreconfiguredAgentPoliciesSchema = void 0;

var _configSchema = require("@kbn/config-schema");

var _models = require("../models");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const PutPreconfigurationSchema = {
  body: _configSchema.schema.object({
    agentPolicies: _configSchema.schema.maybe(_models.PreconfiguredAgentPoliciesSchema),
    packages: _configSchema.schema.maybe(_models.PreconfiguredPackagesSchema)
  })
};
exports.PutPreconfigurationSchema = PutPreconfigurationSchema;
const PostResetOnePreconfiguredAgentPoliciesSchema = {
  params: _configSchema.schema.object({
    agentPolicyId: _configSchema.schema.string()
  })
};
exports.PostResetOnePreconfiguredAgentPoliciesSchema = PostResetOnePreconfiguredAgentPoliciesSchema;