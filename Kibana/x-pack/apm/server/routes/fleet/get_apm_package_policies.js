"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getApmPackgePolicies = getApmPackgePolicies;

var _get_internal_saved_objects_client = require("../../lib/helpers/get_internal_saved_objects_client");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getApmPackgePolicies({
  core,
  fleetPluginStart
}) {
  // @ts-ignore
  const savedObjectsClient = await (0, _get_internal_saved_objects_client.getInternalSavedObjectsClient)(core.setup);
  return await fleetPluginStart.packagePolicyService.list(savedObjectsClient, {
    kuery: 'ingest-package-policies.package.name:apm'
  });
}