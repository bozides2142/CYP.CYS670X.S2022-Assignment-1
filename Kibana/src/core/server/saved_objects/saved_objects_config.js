"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.savedObjectsMigrationConfig = exports.savedObjectsConfig = exports.SavedObjectConfig = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _configSchema = require("@kbn/config-schema");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const migrationSchema = _configSchema.schema.object({
  batchSize: _configSchema.schema.number({
    defaultValue: 1_000
  }),
  maxBatchSizeBytes: _configSchema.schema.byteSize({
    defaultValue: '100mb'
  }),
  // 100mb is the default http.max_content_length Elasticsearch config value
  scrollDuration: _configSchema.schema.string({
    defaultValue: '15m'
  }),
  pollInterval: _configSchema.schema.number({
    defaultValue: 1_500
  }),
  skip: _configSchema.schema.boolean({
    defaultValue: false
  }),
  retryAttempts: _configSchema.schema.number({
    defaultValue: 15
  })
});

const savedObjectsMigrationConfig = {
  path: 'migrations',
  schema: migrationSchema
};
exports.savedObjectsMigrationConfig = savedObjectsMigrationConfig;

const soSchema = _configSchema.schema.object({
  maxImportPayloadBytes: _configSchema.schema.byteSize({
    defaultValue: 26_214_400
  }),
  maxImportExportSize: _configSchema.schema.number({
    defaultValue: 10_000
  })
});

const savedObjectsConfig = {
  path: 'savedObjects',
  schema: soSchema
};
exports.savedObjectsConfig = savedObjectsConfig;

class SavedObjectConfig {
  constructor(rawConfig, rawMigrationConfig) {
    (0, _defineProperty2.default)(this, "maxImportPayloadBytes", void 0);
    (0, _defineProperty2.default)(this, "maxImportExportSize", void 0);
    (0, _defineProperty2.default)(this, "migration", void 0);
    this.maxImportPayloadBytes = rawConfig.maxImportPayloadBytes.getValueInBytes();
    this.maxImportExportSize = rawConfig.maxImportExportSize;
    this.migration = rawMigrationConfig;
  }

}

exports.SavedObjectConfig = SavedObjectConfig;