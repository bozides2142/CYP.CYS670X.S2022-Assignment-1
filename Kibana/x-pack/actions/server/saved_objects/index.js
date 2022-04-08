"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupSavedObjects = setupSavedObjects;

var _mappings = _interopRequireDefault(require("./mappings.json"));

var _actions_migrations = require("./actions_migrations");

var _action_task_params_migrations = require("./action_task_params_migrations");

var _get_import_warnings = require("./get_import_warnings");

var _transform_connectors_for_export = require("./transform_connectors_for_export");

var _saved_objects = require("../constants/saved_objects");

var _server = require("../../../task_manager/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function setupSavedObjects(savedObjects, encryptedSavedObjects, actionTypeRegistry, taskManagerIndex, preconfiguredActions) {
  savedObjects.registerType({
    name: _saved_objects.ACTION_SAVED_OBJECT_TYPE,
    hidden: true,
    namespaceType: 'multiple-isolated',
    convertToMultiNamespaceTypeVersion: '8.0.0',
    mappings: _mappings.default.action,
    migrations: (0, _actions_migrations.getActionsMigrations)(encryptedSavedObjects),
    management: {
      displayName: 'connector',
      defaultSearchField: 'name',
      importableAndExportable: true,

      getTitle(savedObject) {
        return `Connector: [${savedObject.attributes.name}]`;
      },

      onExport(context, objects) {
        return (0, _transform_connectors_for_export.transformConnectorsForExport)(objects, actionTypeRegistry);
      },

      onImport(connectors) {
        return {
          warnings: (0, _get_import_warnings.getImportWarnings)(connectors)
        };
      }

    }
  }); // Encrypted attributes
  // - `secrets` properties will be encrypted
  // - `config` will be included in AAD
  // - everything else excluded from AAD

  encryptedSavedObjects.registerType({
    type: _saved_objects.ACTION_SAVED_OBJECT_TYPE,
    attributesToEncrypt: new Set(['secrets']),
    attributesToExcludeFromAAD: new Set(['name'])
  });
  savedObjects.registerType({
    name: _saved_objects.ACTION_TASK_PARAMS_SAVED_OBJECT_TYPE,
    hidden: true,
    namespaceType: 'multiple-isolated',
    convertToMultiNamespaceTypeVersion: '8.0.0',
    mappings: _mappings.default.action_task_params,
    migrations: (0, _action_task_params_migrations.getActionTaskParamsMigrations)(encryptedSavedObjects, preconfiguredActions),
    excludeOnUpgrade: async ({
      readonlyEsClient
    }) => {
      const oldestIdleActionTask = await (0, _server.getOldestIdleActionTask)(readonlyEsClient, taskManagerIndex);
      return {
        bool: {
          must: [{
            term: {
              type: 'action_task_params'
            }
          }, {
            range: {
              updated_at: {
                lt: oldestIdleActionTask
              }
            }
          }]
        }
      };
    }
  });
  encryptedSavedObjects.registerType({
    type: _saved_objects.ACTION_TASK_PARAMS_SAVED_OBJECT_TYPE,
    attributesToEncrypt: new Set(['apiKey'])
  });
  savedObjects.registerType({
    name: _saved_objects.CONNECTOR_TOKEN_SAVED_OBJECT_TYPE,
    hidden: true,
    namespaceType: 'agnostic',
    mappings: _mappings.default.connector_token,
    management: {
      importableAndExportable: false
    }
  });
  encryptedSavedObjects.registerType({
    type: _saved_objects.CONNECTOR_TOKEN_SAVED_OBJECT_TYPE,
    attributesToEncrypt: new Set(['token'])
  });
}