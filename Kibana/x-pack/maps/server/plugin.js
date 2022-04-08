"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MapsPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _i18n = require("@kbn/i18n");

var _server = require("../../../../src/core/server");

var _ecommerce_saved_objects = require("./sample_data/ecommerce_saved_objects");

var _flights_saved_objects = require("./sample_data/flights_saved_objects.js");

var _web_logs_saved_objects = require("./sample_data/web_logs_saved_objects.js");

var _register = require("./maps_telemetry/collectors/register");

var _constants = require("../common/constants");

var _embeddable = require("../common/embeddable");

var _saved_objects = require("./saved_objects");

var _kibana_server_services = require("./kibana_server_services");

var _ems = require("./tutorials/ems");

var _routes = require("./routes");

var _embeddable_migrations = require("./embeddable_migrations");

var _register_integrations = require("./register_integrations");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore
// @ts-ignore
// @ts-ignore


class MapsPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "_initializerContext", void 0);
    (0, _defineProperty2.default)(this, "_logger", void 0);
    this._logger = initializerContext.logger.get();
    this._initializerContext = initializerContext;
  }

  _initHomeData(home, prependBasePath, emsSettings) {
    const sampleDataLinkLabel = _i18n.i18n.translate('xpack.maps.sampleDataLinkLabel', {
      defaultMessage: 'Map'
    });

    home.sampleData.addSavedObjectsToSampleDataset('ecommerce', (0, _ecommerce_saved_objects.getEcommerceSavedObjects)());
    home.sampleData.addAppLinksToSampleDataset('ecommerce', [{
      sampleObject: {
        type: _constants.MAP_SAVED_OBJECT_TYPE,
        id: '2c9c1f60-1909-11e9-919b-ffe5949a18d2'
      },
      getPath: _constants.getFullPath,
      label: sampleDataLinkLabel,
      icon: _constants.APP_ICON
    }]);
    home.sampleData.replacePanelInSampleDatasetDashboard({
      sampleDataId: 'ecommerce',
      dashboardId: '722b74f0-b882-11e8-a6d9-e546fe2bba5f',
      oldEmbeddableId: '9c6f83f0-bb4d-11e8-9c84-77068524bcab',
      embeddableId: '2c9c1f60-1909-11e9-919b-ffe5949a18d2',
      // @ts-ignore
      embeddableType: _constants.MAP_SAVED_OBJECT_TYPE,
      embeddableConfig: {
        isLayerTOCOpen: false,
        hiddenLayers: [],
        mapCenter: {
          lat: 45.88578,
          lon: -15.07605,
          zoom: 2.11
        },
        openTOCDetails: []
      }
    });
    home.sampleData.addSavedObjectsToSampleDataset('flights', (0, _flights_saved_objects.getFlightsSavedObjects)());
    home.sampleData.addAppLinksToSampleDataset('flights', [{
      sampleObject: {
        type: _constants.MAP_SAVED_OBJECT_TYPE,
        id: '5dd88580-1906-11e9-919b-ffe5949a18d2'
      },
      getPath: _constants.getFullPath,
      label: sampleDataLinkLabel,
      icon: _constants.APP_ICON
    }]);
    home.sampleData.replacePanelInSampleDatasetDashboard({
      sampleDataId: 'flights',
      dashboardId: '7adfa750-4c81-11e8-b3d7-01146121b73d',
      oldEmbeddableId: '334084f0-52fd-11e8-a160-89cc2ad9e8e2',
      embeddableId: '5dd88580-1906-11e9-919b-ffe5949a18d2',
      // @ts-ignore
      embeddableType: _constants.MAP_SAVED_OBJECT_TYPE,
      embeddableConfig: {
        isLayerTOCOpen: true,
        hiddenLayers: [],
        mapCenter: {
          lat: 48.72307,
          lon: -115.18171,
          zoom: 4.28
        },
        openTOCDetails: []
      }
    });
    home.sampleData.addSavedObjectsToSampleDataset('logs', (0, _web_logs_saved_objects.getWebLogsSavedObjects)());
    home.sampleData.addAppLinksToSampleDataset('logs', [{
      sampleObject: {
        type: _constants.MAP_SAVED_OBJECT_TYPE,
        id: 'de71f4f0-1902-11e9-919b-ffe5949a18d2'
      },
      getPath: _constants.getFullPath,
      label: sampleDataLinkLabel,
      icon: _constants.APP_ICON
    }]);
    home.sampleData.replacePanelInSampleDatasetDashboard({
      sampleDataId: 'logs',
      dashboardId: 'edf84fe0-e1a0-11e7-b6d5-4dc382ef7f5b',
      oldEmbeddableId: '06cf9c40-9ee8-11e7-8711-e7a007dcef99',
      embeddableId: 'de71f4f0-1902-11e9-919b-ffe5949a18d2',
      // @ts-ignore
      embeddableType: _constants.MAP_SAVED_OBJECT_TYPE,
      embeddableConfig: {
        isLayerTOCOpen: false,
        hiddenLayers: [],
        mapCenter: {
          lat: 42.16337,
          lon: -88.92107,
          zoom: 3.64
        },
        openTOCDetails: []
      }
    });
    home.tutorials.registerTutorial((0, _ems.emsBoundariesSpecProvider)({
      prependBasePath,
      emsLandingPageUrl: emsSettings.getEMSLandingPageUrl()
    }));
  }

  setup(core, plugins) {
    const {
      usageCollection,
      home,
      features,
      customIntegrations
    } = plugins;

    const config$ = this._initializerContext.config.create();

    const emsSettings = plugins.mapsEms.createEMSSettings();
    (0, _routes.initRoutes)(core, this._logger);

    if (home) {
      this._initHomeData(home, core.http.basePath.prepend, emsSettings);
    }

    if (customIntegrations) {
      (0, _register_integrations.registerIntegrations)(core, customIntegrations);
    }

    features.registerKibanaFeature({
      id: _constants.APP_ID,
      name: _i18n.i18n.translate('xpack.maps.featureRegistry.mapsFeatureName', {
        defaultMessage: 'Maps'
      }),
      order: 400,
      category: _server.DEFAULT_APP_CATEGORIES.kibana,
      app: [_constants.APP_ID, 'kibana'],
      catalogue: [_constants.APP_ID],
      privileges: {
        all: {
          app: [_constants.APP_ID, 'kibana'],
          catalogue: [_constants.APP_ID],
          savedObject: {
            all: [_constants.MAP_SAVED_OBJECT_TYPE, 'query'],
            read: ['index-pattern', 'tag']
          },
          ui: ['save', 'show', 'saveQuery']
        },
        read: {
          app: [_constants.APP_ID, 'kibana'],
          catalogue: [_constants.APP_ID],
          savedObject: {
            all: [],
            read: [_constants.MAP_SAVED_OBJECT_TYPE, 'index-pattern', 'query', 'tag']
          },
          ui: ['show']
        }
      }
    });
    core.savedObjects.registerType(_saved_objects.mapsTelemetrySavedObjects);
    core.savedObjects.registerType(_saved_objects.mapSavedObjects);
    (0, _register.registerMapsUsageCollector)(usageCollection);
    plugins.embeddable.registerEmbeddableFactory({
      id: _constants.MAP_SAVED_OBJECT_TYPE,
      migrations: _embeddable_migrations.embeddableMigrations,
      inject: _embeddable.inject,
      extract: _embeddable.extract
    });
    return {
      config: config$
    };
  }

  start(core, plugins) {
    (0, _kibana_server_services.setStartServices)(core, plugins);
  }

}

exports.MapsPlugin = MapsPlugin;