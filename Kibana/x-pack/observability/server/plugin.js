"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ObservabilityPlugin = void 0;

var _i18n = require("@kbn/i18n");

var _server = require("../../../../src/core/server");

var _bootstrap_annotations = require("./lib/annotations/bootstrap_annotations");

var _ui_settings = require("./ui_settings");

var _register_routes = require("./routes/register_routes");

var _get_global_observability_server_route_repository = require("./routes/get_global_observability_server_route_repository");

var _common = require("../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class ObservabilityPlugin {
  constructor(initContext) {
    this.initContext = initContext;
    this.initContext = initContext;
  }

  setup(core, plugins) {
    const config = this.initContext.config.get();

    if (config.unsafe.cases.enabled) {
      plugins.features.registerKibanaFeature({
        id: _common.casesFeatureId,
        name: _i18n.i18n.translate('xpack.observability.featureRegistry.linkObservabilityTitle', {
          defaultMessage: 'Cases'
        }),
        order: 1100,
        category: _server.DEFAULT_APP_CATEGORIES.observability,
        app: [_common.casesFeatureId, 'kibana'],
        catalogue: [_common.observabilityFeatureId],
        cases: [_common.observabilityFeatureId],
        privileges: {
          all: {
            app: [_common.casesFeatureId, 'kibana'],
            catalogue: [_common.observabilityFeatureId],
            cases: {
              all: [_common.observabilityFeatureId]
            },
            api: [],
            savedObject: {
              all: [],
              read: []
            },
            ui: ['crud_cases', 'read_cases'] // uiCapabilities[casesFeatureId].crud_cases or read_cases

          },
          read: {
            app: [_common.casesFeatureId, 'kibana'],
            catalogue: [_common.observabilityFeatureId],
            cases: {
              read: [_common.observabilityFeatureId]
            },
            api: [],
            savedObject: {
              all: [],
              read: []
            },
            ui: ['read_cases'] // uiCapabilities[uiCapabilities[casesFeatureId]].read_cases

          }
        }
      });
    }

    let annotationsApiPromise;
    core.uiSettings.register(_ui_settings.uiSettings);

    if (config.annotations.enabled) {
      annotationsApiPromise = (0, _bootstrap_annotations.bootstrapAnnotations)({
        core,
        index: config.annotations.index,
        context: this.initContext
      }).catch(err => {
        const logger = this.initContext.logger.get('annotations');
        logger.warn(err);
        throw err;
      });
    }

    const start = () => core.getStartServices().then(([coreStart]) => coreStart);

    const {
      ruleDataService
    } = plugins.ruleRegistry;
    (0, _register_routes.registerRoutes)({
      core: {
        setup: core,
        start
      },
      logger: this.initContext.logger.get(),
      repository: (0, _get_global_observability_server_route_repository.getGlobalObservabilityServerRouteRepository)(),
      ruleDataService
    });
    return {
      getScopedAnnotationsClient: async (...args) => {
        const api = await annotationsApiPromise;
        return api === null || api === void 0 ? void 0 : api.getScopedAnnotationsClient(...args);
      }
    };
  }

  start() {}

  stop() {}

}

exports.ObservabilityPlugin = ObservabilityPlugin;