"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.caseConfigureSavedObjectType = void 0;

var _constants = require("../../common/constants");

var _migrations = require("./migrations");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const caseConfigureSavedObjectType = {
  name: _constants.CASE_CONFIGURE_SAVED_OBJECT,
  hidden: true,
  namespaceType: 'multiple-isolated',
  convertToMultiNamespaceTypeVersion: '8.0.0',
  mappings: {
    properties: {
      created_at: {
        type: 'date'
      },
      created_by: {
        properties: {
          email: {
            type: 'keyword'
          },
          username: {
            type: 'keyword'
          },
          full_name: {
            type: 'keyword'
          }
        }
      },
      connector: {
        properties: {
          name: {
            type: 'text'
          },
          type: {
            type: 'keyword'
          },
          fields: {
            properties: {
              key: {
                type: 'text'
              },
              value: {
                type: 'text'
              }
            }
          }
        }
      },
      closure_type: {
        type: 'keyword'
      },
      owner: {
        type: 'keyword'
      },
      updated_at: {
        type: 'date'
      },
      updated_by: {
        properties: {
          email: {
            type: 'keyword'
          },
          username: {
            type: 'keyword'
          },
          full_name: {
            type: 'keyword'
          }
        }
      }
    }
  },
  migrations: _migrations.configureMigrations
};
exports.caseConfigureSavedObjectType = caseConfigureSavedObjectType;