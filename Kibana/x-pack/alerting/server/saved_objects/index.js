"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AlertAttributesExcludedFromAAD = void 0;
Object.defineProperty(exports, "partiallyUpdateAlert", {
  enumerable: true,
  get: function () {
    return _partially_update_alert.partiallyUpdateAlert;
  }
});
exports.setupSavedObjects = setupSavedObjects;

var _mappings = _interopRequireDefault(require("./mappings.json"));

var _migrations = require("./migrations");

var _transform_rule_for_export = require("./transform_rule_for_export");

var _get_import_warnings = require("./get_import_warnings");

var _is_rule_exportable = require("./is_rule_exportable");

var _partially_update_alert = require("./partially_update_alert");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const AlertAttributesExcludedFromAAD = ['scheduledTaskId', 'muteAll', 'mutedInstanceIds', 'updatedBy', 'updatedAt', 'executionStatus', 'monitoring']; // useful for Pick<RawAlert, AlertAttributesExcludedFromAADType> which is a
// type which is a subset of RawAlert with just attributes excluded from AAD
// useful for Pick<RawAlert, AlertAttributesExcludedFromAADType>

exports.AlertAttributesExcludedFromAAD = AlertAttributesExcludedFromAAD;

function setupSavedObjects(savedObjects, encryptedSavedObjects, ruleTypeRegistry, logger, isPreconfigured) {
  savedObjects.registerType({
    name: 'alert',
    hidden: true,
    namespaceType: 'multiple-isolated',
    convertToMultiNamespaceTypeVersion: '8.0.0',
    migrations: (0, _migrations.getMigrations)(encryptedSavedObjects, isPreconfigured),
    mappings: _mappings.default.alert,
    management: {
      displayName: 'rule',
      importableAndExportable: true,

      getTitle(ruleSavedObject) {
        return `Rule: [${ruleSavedObject.attributes.name}]`;
      },

      onImport(ruleSavedObjects) {
        return {
          warnings: (0, _get_import_warnings.getImportWarnings)(ruleSavedObjects)
        };
      },

      onExport(context, objects) {
        return (0, _transform_rule_for_export.transformRulesForExport)(objects);
      },

      isExportable(ruleSavedObject) {
        return (0, _is_rule_exportable.isRuleExportable)(ruleSavedObject, ruleTypeRegistry, logger);
      }

    }
  });
  savedObjects.registerType({
    name: 'api_key_pending_invalidation',
    hidden: true,
    namespaceType: 'agnostic',
    mappings: {
      properties: {
        apiKeyId: {
          type: 'keyword'
        },
        createdAt: {
          type: 'date'
        }
      }
    }
  }); // Encrypted attributes

  encryptedSavedObjects.registerType({
    type: 'alert',
    attributesToEncrypt: new Set(['apiKey']),
    attributesToExcludeFromAAD: new Set(AlertAttributesExcludedFromAAD)
  }); // Encrypted attributes

  encryptedSavedObjects.registerType({
    type: 'api_key_pending_invalidation',
    attributesToEncrypt: new Set(['apiKeyId'])
  });
}