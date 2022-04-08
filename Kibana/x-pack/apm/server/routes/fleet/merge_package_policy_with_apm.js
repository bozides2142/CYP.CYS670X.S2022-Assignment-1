"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergePackagePolicyWithApm = mergePackagePolicyWithApm;

var _list_configurations = require("../settings/agent_configuration/list_configurations");

var _register_fleet_policy_callbacks = require("./register_fleet_policy_callbacks");

var _source_maps = require("./source_maps");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function mergePackagePolicyWithApm({
  packagePolicy,
  setup,
  fleetPluginStart
}) {
  const agentConfigurations = await (0, _list_configurations.listConfigurations)({
    setup
  });
  const artifacts = await (0, _source_maps.listArtifacts)({
    fleetPluginStart
  });
  return (0, _register_fleet_policy_callbacks.getPackagePolicyWithAgentConfigurations)((0, _source_maps.getPackagePolicyWithSourceMap)({
    packagePolicy,
    artifacts
  }), agentConfigurations);
}