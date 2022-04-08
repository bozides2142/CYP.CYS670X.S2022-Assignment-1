"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUnsupportedApmServerSchema = getUnsupportedApmServerSchema;

var _apm_saved_object_constants = require("../../../common/apm_saved_object_constants");

var _get_apm_package_policy_definition = require("./get_apm_package_policy_definition");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getUnsupportedApmServerSchema({
  savedObjectsClient
}) {
  const {
    attributes
  } = await savedObjectsClient.get(_apm_saved_object_constants.APM_SERVER_SCHEMA_SAVED_OBJECT_TYPE, _apm_saved_object_constants.APM_SERVER_SCHEMA_SAVED_OBJECT_ID);
  const apmServerSchema = JSON.parse(attributes.schemaJson);
  const preprocessedApmServerSchema = (0, _get_apm_package_policy_definition.preprocessLegacyFields)({
    apmServerSchema
  });
  return Object.entries(preprocessedApmServerSchema).filter(([name]) => !(name in _get_apm_package_policy_definition.apmConfigMapping)).map(([key, value]) => ({
    key,
    value
  }));
}