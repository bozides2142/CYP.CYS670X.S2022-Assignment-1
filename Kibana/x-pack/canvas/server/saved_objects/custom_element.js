"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.customElementType = void 0;

var _constants = require("../../common/lib/constants");

var _migrations = require("./migrations");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const customElementType = deps => ({
  name: _constants.CUSTOM_ELEMENT_TYPE,
  hidden: false,
  namespaceType: 'multiple-isolated',
  convertToMultiNamespaceTypeVersion: '8.0.0',
  mappings: {
    dynamic: false,
    properties: {
      name: {
        type: 'text',
        fields: {
          keyword: {
            type: 'keyword'
          }
        }
      },
      help: {
        type: 'text'
      },
      content: {
        type: 'text'
      },
      image: {
        type: 'text'
      },
      '@timestamp': {
        type: 'date'
      },
      '@created': {
        type: 'date'
      }
    }
  },
  migrations: (0, _migrations.customElementMigrationsFactory)(deps),
  management: {
    icon: 'canvasApp',
    defaultSearchField: 'name',
    importableAndExportable: true,

    getTitle(obj) {
      return obj.attributes.displayName;
    }

  }
});

exports.customElementType = customElementType;