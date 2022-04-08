"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MlServerPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _i18n = require("@kbn/i18n");

var _server = require("../../../../src/core/server");

var _app = require("../common/constants/app");

var _log = require("./lib/log");

var _sample_data_sets = require("./lib/sample_data_sets");

var _annotations = require("./routes/annotations");

var _calendars = require("./routes/calendars");

var _datafeeds = require("./routes/datafeeds");

var _data_frame_analytics = require("./routes/data_frame_analytics");

var _modules = require("./routes/modules");

var _data_visualizer = require("./routes/data_visualizer");

var _fields_service = require("./routes/fields_service");

var _filters = require("./routes/filters");

var _indices = require("./routes/indices");

var _job_audit_messages = require("./routes/job_audit_messages");

var _anomaly_detectors = require("./routes/anomaly_detectors");

var _job_service = require("./routes/job_service");

var _saved_objects = require("./routes/saved_objects");

var _job_validation = require("./routes/job_validation");

var _results_service = require("./routes/results_service");

var _system = require("./routes/system");

var _license = require("../common/license");

var _shared_services = require("./shared_services");

var _capabilities = require("../common/types/capabilities");

var _capabilities2 = require("./lib/capabilities");

var _register_settings = require("./lib/register_settings");

var _trained_models = require("./routes/trained_models");

var _saved_objects2 = require("./saved_objects");

var _route_guard = require("./lib/route_guard");

var _register_ml_alerts = require("./lib/alerts/register_ml_alerts");

var _alerts = require("../common/constants/alerts");

var _alerting = require("./routes/alerting");

