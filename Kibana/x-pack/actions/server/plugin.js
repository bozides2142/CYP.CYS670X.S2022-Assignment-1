"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ActionsPlugin = void 0;
exports.renderActionParameterTemplates = renderActionParameterTemplates;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _cleanup_failed_executions = require("./cleanup_failed_executions");

var _config = require("./config");

var _custom_host_settings = require("./lib/custom_host_settings");

var _actions_client = require("./actions_client");

var _action_type_registry = require("./action_type_registry");

var _create_execute_function = require("./create_execute_function");

var _builtin_action_types = require("./builtin_action_types");

var _usage = require("./usage");

var _lib = require("./lib");

var _actions_config = require("./actions_config");

var _routes = require("./routes");

var _task = require("./usage/task");

var _saved_objects = require("./constants/saved_objects");

var _saved_objects2 = require("./saved_objects");

var _feature = require("./feature");

var _actions_authorization = require("./authorization/actions_authorization");

var _get_authorization_mode_by_source = require("./authorization/get_authorization_mode_by_source");

var _ensure_sufficient_license = require("./lib/ensure_sufficient_license");

var _mustache_renderer = require("./lib/mustache_renderer");

var _alert_history_es_index = require("./preconfigured_connectors/alert_history_es_index/alert_history_es_index");

var _create_alert_history_index_template = require("./preconfigured_connectors/alert_history_es_index/create_alert_history_index_template");

var _common = require("../common");

var _event_log = require("./constants/event_log");

var _connector_token_client = require("./builtin_action_types/lib/connector_token_client");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const includedHiddenTypes = [_saved_objects.ACTION_SAVED_OBJECT_TYPE, _saved_objects.ACTION_TASK_PARAMS_SAVED_OBJECT_TYPE, _saved_objects.ALERT_SAVED_OBJECT_TYPE, _saved_objects.CONNECTOR_TOKEN_SAVED_OBJECT_TYPE];

