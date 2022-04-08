"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCaseSavedObjectType = void 0;

var _constants = require("../../common/constants");

var _export = require("./import_export/export");

var _migrations = require("./migrations");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createCaseSavedObjectType = (coreSetup, logger) => ({
  name: _constants.CASE_SAVED_OBJECT,
  hidden: true,
  namespaceType: 'multiple-isolated',
  convertToMultiNamespaceTypeVersion: '8.0.0',
  mappings: {
    properties: {
      closed_at: {
        type: 'date'
      },
      closed_by: {
        properties: {
          username: {
            type: 'keyword'
          },
          full_name: {
            type: 'keyword'
          },
          email: {
            type: 'keyword'
          }
        }
      },
      created_at: {
        type: 'date'
      },
      created_by: {
        properties: {
          username: {
            type: 'keyword'
          },
          full_name: {
            type: 'keyword'
          },
          email: {
            type: 'keyword'
          }
        }
      },
      description: {
        type: 'text'
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
      external_service: {
        properties: {
          pushed_at: {
            type: 'date'
          },
          pushed_by: {
            properties: {
              username: {
                type: 'keyword'
              },
              full_name: {
                type: 'keyword'
              },
              email: {
                type: 'keyword'
              }
            }
          },
          connector_name: {
            type: 'keyword'
          },
          external_id: {
            type: 'keyword'
          },
          external_title: {
            type: 'text'
          },
          external_url: {
            type: 'text'
          }
        }
      },
      owner: {
        type: 'keyword'
      },
      title: {
        type: 'text'
      },
      status: {
        type: 'keyword'
      },
      tags: {
        type: 'keyword'
      },
      updated_at: {
        type: 'date'
      },
      updated_by: {
        properties: {
          username: {
            type: 'keyword'
          },
          full_name: {
            type: 'keyword'
          },
          email: {
            type: 'keyword'
          }
        }
      },
      settings: {
        properties: {
          syncAlerts: {
            type: 'boolean'
          }
        }
      }
    }
  },
  migrations: _migrations.caseMigrations,
  management: {
    importableAndExportable: true,
    defaultSearchField: 'title',
    icon: 'folderExclamation',
    getTitle: savedObject => savedObject.attributes.title,
    onExport: async (context, objects) => (0, _export.handleExport)({
      context,
      objects,
      coreSetup,
      logger
    })
  }
});

exports.createCaseSavedObjectType = createCaseSavedObjectType;