"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CheckPermissionsRequestSchema = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const CheckPermissionsRequestSchema = {
  query: _configSchema.schema.object({
    fleetServerSetup: _configSchema.schema.maybe(_configSchema.schema.boolean())
  })
};
exports.CheckPermissionsRequestSchema = CheckPermissionsRequestSchema;