"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MonitoringPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _i18n = require("@kbn/i18n");

var _lodash = require("lodash");

var _server = require("../../../../src/core/server");

var _constants = require("../common/constants");

var _alerts = require("./alerts");

var _config = require("./config");

var _instantiate_client = require("./es_client/instantiate_client");

var _kibana_monitoring = require("./kibana_monitoring");

var _collectors = require("./kibana_monitoring/collectors");

var _init_infra_source = require("./lib/logs/init_infra_source");

var _license_service = require("./license_service");

var _routes = require("./routes");

var _static_globals = require("./static_globals");

var _telemetry_collection = require("./telemetry_collection");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// This is used to test the version of kibana


const snapshotRegex = /-snapshot/i;

const wrapError = error => {
  var _error$statusCode;

  const options = {
    statusCode: (_error$statusCode = error.statusCode) !== null && _error$statusCode !== void 0 ? _error$statusCode : 500
  };
  const boom = _boom.default.isBoom(error) ? error : _boom.default.boomify(error, options);
  return {
    body: boom,
    headers: boom.output.headers,
    statusCode: boom.output.statusCode
  };
};

class MonitoringPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "initializerContext", void 0);
    (0, _defineProperty2.default)(this, "log", void 0);
    (0, _defineProperty2.default)(this, "getLogger", void 0);
    (0, _defineProperty2.default)(this, "cluster", {});
    (0, _defineProperty2.default)(this, "licenseService", {});
    (0, _defineProperty2.default)(this, "monitoringCore", {});
    (0, _defineProperty2.default)(this, "legacyShimDependencies", {});
    (0, _defineProperty2.default)(this, "bulkUploader", void 0);
    (0, _defineProperty2.default)(this, "config", void 0);
    (0, _defineProperty2.default)(this, "coreSetup", void 0);
    (0, _defineProperty2.default)(this, "setupPlugins", void 0);
    this.initializerContext = initializerContext;
    this.log = initializerContext.logger.get(_constants.LOGGING_TAG);

    this.getLogger = (...scopes) => initializerContext.logger.get(_constants.LOGGING_TAG, ...scopes);

    this.config = (0, _config.createConfig)(this.initializerContext.config.get());
  }

  setup(coreSetup, plugins) {
    this.coreSetup = coreSetup;
    this.setupPlugins = plugins;
    const serverInfo = coreSetup.http.getServerInfo();
    const kibanaMonitoringLog = this.getLogger(_constants.KIBANA_MONITORING_LOGGING_TAG);
    this.bulkUploader = (0, _kibana_monitoring.initBulkUploader)({
      config: this.config,
      log: kibanaMonitoringLog,
      opsMetrics$: coreSetup.metrics.getOpsMetrics$(),
      statusGetter$: coreSetup.status.overall$,
      kibanaStats: {
        uuid: this.initializerContext.env.instanceUuid,
        name: serverInfo.name,
        index: coreSetup.savedObjects.getKibanaIndex(),
        host: serverInfo.hostname,
        locale: _i18n.i18n.getLocale(),
        port: serverInfo.port.toString(),
        transport_address: `${serverInfo.hostname}:${serverInfo.port}`,
        version: this.initializerContext.env.packageInfo.version,
        snapshot: snapshotRegex.test(this.initializerContext.env.packageInfo.version)
      }
    });

    _static_globals.Globals.init({
      initializerContext: this.initializerContext,
      config: this.config,
      getLogger: this.getLogger,
      log: this.log,
      coreSetup: this.coreSetup,
      setupPlugins: this.setupPlugins
    });

    const alerts = _alerts.AlertsFactory.getAll();

    for (const alert of alerts) {
      var _plugins$alerting;

      (_plugins$alerting = plugins.alerting) === null || _plugins$alerting === void 0 ? void 0 : _plugins$alerting.registerType(alert.getRuleType());
    }

    const config = (0, _config.createConfig)(this.initializerContext.config.get()); // Register collector objects for stats to show up in the APIs

    if (plugins.usageCollection) {
      coreSetup.savedObjects.registerType({
        name: _constants.SAVED_OBJECT_TELEMETRY,
        hidden: true,
        namespaceType: 'agnostic',
        mappings: {
          properties: {
            reportedClusterUuids: {
              type: 'keyword'
            }
          }
        }
      });
      (0, _collectors.registerCollectors)(plugins.usageCollection, config, () => this.cluster);
      (0, _telemetry_collection.registerMonitoringTelemetryCollection)(plugins.usageCollection, () => this.cluster, config.ui.max_bucket_size);
    }

    if (config.ui.enabled) {
      this.registerPluginInUI(plugins);
    }

    return {
      // OSS stats api needs to call this in order to centralize how
      // we fetch kibana specific stats
      getKibanaStats: () => {
        var _this$bulkUploader;

        return ((_this$bulkUploader = this.bulkUploader) === null || _this$bulkUploader === void 0 ? void 0 : _this$bulkUploader.getKibanaStats()) || {};
      }
    };
  }

  init(cluster, coreStart) {
    var _plugins$usageCollect;

    const config = (0, _config.createConfig)(this.initializerContext.config.get());
    const coreSetup = this.coreSetup;
    const plugins = this.setupPlugins;
    const router = coreSetup.http.createRouter(); // const [{ elasticsearch }] = await core.getStartServices();

    this.legacyShimDependencies = {
      router,
      instanceUuid: this.initializerContext.env.instanceUuid,
      esDataClient: coreStart.elasticsearch.client.asInternalUser,
      kibanaStatsCollector: (_plugins$usageCollect = plugins.usageCollection) === null || _plugins$usageCollect === void 0 ? void 0 : _plugins$usageCollect.getCollectorByType(_constants.KIBANA_STATS_TYPE_MONITORING)
    }; // If the UI is enabled, then we want to register it, so it shows up
    // and start any other UI-related setup tasks

    if (config.ui.enabled) {
      // Create our shim which is currently used to power our routing
      this.monitoringCore = this.getLegacyShim(config, coreSetup.getStartServices, cluster, plugins);

      if (config.ui.debug_mode) {
        this.log.info('MONITORING DEBUG MODE: ON');
      }

      (0, _routes.requireUIRoutes)(this.monitoringCore, config, {
        cluster,
        router,
        licenseService: this.licenseService,
        encryptedSavedObjects: plugins.encryptedSavedObjects,
        alerting: plugins.alerting,
        logger: this.log
      });
      (0, _init_infra_source.initInfraSource)(config, plugins.infra);
    }
  }

  start(coreStart, {
    licensing
  }) {
    const config = this.config;
    this.cluster = (0, _instantiate_client.instantiateClient)(config.ui.elasticsearch, this.log, coreStart.elasticsearch.createClient);
    this.init(this.cluster, coreStart); // Start our license service which will ensure
    // the appropriate licenses are present

    this.licenseService = new _license_service.LicenseService().setup({
      licensing,
      monitoringClient: this.cluster,
      config,
      log: this.log
    }); // If collection is enabled, start it

    const kibanaMonitoringLog = this.getLogger(_constants.KIBANA_MONITORING_LOGGING_TAG);
    const kibanaCollectionEnabled = config.kibana.collection.enabled;

    if (kibanaCollectionEnabled) {
      // Do not use `this.licenseService` as that looks at the monitoring cluster
      // whereas we want to check the production cluster here
      if (this.bulkUploader && licensing) {
        licensing.license$.subscribe(license => {
          // use updated xpack license info to start/stop bulk upload
          const mainMonitoring = license.getFeature('monitoring');
          const monitoringBulkEnabled = mainMonitoring && mainMonitoring.isAvailable && mainMonitoring.isEnabled;

          if (monitoringBulkEnabled) {
            var _this$bulkUploader2;

            (_this$bulkUploader2 = this.bulkUploader) === null || _this$bulkUploader2 === void 0 ? void 0 : _this$bulkUploader2.start(coreStart.elasticsearch.client.asInternalUser);
          } else {
            var _this$bulkUploader3;

            (_this$bulkUploader3 = this.bulkUploader) === null || _this$bulkUploader3 === void 0 ? void 0 : _this$bulkUploader3.handleNotEnabled();
          }
        });
      } else {
        kibanaMonitoringLog.warn('Internal collection for Kibana monitoring is disabled due to missing license information.');
      }
    } else {
      kibanaMonitoringLog.info('Internal collection for Kibana monitoring is disabled per configuration.');
    }
  }

  stop() {
    var _this$bulkUploader4;

    if (this.cluster && this.cluster.close) {
      this.cluster.close();
    }

    if (this.licenseService && this.licenseService.stop) {
      this.licenseService.stop();
    }

    (_this$bulkUploader4 = this.bulkUploader) === null || _this$bulkUploader4 === void 0 ? void 0 : _this$bulkUploader4.stop();
  }

  registerPluginInUI(plugins) {
    plugins.features.registerKibanaFeature({
      id: 'monitoring',
      name: _i18n.i18n.translate('xpack.monitoring.featureRegistry.monitoringFeatureName', {
        defaultMessage: 'Stack Monitoring'
      }),
      category: _server.DEFAULT_APP_CATEGORIES.management,
      app: ['monitoring', 'kibana'],
      catalogue: ['monitoring'],
      privileges: null,
      alerting: _constants.RULES,
      reserved: {
        description: _i18n.i18n.translate('xpack.monitoring.feature.reserved.description', {
          defaultMessage: 'To grant users access, you should also assign the monitoring_user role.'
        }),
        privileges: [{
          id: 'monitoring',
          privilege: {
            app: ['monitoring', 'kibana'],
            catalogue: ['monitoring'],
            savedObject: {
              all: [],
              read: []
            },
            alerting: {
              rule: {
                all: _constants.RULES
              },
              alert: {
                all: _constants.RULES
              }
            },
            ui: []
          }
        }]
      }
    });
  }

  getLegacyShim(config, getCoreServices, cluster, setupPlugins) {
    const router = this.legacyShimDependencies.router;
    return {
      config,
      log: this.log,
      route: options => {
        const method = options.method;

        const handler = async (context, req, res) => {
          const plugins = (await getCoreServices())[1];
          const legacyRequest = { ...req,
            logger: this.log,
            getLogger: this.getLogger,
            payload: req.body,
            getKibanaStatsCollector: () => this.legacyShimDependencies.kibanaStatsCollector,
            getUiSettingsService: () => context.core.uiSettings.client,
            getActionTypeRegistry: () => {
              var _context$actions;

              return (_context$actions = context.actions) === null || _context$actions === void 0 ? void 0 : _context$actions.listTypes();
            },
            getRulesClient: () => {
              try {
                return plugins.alerting.getRulesClientWithRequest(req);
              } catch (err) {
                // If security is disabled, this call will throw an error unless a certain config is set for dist builds
                return null;
              }
            },
            getActionsClient: () => {
              try {
                return plugins.actions.getActionsClientWithRequest(req);
              } catch (err) {
                // If security is disabled, this call will throw an error unless a certain config is set for dist builds
                return null;
              }
            },
            server: {
              instanceUuid: this.legacyShimDependencies.instanceUuid,
              log: this.log,
              route: () => {},
              config,
              newPlatform: {
                setup: {
                  plugins: setupPlugins
                }
              },
              plugins: {
                monitoring: {
                  info: {
                    getLicenseService: () => this.licenseService
                  }
                },
                elasticsearch: {
                  getCluster: name => ({
                    callWithRequest: async (_req, endpoint, params) => {
                      const client = name === 'monitoring' ? cluster.asScoped(req).asCurrentUser : context.core.elasticsearch.client.asCurrentUser;
                      return await _static_globals.Globals.app.getLegacyClusterShim(client, endpoint, params);
                    }
                  })
                }
              }
            }
          };

          try {
            const result = await options.handler(legacyRequest);
            return res.ok({
              body: result
            });
          } catch (err) {
            var _err$output;

            const statusCode = ((_err$output = err.output) === null || _err$output === void 0 ? void 0 : _err$output.statusCode) || err.statusCode || err.status || 500;

            if (_boom.default.isBoom(err) || statusCode !== 500) {
              return res.customError({
                statusCode,
                body: err
              });
            }

            throw wrapError(err).body;
          }
        };

        const validate = (0, _lodash.get)(options, 'config.validate', false);

        if (validate && validate.payload) {
          validate.body = validate.payload;
        }

        options.validate = validate;

        if (method === 'POST') {
          router.post(options, handler);
        } else if (method === 'GET') {
          router.get(options, handler);
        } else if (method === 'PUT') {
          router.put(options, handler);
        } else {
          throw new Error('Unsupported API method: ' + method);
        }
      }
    };
  }

}

exports.MonitoringPlugin = MonitoringPlugin;