"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.querySavedObjectType = void 0;

var _query = require("./migrations/query");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const querySavedObjectType = {
  name: 'query',
  hidden: false,
  namespaceType: 'multiple-isolated',
  convertToMultiNamespaceTypeVersion: '8.0.0',
  management: {
    icon: 'search',
    defaultSearchField: 'title',
    importableAndExportable: true,

    getTitle(obj) {
      return obj.attributes.title;
    },

    getInAppUrl(obj) {
      return {
        path: `/app/discover#/?_a=(savedQuery:'${encodeURIComponent(obj.id)}')`,
        uiCapabilitiesPath: 'discover.show'
      };
    }

  },
  mappings: {
    properties: {
      title: {
        type: 'text'
      },
      description: {
        type: 'text'
      },
      query: {
        properties: {
          language: {
            type: 'keyword'
          },
          query: {
            type: 'keyword',
            index: false
          }
        }
      },
      filters: {
        type: 'object',
        enabled: false
      },
      timefilter: {
        type: 'object',
        enabled: false
      }
    }
  },
  migrations: _query.savedQueryMigrations
};
exports.querySavedObjectType = querySavedObjectType;