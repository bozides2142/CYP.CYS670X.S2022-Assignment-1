"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.savedQueryType = exports.savedQuerySavedObjectMappings = exports.packType = exports.packSavedObjectMappings = void 0;

var _immer = require("immer");

var _types = require("../../../common/types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const savedQuerySavedObjectMappings = {
  properties: {
    description: {
      type: 'text'
    },
    id: {
      type: 'keyword'
    },
    query: {
      type: 'text'
    },
    created_at: {
      type: 'date'
    },
    created_by: {
      type: 'text'
    },
    platform: {
      type: 'keyword'
    },
    version: {
      type: 'keyword'
    },
    updated_at: {
      type: 'date'
    },
    updated_by: {
      type: 'text'
    },
    interval: {
      type: 'keyword'
    },
    ecs_mapping: {
      type: 'object',
      enabled: false
    }
  }
};
exports.savedQuerySavedObjectMappings = savedQuerySavedObjectMappings;
const savedQueryType = {
  name: _types.savedQuerySavedObjectType,
  hidden: false,
  namespaceType: 'multiple-isolated',
  mappings: savedQuerySavedObjectMappings,
  management: {
    importableAndExportable: true,
    getTitle: savedObject => savedObject.attributes.id,
    getEditUrl: savedObject => `/saved_queries/${savedObject.id}/edit`,
    getInAppUrl: savedObject => ({
      path: `/app/osquery/saved_queries/${savedObject.id}`,
      uiCapabilitiesPath: 'osquery.read'
    })
  }
};
exports.savedQueryType = savedQueryType;
const packSavedObjectMappings = {
  properties: {
    description: {
      type: 'text'
    },
    name: {
      type: 'text'
    },
    created_at: {
      type: 'date'
    },
    created_by: {
      type: 'keyword'
    },
    updated_at: {
      type: 'date'
    },
    updated_by: {
      type: 'keyword'
    },
    enabled: {
      type: 'boolean'
    },
    queries: {
      properties: {
        id: {
          type: 'keyword'
        },
        query: {
          type: 'text'
        },
        interval: {
          type: 'text'
        },
        platform: {
          type: 'keyword'
        },
        version: {
          type: 'keyword'
        },
        ecs_mapping: {
          type: 'object',
          enabled: false
        }
      }
    }
  }
};
exports.packSavedObjectMappings = packSavedObjectMappings;
const packType = {
  name: _types.packSavedObjectType,
  hidden: false,
  namespaceType: 'multiple-isolated',
  mappings: packSavedObjectMappings,
  management: {
    defaultSearchField: 'name',
    importableAndExportable: true,
    getTitle: savedObject => `Pack: ${savedObject.attributes.name}`,
    getEditUrl: savedObject => `/packs/${savedObject.id}/edit`,
    getInAppUrl: savedObject => ({
      path: `/app/osquery/packs/${savedObject.id}`,
      uiCapabilitiesPath: 'osquery.read'
    }),
    onExport: (context, objects) => (0, _immer.produce)(objects, draft => {
      draft.forEach(packSO => {
        packSO.references = [];
      });
      return draft;
    })
  }
};
exports.packType = packType;