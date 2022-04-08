"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.workpadTypeFactory = void 0;

var _constants = require("../../common/lib/constants");

var _migrations = require("./migrations");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const workpadTypeFactory = deps => ({
  name: _constants.CANVAS_TYPE,
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
      '@timestamp': {
        type: 'date'
      },
      '@created': {
        type: 'date'
      }
    }
  },
  migrations: (0, _migrations.workpadMigrationsFactory)(deps),
  management: {
    importableAndExportable: true,
    icon: 'canvasApp',
    defaultSearchField: 'name',

    getTitle(obj) {
      return obj.attributes.name;
    },

    getInAppUrl(obj) {
      return {
        path: `/app/canvas#/workpad/${encodeURIComponent(obj.id)}`,
        uiCapabilitiesPath: 'canvas.show'
      };
    }

  }
});

exports.workpadTypeFactory = workpadTypeFactory;