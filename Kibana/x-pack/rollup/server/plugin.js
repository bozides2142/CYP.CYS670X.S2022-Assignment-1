"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RollupPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _i18n = require("@kbn/i18n");

var _configSchema = require("@kbn/config-schema");

var _common = require("../common");

var _routes = require("./routes");

var _services = require("./services");

var _collectors = require("./collectors");

var _rollup_data_enricher = require("./rollup_data_enricher");

var _shared_imports = require("./shared_imports");

var _format_es_error = require("./lib/format_es_error");

var _server = require("../../../../src/plugins/data/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class RollupPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "license", void 0);
    this.logger = initializerContext.logger.get();
    this.license = new _services.License();
  }

  setup({
    http,
    uiSettings,
    savedObjects,
    getStartServices
  }, {
    features,
    licensing,
    indexManagement,
    visTypeTimeseries,
    usageCollection
  }) {
    this.license.setup({
      pluginId: _common.PLUGIN.ID,
      minimumLicenseType: _common.PLUGIN.minimumLicenseType,
      defaultErrorMessage: _i18n.i18n.translate('xpack.rollupJobs.licenseCheckErrorMessage', {
        defaultMessage: 'License check failed'
      })
    }, {
      licensing,
      logger: this.logger
    });
    features.registerElasticsearchFeature({
      id: 'rollup_jobs',
      management: {
        data: ['rollup_jobs']
      },
      catalogue: ['rollup_jobs'],
      privileges: [{
        requiredClusterPrivileges: ['manage_rollup'],
        ui: []
      }]
    });
    (0, _routes.registerApiRoutes)({
      router: http.createRouter(),
      license: this.license,
      lib: {
        handleEsError: _shared_imports.handleEsError,
        formatEsError: _format_es_error.formatEsError,
        getCapabilitiesForRollupIndices: _server.getCapabilitiesForRollupIndices
      },
      sharedImports: {
        IndexPatternsFetcher: _shared_imports.IndexPatternsFetcher
      }
    });
    uiSettings.register({
      [_common.CONFIG_ROLLUPS]: {
        name: _i18n.i18n.translate('xpack.rollupJobs.rollupDataViewsTitle', {
          defaultMessage: 'Enable rollup data views'
        }),
        value: true,
        description: _i18n.i18n.translate('xpack.rollupJobs.rollupDataViewsDescription', {
          defaultMessage: `Enable the creation of data views that capture rollup indices,
              which in turn enable visualizations based on rollup data.`
        }),
        category: ['rollups'],
        schema: _configSchema.schema.boolean(),
        requiresPageReload: true
      }
    });

    if (usageCollection) {
      try {
        (0, _collectors.registerRollupUsageCollector)(usageCollection, savedObjects.getKibanaIndex());
      } catch (e) {
        this.logger.warn(`Registering Rollup collector failed: ${e}`);
      }
    }

    if (indexManagement && indexManagement.indexDataEnricher) {
      indexManagement.indexDataEnricher.add(_rollup_data_enricher.rollupDataEnricher);
    }
  }

  start() {}

  stop() {}

}

exports.RollupPlugin = RollupPlugin;