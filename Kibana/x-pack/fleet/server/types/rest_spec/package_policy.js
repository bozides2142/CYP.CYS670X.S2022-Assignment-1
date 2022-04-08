"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UpgradePackagePoliciesRequestSchema = exports.UpdatePackagePolicyRequestSchema = exports.GetPackagePoliciesRequestSchema = exports.GetOnePackagePolicyRequestSchema = exports.DryRunPackagePoliciesRequestSchema = exports.DeletePackagePoliciesRequestSchema = exports.CreatePackagePolicyRequestSchema = void 0;

var _configSchema = require("@kbn/config-schema");

var _models = require("../models");

var _index = require("./index");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const GetPackagePoliciesRequestSchema = {
  query: _index.ListWithKuerySchema
};
exports.GetPackagePoliciesRequestSchema = GetPackagePoliciesRequestSchema;
const GetOnePackagePolicyRequestSchema = {
  params: _configSchema.schema.object({
    packagePolicyId: _configSchema.schema.string()
  })
};
exports.GetOnePackagePolicyRequestSchema = GetOnePackagePolicyRequestSchema;
const CreatePackagePolicyRequestSchema = {
  body: _models.CreatePackagePolicyRequestBodySchema
};
exports.CreatePackagePolicyRequestSchema = CreatePackagePolicyRequestSchema;
const UpdatePackagePolicyRequestSchema = { ...GetOnePackagePolicyRequestSchema,
  body: _models.UpdatePackagePolicyRequestBodySchema
};
exports.UpdatePackagePolicyRequestSchema = UpdatePackagePolicyRequestSchema;
const DeletePackagePoliciesRequestSchema = {
  body: _configSchema.schema.object({
    packagePolicyIds: _configSchema.schema.arrayOf(_configSchema.schema.string()),
    force: _configSchema.schema.maybe(_configSchema.schema.boolean())
  })
};
exports.DeletePackagePoliciesRequestSchema = DeletePackagePoliciesRequestSchema;
const UpgradePackagePoliciesRequestSchema = {
  body: _configSchema.schema.object({
    packagePolicyIds: _configSchema.schema.arrayOf(_configSchema.schema.string())
  })
};
exports.UpgradePackagePoliciesRequestSchema = UpgradePackagePoliciesRequestSchema;
const DryRunPackagePoliciesRequestSchema = {
  body: _configSchema.schema.object({
    packagePolicyIds: _configSchema.schema.arrayOf(_configSchema.schema.string()),
    packageVersion: _configSchema.schema.maybe(_configSchema.schema.string())
  })
};
exports.DryRunPackagePoliciesRequestSchema = DryRunPackagePoliciesRequestSchema;