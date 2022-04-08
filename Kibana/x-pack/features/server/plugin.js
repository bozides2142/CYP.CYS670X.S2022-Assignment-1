"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FeaturesPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _std = require("@kbn/std");

var _feature_registry = require("./feature_registry");

var _ui_capabilities_for_features = require("./ui_capabilities_for_features");

var _oss_features = require("./oss_features");

var _routes = require("./routes");

var _feature_privilege_iterator = require("./feature_privilege_iterator");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Represents Features Plugin instance that will be managed by the Kibana plugin system.
 */


class FeaturesPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "featureRegistry", new _feature_registry.FeatureRegistry());
    (0, _defineProperty2.default)(this, "isReportingEnabled", false);
    this.initializerContext = initializerContext;
    this.logger = this.initializerContext.logger.get();
  }

  setup(core) {
    (0, _routes.defineRoutes)({
      router: core.http.createRouter(),
      featureRegistry: this.featureRegistry
    });

    const getFeaturesUICapabilities = () => (0, _ui_capabilities_for_features.uiCapabilitiesForFeatures)(this.featureRegistry.getAllKibanaFeatures(), this.featureRegistry.getAllElasticsearchFeatures());

    core.capabilities.registerProvider(getFeaturesUICapabilities);
    return (0, _std.deepFreeze)({
      registerKibanaFeature: this.featureRegistry.registerKibanaFeature.bind(this.featureRegistry),
      registerElasticsearchFeature: this.featureRegistry.registerElasticsearchFeature.bind(this.featureRegistry),
      getKibanaFeatures: this.featureRegistry.getAllKibanaFeatures.bind(this.featureRegistry),
      getElasticsearchFeatures: this.featureRegistry.getAllElasticsearchFeatures.bind(this.featureRegistry),
      getFeaturesUICapabilities,
      enableReportingUiCapabilities: this.enableReportingUiCapabilities.bind(this),
      featurePrivilegeIterator: _feature_privilege_iterator.featurePrivilegeIterator,
      subFeaturePrivilegeIterator: _feature_privilege_iterator.subFeaturePrivilegeIterator
    });
  }

  start(core) {
    this.registerOssFeatures(core.savedObjects);
    return (0, _std.deepFreeze)({
      getElasticsearchFeatures: this.featureRegistry.getAllElasticsearchFeatures.bind(this.featureRegistry),
      getKibanaFeatures: this.featureRegistry.getAllKibanaFeatures.bind(this.featureRegistry)
    });
  }

  stop() {}

  registerOssFeatures(savedObjects) {
    const registry = savedObjects.getTypeRegistry();
    const savedObjectVisibleTypes = registry.getVisibleTypes().map(t => t.name);
    const savedObjectImportableAndExportableHiddenTypes = registry.getImportableAndExportableTypes().filter(t => registry.isHidden(t.name)).map(t => t.name);
    const savedObjectTypes = Array.from(new Set([...savedObjectVisibleTypes, ...savedObjectImportableAndExportableHiddenTypes]));
    const features = (0, _oss_features.buildOSSFeatures)({
      savedObjectTypes,
      includeReporting: this.isReportingEnabled
    });

    for (const feature of features) {
      this.featureRegistry.registerKibanaFeature(feature);
    }
  }

  enableReportingUiCapabilities() {
    this.logger.debug(`Feature controls for Reporting plugin are enabled. Please assign access to Reporting use Kibana feature controls for applications.`);
    this.isReportingEnabled = true;
  }

}

exports.FeaturesPlugin = FeaturesPlugin;