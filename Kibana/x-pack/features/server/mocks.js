"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.featuresPluginMock = void 0;

var _feature_privilege_iterator = require("./feature_privilege_iterator");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createSetup = () => {
  return {
    getKibanaFeatures: jest.fn(),
    getElasticsearchFeatures: jest.fn(),
    getFeaturesUICapabilities: jest.fn(),
    registerKibanaFeature: jest.fn(),
    registerElasticsearchFeature: jest.fn(),
    enableReportingUiCapabilities: jest.fn(),
    featurePrivilegeIterator: jest.fn().mockImplementation(_feature_privilege_iterator.featurePrivilegeIterator),
    subFeaturePrivilegeIterator: jest.fn().mockImplementation(_feature_privilege_iterator.subFeaturePrivilegeIterator)
  };
};

const createStart = () => {
  return {
    getKibanaFeatures: jest.fn(),
    getElasticsearchFeatures: jest.fn()
  };
};

const featuresPluginMock = {
  createSetup,
  createStart
};
exports.featuresPluginMock = featuresPluginMock;