var _usage = require("./usage");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class MlServerPlugin {
  constructor(ctx) {
    (0, _defineProperty2.default)(this, "log", void 0);
    (0, _defineProperty2.default)(this, "mlLicense", void 0);
    (0, _defineProperty2.default)(this, "capabilities", null);
    (0, _defineProperty2.default)(this, "clusterClient", null);
    (0, _defineProperty2.default)(this, "fieldsFormat", null);
    (0, _defineProperty2.default)(this, "uiSettings", null);
    (0, _defineProperty2.default)(this, "savedObjectsStart", null);
    (0, _defineProperty2.default)(this, "spacesPlugin", void 0);
    (0, _defineProperty2.default)(this, "security", void 0);
    (0, _defineProperty2.default)(this, "dataViews", null);
    (0, _defineProperty2.default)(this, "isMlReady", void 0);
    (0, _defineProperty2.default)(this, "setMlReady", () => {});
    this.log = ctx.logger.get();
    this.mlLicense = new _license.MlLicense();
    this.isMlReady = new Promise(resolve => this.setMlReady = resolve);
  }

  setup(coreSetup, plugins) {
    var _plugins$security, _plugins$security2;

    this.spacesPlugin = plugins.spaces;
    this.security = plugins.security;
    const {
      admin,
      user,
      apmUser
    } = (0, _capabilities.getPluginPrivileges)();
    plugins.features.registerKibanaFeature({
      id: _app.PLUGIN_ID,
      name: _i18n.i18n.translate('xpack.ml.featureRegistry.mlFeatureName', {
        defaultMessage: 'Machine Learning'
      }),
      order: 500,
      category: _server.DEFAULT_APP_CATEGORIES.kibana,
      app: [_app.PLUGIN_ID, 'kibana'],
      catalogue: [_app.PLUGIN_ID, `${_app.PLUGIN_ID}_file_data_visualizer`],
      management: {
        insightsAndAlerting: ['jobsListLink']
      },
      alerting: Object.values(_alerts.ML_ALERT_TYPES),
      privileges: {
        all: admin,
        read: user
      },
      reserved: {
        description: _i18n.i18n.translate('xpack.ml.feature.reserved.description', {
          defaultMessage: 'To grant users access, you should also assign either the machine_learning_user or machine_learning_admin role.'
        }),
        privileges: [{
          id: 'ml_user',
          privilege: user
        }, {
          id: 'ml_admin',
          privilege: admin
        }, {
          id: 'ml_apm_user',
          privilege: apmUser
        }]
      }
    });
    (0, _register_settings.registerKibanaSettings)(coreSetup);
    this.mlLicense.setup(plugins.licensing.license$, [mlLicense => (0, _sample_data_sets.initSampleDataSets)(mlLicense, plugins)]); // initialize capabilities switcher to add license filter to ml capabilities

    (0, _capabilities2.setupCapabilitiesSwitcher)(coreSetup, plugins.licensing.license$, this.log);
    (0, _saved_objects2.setupSavedObjects)(coreSetup.savedObjects);
    const {
      getInternalSavedObjectsClient,
      getMlSavedObjectsClient
    } = (0, _saved_objects2.savedObjectClientsFactory)(() => this.savedObjectsStart);
    const getSpaces = plugins.spaces ? () => coreSetup.getStartServices().then(([, {
      spaces
    }]) => spaces) : undefined;

    const getDataViews = () => {
      if (this.dataViews === null) {
        throw Error('Data views plugin not initialized');
      }

      return this.dataViews;
    };

    const resolveMlCapabilities = async request => {
      if (this.capabilities === null) {
        return null;
      }

      const capabilities = await this.capabilities.resolveCapabilities(request);
      return capabilities.ml;
    };

    const {
      internalServicesProviders,
      sharedServicesProviders
    } = (0, _shared_services.createSharedServices)(this.mlLicense, getSpaces, plugins.cloud, (_plugins$security = plugins.security) === null || _plugins$security === void 0 ? void 0 : _plugins$security.authz, resolveMlCapabilities, () => this.clusterClient, () => getInternalSavedObjectsClient(), () => this.uiSettings, () => this.fieldsFormat, getDataViews, () => this.isMlReady);
    const routeInit = {
      router: coreSetup.http.createRouter(),
      routeGuard: new _route_guard.RouteGuard(this.mlLicense, getMlSavedObjectsClient, getInternalSavedObjectsClient, plugins.spaces, (_plugins$security2 = plugins.security) === null || _plugins$security2 === void 0 ? void 0 : _plugins$security2.authz, () => this.isMlReady, () => this.dataViews),
      mlLicense: this.mlLicense
    };
    (0, _annotations.annotationRoutes)(routeInit, plugins.security);
    (0, _calendars.calendars)(routeInit);
    (0, _datafeeds.dataFeedRoutes)(routeInit);
    (0, _data_frame_analytics.dataFrameAnalyticsRoutes)(routeInit);
    (0, _modules.dataRecognizer)(routeInit);
    (0, _data_visualizer.dataVisualizerRoutes)(routeInit);
    (0, _fields_service.fieldsService)(routeInit);
    (0, _filters.filtersRoutes)(routeInit);
    (0, _indices.indicesRoutes)(routeInit);
    (0, _job_audit_messages.jobAuditMessagesRoutes)(routeInit);
    (0, _anomaly_detectors.jobRoutes)(routeInit);
    (0, _job_service.jobServiceRoutes)(routeInit);
    (0, _results_service.resultsServiceRoutes)(routeInit);
    (0, _job_validation.jobValidationRoutes)(routeInit);
    (0, _saved_objects.savedObjectsRoutes)(routeInit, {
      getSpaces,
      resolveMlCapabilities
    });
    (0, _system.systemRoutes)(routeInit, {
      getSpaces,
      cloud: plugins.cloud,
      resolveMlCapabilities
    });
    (0, _trained_models.trainedModelsRoutes)(routeInit);
    (0, _alerting.alertingRoutes)(routeInit, sharedServicesProviders);
    (0, _log.initMlServerLog)({
      log: this.log
    });

    if (plugins.alerting) {
      (0, _register_ml_alerts.registerMlAlerts)({
        alerting: plugins.alerting,
        logger: this.log,
        mlSharedServices: sharedServicesProviders,
        mlServicesProviders: internalServicesProviders
      });
    }

    if (plugins.usageCollection) {
      (0, _usage.registerCollector)(plugins.usageCollection, coreSetup.savedObjects.getKibanaIndex());
    }

    return sharedServicesProviders;
  }

  start(coreStart, plugins) {
    this.uiSettings = coreStart.uiSettings;
    this.fieldsFormat = plugins.fieldFormats;
    this.capabilities = coreStart.capabilities;
    this.clusterClient = coreStart.elasticsearch.client;
    this.savedObjectsStart = coreStart.savedObjects;
    this.dataViews = plugins.dataViews; // check whether the job saved objects exist
    // and create them if needed.

    const {
      initializeJobs
    } = (0, _saved_objects2.jobSavedObjectsInitializationFactory)(coreStart, this.security, this.spacesPlugin !== undefined);
    initializeJobs().finally(() => {
      this.setMlReady();
    });
  }

  stop() {
    this.mlLicense.unsubscribe();
  }

}

exports.MlServerPlugin = MlServerPlugin;