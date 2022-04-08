"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.caseConnectorMappingsSavedObjectType = void 0;

var _constants = require("../../common/constants");

var _migrations = require("./migrations");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const caseConnectorMappingsSavedObjectType = {
  name: _constants.CASE_CONNECTOR_MAPPINGS_SAVED_OBJECT,
  hidden: true,
  namespaceType: 'multiple-isolated',
  convertToMultiNamespaceTypeVersion: '8.0.0',
  mappings: {
    properties: {
      mappings: {
        properties: {
          source: {
            type: 'keyword'
          },
          target: {
            type: 'keyword'
          },
          action_type: {
            type: 'keyword'
          }
        }
      },
      owner: {
        type: 'keyword'
      }
    }
  },
  migrations: _migrations.connectorMappingsMigrations
};
exports.caseConnectorMappingsSavedObjectType = caseConnectorMappingsSavedObjectType;