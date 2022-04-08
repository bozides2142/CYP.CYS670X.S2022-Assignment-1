"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.APMPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _operators = require("rxjs/operators");

var _lodash = require("lodash");

var _mapping_from_field_map = require("../../rule_registry/common/mapping_from_field_map");

var _experimental_rule_field_map = require("../../rule_registry/common/assets/field_maps/experimental_rule_field_map");

var _server = require("../../rule_registry/server");

var _ = require(".");

var _common = require("../../../../src/plugins/data/common");

var _feature = require("./feature");

var _register_apm_alerts = require("./routes/alerts/register_apm_alerts");

var _register_fleet_policy_callbacks = require("./routes/fleet/register_fleet_policy_callbacks");

var _apm_telemetry = require("./lib/apm_telemetry");

var _create_apm_event_client = require("./lib/helpers/create_es_client/create_apm_event_client");

var _get_internal_saved_objects_client = require("./lib/helpers/get_internal_saved_objects_client");

var _create_agent_config_index = require("./routes/settings/agent_configuration/create_agent_config_index");

var _get_apm_indices = require("./routes/settings/apm_indices/get_apm_indices");

var _create_custom_link_index = require("./routes/settings/custom_link/create_custom_link_index");

var _saved_objects = require("./saved_objects");

var _register_apm_server_routes = require("./routes/apm_routes/register_apm_server_routes");

var _get_global_apm_server_route_repository = require("./routes/apm_routes/get_global_apm_server_route_repository");

var _elasticsearch_fieldnames = require("../common/elasticsearch_fieldnames");

var _tutorial = require("./tutorial");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class APMPlugin {
  constructor(initContext) {
    (0, _defineProperty2.default)(this, "currentConfig", void 0);
    (0, _defineProperty2.default)(this, "logger", void 0);
    this.initContext = initContext;
    this.initContext = initContext;
  }

  setup(core, plugins) {
    var _resourcePlugins$usag;

    this.logger = this.initContext.logger.get();
    const config$ = this.initContext.config.create();
    core.savedObjects.registerType(_saved_objects.apmIndices);
    core.savedObjects.registerType(_saved_objects.apmTelemetry);
    core.savedObjects.registerType(_saved_objects.apmServerSettings);
    const currentConfig = this.initContext.config.get();
    this.currentConfig = currentConfig;

    if (plugins.taskManager && plugins.usageCollection && currentConfig.telemetryCollectionEnabled) {
      (0, _apm_telemetry.createApmTelemetry)({
        core,
        config$,
        usageCollector: plugins.usageCollection,
        taskManager: plugins.taskManager,
        logger: this.logger,
        kibanaVersion: this.initContext.env.packageInfo.version
      });
    }

    plugins.features.registerKibanaFeature(_feature.APM_FEATURE);
    (0, _feature.registerFeaturesUsage)({
      licensingPlugin: plugins.licensing
    });

    const getCoreStart = () => core.getStartServices().then(([coreStart]) => coreStart);

    const {
      ruleDataService
    } = plugins.ruleRegistry;
    const ruleDataClient = ruleDataService.initializeIndex({
      feature: _.APM_SERVER_FEATURE_ID,
      registrationContext: 'observability.apm',
      dataset: _server.Dataset.alerts,
      componentTemplateRefs: [],
      componentTemplates: [{
        name: 'mappings',
        mappings: (0, _mapping_from_field_map.mappingFromFieldMap)({ ..._experimental_rule_field_map.experimentalRuleFieldMap,
          [_elasticsearch_fieldnames.SERVICE_NAME]: {
            type: 'keyword'
          },
          [_elasticsearch_fieldnames.SERVICE_ENVIRONMENT]: {
            type: 'keyword'
          },
          [_elasticsearch_fieldnames.TRANSACTION_TYPE]: {
            type: 'keyword'
          },
          [_elasticsearch_fieldnames.PROCESSOR_EVENT]: {
            type: 'keyword'
          }
        }, 'strict')
      }]
    });
    const resourcePlugins = (0, _lodash.mapValues)(plugins, (value, key) => {
      return {
        setup: value,
        start: () => core.getStartServices().then(services => {
          const [, pluginsStartContracts] = services;
          return pluginsStartContracts[key];
        })
      };
    });

    const boundGetApmIndices = async () => (0, _get_apm_indices.getApmIndices)({
      savedObjectsClient: await (0, _get_internal_saved_objects_client.getInternalSavedObjectsClient)(core),
      config: await config$.pipe((0, _operators.take)(1)).toPromise()
    });

    boundGetApmIndices().then(indices => {
      var _plugins$home;

      (_plugins$home = plugins.home) === null || _plugins$home === void 0 ? void 0 : _plugins$home.tutorials.registerTutorial((0, _tutorial.tutorialProvider)({
        apmConfig: currentConfig,
        apmIndices: indices,
        cloud: plugins.cloud,
        isFleetPluginEnabled: !(0, _lodash.isEmpty)(resourcePlugins.fleet)
      }));
    });
    const telemetryUsageCounter = (_resourcePlugins$usag = resourcePlugins.usageCollection) === null || _resourcePlugins$usag === void 0 ? void 0 : _resourcePlugins$usag.setup.createUsageCounter(_.APM_SERVER_FEATURE_ID);
    (0, _register_apm_server_routes.registerRoutes)({
      core: {
        setup: core,
        start: getCoreStart
      },
      logger: this.logger,
      config: currentConfig,
      repository: (0, _get_global_apm_server_route_repository.getGlobalApmServerRouteRepository)(),
      ruleDataClient,
      plugins: resourcePlugins,
      telemetryUsageCounter,
      kibanaVersion: this.initContext.env.packageInfo.version
    });

    if (plugins.alerting) {
      (0, _register_apm_alerts.registerApmAlerts)({
        ruleDataClient,
        alerting: plugins.alerting,
        ml: plugins.ml,
        config$,
        logger: this.logger.get('rule')
      });
    }

    (0, _register_fleet_policy_callbacks.registerFleetPolicyCallbacks)({
      plugins: resourcePlugins,
      ruleDataClient,
      config: currentConfig,
      logger: this.logger,
      kibanaVersion: this.initContext.env.packageInfo.version
    });
    return {
      config$,
      getApmIndices: boundGetApmIndices,
      createApmEventClient: async ({
        request,
        context,
        debug
      }) => {
        const [indices, includeFrozen] = await Promise.all([boundGetApmIndices(), context.core.uiSettings.client.get(_common.UI_SETTINGS.SEARCH_INCLUDE_FROZEN)]);
        const esClient = context.core.elasticsearch.client.asCurrentUser;
        return new _create_apm_event_client.APMEventClient({
          debug: debug !== null && debug !== void 0 ? debug : false,
          esClient,
          request,
          indices,
          options: {
            includeFrozen
          }
        });
      }
    };
  }

  start(core) {
    if (this.currentConfig == null || this.logger == null) {
      throw new Error('APMPlugin needs to be setup before calling start()');
    } // create agent configuration index without blocking start lifecycle


    (0, _create_agent_config_index.createApmAgentConfigurationIndex)({
      client: core.elasticsearch.client.asInternalUser,
      config: this.currentConfig,
      logger: this.logger
    }); // create custom action index without blocking start lifecycle

    (0, _create_custom_link_index.createApmCustomLinkIndex)({
      client: core.elasticsearch.client.asInternalUser,
      config: this.currentConfig,
      logger: this.logger
    });
  }

  stop() {}

}

exports.APMPlugin = APMPlugin;