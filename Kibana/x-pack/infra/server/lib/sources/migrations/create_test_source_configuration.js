"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTestSourceConfiguration = void 0;

var _saved_object_type = require("../saved_object_type");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createTestSourceConfiguration = (overrideAttributes = {}, initialReferences = []) => ({
  attributes: {
    name: 'TEST CONFIGURATION',
    description: '',
    fields: {
      message: ['TEST MESSAGE FIELD']
    },
    inventoryDefaultView: '0',
    metricsExplorerDefaultView: '0',
    logColumns: [{
      fieldColumn: {
        id: 'TEST FIELD COLUMN ID',
        field: 'TEST FIELD COLUMN FIELD'
      }
    }],
    logIndices: {
      type: 'index_name',
      indexName: 'TEST INDEX'
    },
    metricAlias: 'metricbeat-*,metrics-*',
    anomalyThreshold: 20,
    ...overrideAttributes
  },
  id: 'TEST_ID',
  type: _saved_object_type.infraSourceConfigurationSavedObjectName,
  references: initialReferences
});

exports.createTestSourceConfiguration = createTestSourceConfiguration;