class ActionsPlugin {
  constructor(initContext) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "actionsConfig", void 0);
    (0, _defineProperty2.default)(this, "taskRunnerFactory", void 0);
    (0, _defineProperty2.default)(this, "actionTypeRegistry", void 0);
    (0, _defineProperty2.default)(this, "actionExecutor", void 0);
    (0, _defineProperty2.default)(this, "licenseState", null);
    (0, _defineProperty2.default)(this, "security", void 0);
    (0, _defineProperty2.default)(this, "eventLogService", void 0);
    (0, _defineProperty2.default)(this, "eventLogger", void 0);
    (0, _defineProperty2.default)(this, "isESOCanEncrypt", void 0);
    (0, _defineProperty2.default)(this, "usageCounter", void 0);
    (0, _defineProperty2.default)(this, "telemetryLogger", void 0);
    (0, _defineProperty2.default)(this, "preconfiguredActions", void 0);
    (0, _defineProperty2.default)(this, "kibanaIndex", void 0);
    (0, _defineProperty2.default)(this, "getUnsecuredSavedObjectsClient", (savedObjects, request) => savedObjects.getScopedClient(request, {
      excludedWrappers: ['security'],
      includedHiddenTypes
    }));
    (0, _defineProperty2.default)(this, "instantiateAuthorization", (request, authorizationMode) => {
      var _this$security, _this$security2;

      return new _actions_authorization.ActionsAuthorization({
        request,
        authorizationMode,
        authorization: (_this$security = this.security) === null || _this$security === void 0 ? void 0 : _this$security.authz,
        authentication: (_this$security2 = this.security) === null || _this$security2 === void 0 ? void 0 : _this$security2.authc
      });
    });
    (0, _defineProperty2.default)(this, "createRouteHandlerContext", (core, defaultKibanaIndex) => {
      const {
        actionTypeRegistry,
        isESOCanEncrypt,
        preconfiguredActions,
        actionExecutor,
        instantiateAuthorization,
        security,
        usageCounter,
        logger
      } = this;
      return async function actionsRouteHandlerContext(context, request) {
        const [{
          savedObjects
        }, {
          taskManager,
          encryptedSavedObjects
        }] = await core.getStartServices();
        return {
          getActionsClient: () => {
            if (isESOCanEncrypt !== true) {
              throw new Error(`Unable to create actions client because the Encrypted Saved Objects plugin is missing encryption key. Please set xpack.encryptedSavedObjects.encryptionKey in the kibana.yml or use the bin/kibana-encryption-keys command.`);
            }

            const unsecuredSavedObjectsClient = savedObjects.getScopedClient(request, {
              excludedWrappers: ['security'],
              includedHiddenTypes
            });
            return new _actions_client.ActionsClient({
              unsecuredSavedObjectsClient,
              actionTypeRegistry: actionTypeRegistry,
              defaultKibanaIndex,
              scopedClusterClient: context.core.elasticsearch.client,
              preconfiguredActions,
              request,
              authorization: instantiateAuthorization(request),
              actionExecutor: actionExecutor,
              ephemeralExecutionEnqueuer: (0, _create_execute_function.createEphemeralExecutionEnqueuerFunction)({
                taskManager,
                actionTypeRegistry: actionTypeRegistry,
                isESOCanEncrypt: isESOCanEncrypt,
                preconfiguredActions
              }),
              executionEnqueuer: (0, _create_execute_function.createExecutionEnqueuerFunction)({
                taskManager,
                actionTypeRegistry: actionTypeRegistry,
                isESOCanEncrypt: isESOCanEncrypt,
                preconfiguredActions
              }),
              auditLogger: security === null || security === void 0 ? void 0 : security.audit.asScoped(request),
              usageCounter,
              connectorTokenClient: new _connector_token_client.ConnectorTokenClient({
                unsecuredSavedObjectsClient,
                encryptedSavedObjectsClient: encryptedSavedObjects.getClient({
                  includedHiddenTypes
                }),
                logger
              })
            });
          },
          listTypes: actionTypeRegistry.list.bind(actionTypeRegistry)
        };
      };
    });
    this.logger = initContext.logger.get();
    this.actionsConfig = (0, _config.getValidatedConfig)(this.logger, (0, _custom_host_settings.resolveCustomHosts)(this.logger, initContext.config.get()));
    this.telemetryLogger = initContext.logger.get('usage');
    this.preconfiguredActions = [];
  }

  setup(core, plugins) {
    var _plugins$usageCollect;

    this.kibanaIndex = core.savedObjects.getKibanaIndex();
    this.licenseState = new _lib.LicenseState(plugins.licensing.license$);
    this.isESOCanEncrypt = plugins.encryptedSavedObjects.canEncrypt;

    if (!this.isESOCanEncrypt) {
      this.logger.warn('APIs are disabled because the Encrypted Saved Objects plugin is missing encryption key. Please set xpack.encryptedSavedObjects.encryptionKey in the kibana.yml or use the bin/kibana-encryption-keys command.');
    }

    plugins.features.registerKibanaFeature(_feature.ACTIONS_FEATURE);
    this.eventLogService = plugins.eventLog;
    plugins.eventLog.registerProviderActions(_event_log.EVENT_LOG_PROVIDER, Object.values(_event_log.EVENT_LOG_ACTIONS));
    this.eventLogger = plugins.eventLog.getLogger({
      event: {
        provider: _event_log.EVENT_LOG_PROVIDER
      }
    });
    const actionExecutor = new _lib.ActionExecutor({
      isESOCanEncrypt: this.isESOCanEncrypt
    }); // get executions count

    const taskRunnerFactory = new _lib.TaskRunnerFactory(actionExecutor);
    const actionsConfigUtils = (0, _actions_config.getActionsConfigurationUtilities)(this.actionsConfig);

    if (this.actionsConfig.preconfiguredAlertHistoryEsIndex) {
      this.preconfiguredActions.push((0, _alert_history_es_index.getAlertHistoryEsIndex)());
    }

    for (const preconfiguredId of Object.keys(this.actionsConfig.preconfigured)) {
      if (preconfiguredId !== _common.AlertHistoryEsIndexConnectorId) {
        this.preconfiguredActions.push({ ...this.actionsConfig.preconfigured[preconfiguredId],
          id: preconfiguredId,
          isPreconfigured: true
        });
      } else {
        this.logger.warn(`Preconfigured connectors cannot have the id "${_common.AlertHistoryEsIndexConnectorId}" because this is a reserved id.`);
      }
    }

    const actionTypeRegistry = new _action_type_registry.ActionTypeRegistry({
      licensing: plugins.licensing,
      taskRunnerFactory,
      taskManager: plugins.taskManager,
      actionsConfigUtils,
      licenseState: this.licenseState,
      preconfiguredActions: this.preconfiguredActions
    });
    this.taskRunnerFactory = taskRunnerFactory;
    this.actionTypeRegistry = actionTypeRegistry;
    this.actionExecutor = actionExecutor;
    this.security = plugins.security;
    (0, _saved_objects2.setupSavedObjects)(core.savedObjects, plugins.encryptedSavedObjects, this.actionTypeRegistry, plugins.taskManager.index, this.preconfiguredActions);
    (0, _builtin_action_types.registerBuiltInActionTypes)({
      logger: this.logger,
      actionTypeRegistry,
      actionsConfigUtils,
      publicBaseUrl: core.http.basePath.publicBaseUrl
    });
    const usageCollection = plugins.usageCollection;

    if (usageCollection) {
      (0, _usage.registerActionsUsageCollector)(usageCollection, this.actionsConfig, core.getStartServices().then(([_, {
        taskManager
      }]) => taskManager));
    }

    core.http.registerRouteHandlerContext('actions', this.createRouteHandlerContext(core, this.kibanaIndex));

    if (usageCollection) {
      const eventLogIndex = this.eventLogService.getIndexPattern();
      const kibanaIndex = this.kibanaIndex;
      (0, _task.initializeActionsTelemetry)(this.telemetryLogger, plugins.taskManager, core, kibanaIndex, this.preconfiguredActions, eventLogIndex);
    } // Usage counter for telemetry


    this.usageCounter = (_plugins$usageCollect = plugins.usageCollection) === null || _plugins$usageCollect === void 0 ? void 0 : _plugins$usageCollect.createUsageCounter(_common.ACTIONS_FEATURE_ID); // Routes

    (0, _routes.defineRoutes)(core.http.createRouter(), this.licenseState, this.usageCounter); // Cleanup failed execution task definition

    if (this.actionsConfig.cleanupFailedExecutionsTask.enabled) {
      (0, _cleanup_failed_executions.registerCleanupFailedExecutionsTaskDefinition)(plugins.taskManager, {
        actionTypeRegistry,
        logger: this.logger,
        coreStartServices: core.getStartServices(),
        config: this.actionsConfig.cleanupFailedExecutionsTask,
        kibanaIndex: this.kibanaIndex,
        taskManagerIndex: plugins.taskManager.index
      });
    }

    return {
      registerType: actionType => {
        (0, _ensure_sufficient_license.ensureSufficientLicense)(actionType);
        actionTypeRegistry.register(actionType);
      },
      isPreconfiguredConnector: connectorId => {
        return !!this.preconfiguredActions.find(preconfigured => preconfigured.id === connectorId);
      }
    };
  }

  start(core, plugins) {
    var _plugins$spaces;

    const {
      logger,
      licenseState,
      actionExecutor,
      actionTypeRegistry,
      taskRunnerFactory,
      kibanaIndex,
      isESOCanEncrypt,
      preconfiguredActions,
      instantiateAuthorization,
      getUnsecuredSavedObjectsClient
    } = this;
    licenseState === null || licenseState === void 0 ? void 0 : licenseState.setNotifyUsage(plugins.licensing.featureUsage.notifyUsage);
    const encryptedSavedObjectsClient = plugins.encryptedSavedObjects.getClient({
      includedHiddenTypes
    });

    const getActionsClientWithRequest = async (request, authorizationContext) => {
      var _this$security3;

      if (isESOCanEncrypt !== true) {
        throw new Error(`Unable to create actions client because the Encrypted Saved Objects plugin is missing encryption key. Please set xpack.encryptedSavedObjects.encryptionKey in the kibana.yml or use the bin/kibana-encryption-keys command.`);
      }

      const unsecuredSavedObjectsClient = getUnsecuredSavedObjectsClient(core.savedObjects, request);
      return new _actions_client.ActionsClient({
        unsecuredSavedObjectsClient,
        actionTypeRegistry: actionTypeRegistry,
        defaultKibanaIndex: kibanaIndex,
        scopedClusterClient: core.elasticsearch.client.asScoped(request),
        preconfiguredActions,
        request,
        authorization: instantiateAuthorization(request, await (0, _get_authorization_mode_by_source.getAuthorizationModeBySource)(unsecuredSavedObjectsClient, authorizationContext)),
        actionExecutor: actionExecutor,
        ephemeralExecutionEnqueuer: (0, _create_execute_function.createEphemeralExecutionEnqueuerFunction)({
          taskManager: plugins.taskManager,
          actionTypeRegistry: actionTypeRegistry,
          isESOCanEncrypt: isESOCanEncrypt,
          preconfiguredActions
        }),
        executionEnqueuer: (0, _create_execute_function.createExecutionEnqueuerFunction)({
          taskManager: plugins.taskManager,
          actionTypeRegistry: actionTypeRegistry,
          isESOCanEncrypt: isESOCanEncrypt,
          preconfiguredActions
        }),
        auditLogger: (_this$security3 = this.security) === null || _this$security3 === void 0 ? void 0 : _this$security3.audit.asScoped(request),
        usageCounter: this.usageCounter,
        connectorTokenClient: new _connector_token_client.ConnectorTokenClient({
          unsecuredSavedObjectsClient,
          encryptedSavedObjectsClient,
          logger: this.logger
        })
      });
    }; // Ensure the public API cannot be used to circumvent authorization
    // using our legacy exemption mechanism by passing in a legacy SO
    // as authorizationContext which would then set a Legacy AuthorizationMode


    const secureGetActionsClientWithRequest = request => getActionsClientWithRequest(request);

    this.eventLogService.registerSavedObjectProvider('action', request => {
      const client = secureGetActionsClientWithRequest(request);
      return objects => objects ? Promise.all(objects.map(async objectItem => await (await client).get({
        id: objectItem.id
      }))) : Promise.resolve([]);
    });

    const getScopedSavedObjectsClientWithoutAccessToActions = request => core.savedObjects.getScopedClient(request);

    actionExecutor.initialize({
      logger,
      eventLogger: this.eventLogger,
      spaces: (_plugins$spaces = plugins.spaces) === null || _plugins$spaces === void 0 ? void 0 : _plugins$spaces.spacesService,
      getActionsClientWithRequest,
      getServices: this.getServicesFactory(getScopedSavedObjectsClientWithoutAccessToActions, core.elasticsearch, encryptedSavedObjectsClient, request => this.getUnsecuredSavedObjectsClient(core.savedObjects, request)),
      encryptedSavedObjectsClient,
      actionTypeRegistry: actionTypeRegistry,
      preconfiguredActions
    });
    taskRunnerFactory.initialize({
      logger,
      actionTypeRegistry: actionTypeRegistry,
      encryptedSavedObjectsClient,
      basePathService: core.http.basePath,
      spaceIdToNamespace: spaceId => (0, _lib.spaceIdToNamespace)(plugins.spaces, spaceId),
      getUnsecuredSavedObjectsClient: request => this.getUnsecuredSavedObjectsClient(core.savedObjects, request)
    });
    this.eventLogService.isEsContextReady().then(() => {
      (0, _task.scheduleActionsTelemetry)(this.telemetryLogger, plugins.taskManager);
    });

    if (this.actionsConfig.preconfiguredAlertHistoryEsIndex) {
      (0, _create_alert_history_index_template.createAlertHistoryIndexTemplate)({
        client: core.elasticsearch.client.asInternalUser,
        logger: this.logger
      });
    } // Cleanup failed execution task


    if (this.actionsConfig.cleanupFailedExecutionsTask.enabled) {
      (0, _cleanup_failed_executions.ensureCleanupFailedExecutionsTaskScheduled)(plugins.taskManager, this.logger, this.actionsConfig.cleanupFailedExecutionsTask);
    }

    return {
      isActionTypeEnabled: (id, options = {
        notifyUsage: false
      }) => {
        return this.actionTypeRegistry.isActionTypeEnabled(id, options);
      },
      isActionExecutable: (actionId, actionTypeId, options = {
        notifyUsage: false
      }) => {
        return this.actionTypeRegistry.isActionExecutable(actionId, actionTypeId, options);
      },

      getActionsAuthorizationWithRequest(request) {
        return instantiateAuthorization(request);
      },

      getActionsClientWithRequest: secureGetActionsClientWithRequest,
      preconfiguredActions,
      renderActionParameterTemplates: (...args) => renderActionParameterTemplates(actionTypeRegistry, ...args)
    };
  }

  getServicesFactory(getScopedClient, elasticsearch, encryptedSavedObjectsClient, unsecuredSavedObjectsClient) {
    return request => {
      return {
        savedObjectsClient: getScopedClient(request),
        scopedClusterClient: elasticsearch.client.asScoped(request).asCurrentUser,
        connectorTokenClient: new _connector_token_client.ConnectorTokenClient({
          unsecuredSavedObjectsClient: unsecuredSavedObjectsClient(request),
          encryptedSavedObjectsClient,
          logger: this.logger
        })
      };
    };
  }

  stop() {
    if (this.licenseState) {
      this.licenseState.clean();
    }
  }

}

exports.ActionsPlugin = ActionsPlugin;

function renderActionParameterTemplates(actionTypeRegistry, actionTypeId, actionId, params, variables) {
  const actionType = actionTypeRegistry === null || actionTypeRegistry === void 0 ? void 0 : actionTypeRegistry.get(actionTypeId);

  if (actionType !== null && actionType !== void 0 && actionType.renderParameterTemplates) {
    return actionType.renderParameterTemplates(params, variables, actionId);
  } else {
    return (0, _mustache_renderer.renderMustacheObject)(params, variables);
  }
}