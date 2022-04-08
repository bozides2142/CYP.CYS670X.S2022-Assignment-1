"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSavedObjectSanitizedDocSchema = void 0;

var _configSchema = require("@kbn/config-schema");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Takes a {@link SavedObjectsValidationSpec} and returns a full schema representing
 * a {@link SavedObjectSanitizedDoc}, with the spec applied to the object's `attributes`.
 *
 * @internal
 */
const createSavedObjectSanitizedDocSchema = attributesSchema => _configSchema.schema.object({
  attributes: attributesSchema,
  id: _configSchema.schema.string(),
  type: _configSchema.schema.string(),
  references: _configSchema.schema.arrayOf(_configSchema.schema.object({
    name: _configSchema.schema.string(),
    type: _configSchema.schema.string(),
    id: _configSchema.schema.string()
  }), {
    defaultValue: []
  }),
  namespace: _configSchema.schema.maybe(_configSchema.schema.string()),
  namespaces: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
  migrationVersion: _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.string())),
  coreMigrationVersion: _configSchema.schema.maybe(_configSchema.schema.string()),
  updated_at: _configSchema.schema.maybe(_configSchema.schema.string()),
  version: _configSchema.schema.maybe(_configSchema.schema.string()),
  originId: _configSchema.schema.maybe(_configSchema.schema.string())
});

exports.createSavedObjectSanitizedDocSchema = createSavedObjectSanitizedDocSchema;