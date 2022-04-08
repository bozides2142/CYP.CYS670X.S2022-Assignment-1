"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapSavedObjects = void 0;

var _constants = require("../../common/constants");

var _saved_object_migrations = require("./saved_object_migrations");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore


const mapSavedObjects = {
  name: 'map',
  hidden: false,
  namespaceType: 'multiple-isolated',
  convertToMultiNamespaceTypeVersion: '8.0.0',
  mappings: {
    properties: {
      description: {
        type: 'text'
      },
      title: {
        type: 'text'
      },
      version: {
        type: 'integer'
      },
      mapStateJSON: {
        type: 'text'
      },
      layerListJSON: {
        type: 'text'
      },
      uiStateJSON: {
        type: 'text'
      },
      bounds: {
        dynamic: false,
        properties: {}
      } // Disable removed field

    }
  },
  management: {
    icon: _constants.APP_ICON,
    defaultSearchField: 'title',
    importableAndExportable: true,

    getTitle(obj) {
      return obj.attributes.title;
    },

    getInAppUrl(obj) {
      return {
        path: (0, _constants.getFullPath)(obj.id),
        uiCapabilitiesPath: 'maps.show'
      };
    }

  },
  migrations: _saved_object_migrations.savedObjectMigrations
};
exports.mapSavedObjects = mapSavedObjects;