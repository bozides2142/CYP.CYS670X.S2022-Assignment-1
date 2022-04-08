"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RulesClientFactory = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _rules_client = require("./rules_client");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class RulesClientFactory {
  constructor() {
    (0, _defineProperty2.default)(this, "isInitialized", false);
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "taskManager", void 0);
    (0, _defineProperty2.default)(this, "ruleTypeRegistry", void 0);
    (0, _defineProperty2.default)(this, "securityPluginSetup", void 0);
    (0, _defineProperty2.default)(this, "securityPluginStart", void 0);
    (0, _defineProperty2.default)(this, "getSpaceId", void 0);
    (0, _defineProperty2.default)(this, "spaceIdToNamespace", void 0);
    (0, _defineProperty2.default)(this, "encryptedSavedObjectsClient", void 0);
    (0, _defineProperty2.default)(this, "actions", void 0);
    (0, _defineProperty2.default)(this, "eventLog", void 0);
    (0, _defineProperty2.default)(this, "kibanaVersion", void 0);
    (0, _defineProperty2.default)(this, "authorization", void 0);
    (0, _defineProperty2.default)(this, "eventLogger", void 0);
  }

  initialize(options) {
    if (this.isInitialized) {
      throw new Error('RulesClientFactory already initialized');
    }

    this.isInitialized = true;
    this.logger = options.logger;
    this.getSpaceId = options.getSpaceId;
    this.taskManager = options.taskManager;
    this.ruleTypeRegistry = options.ruleTypeRegistry;
    this.securityPluginSetup = options.securityPluginSetup;
    this.securityPluginStart = options.securityPluginStart;
    this.spaceIdToNamespace = options.spaceIdToNamespace;
    this.encryptedSavedObjectsClient = options.encryptedSavedObjectsClient;
    this.actions = options.actions;
    this.eventLog = options.eventLog;
    this.kibanaVersion = options.kibanaVersion;
    this.authorization = options.authorization;
    this.eventLogger = options.eventLogger;
  }

  create(request, savedObjects) {
    const {
      securityPluginSetup,
      securityPluginStart,
      actions,
      eventLog
    } = this;
    const spaceId = this.getSpaceId(request);

    if (!this.authorization) {
      throw new Error('AlertingAuthorizationClientFactory is not defined');
    }

    return new _rules_client.RulesClient({
      spaceId,
      kibanaVersion: this.kibanaVersion,
      logger: this.logger,
      taskManager: this.taskManager,
      ruleTypeRegistry: this.ruleTypeRegistry,
      unsecuredSavedObjectsClient: savedObjects.getScopedClient(request, {
        excludedWrappers: ['security'],
        includedHiddenTypes: ['alert', 'api_key_pending_invalidation']
      }),
      authorization: this.authorization.create(request),
      actionsAuthorization: actions.getActionsAuthorizationWithRequest(request),
      namespace: this.spaceIdToNamespace(spaceId),
      encryptedSavedObjectsClient: this.encryptedSavedObjectsClient,
      auditLogger: securityPluginSetup === null || securityPluginSetup === void 0 ? void 0 : securityPluginSetup.audit.asScoped(request),

      async getUserName() {
        if (!securityPluginStart) {
          return null;
        }

        const user = await securityPluginStart.authc.getCurrentUser(request);
        return user ? user.username : null;
      },

      async createAPIKey(name) {
        if (!securityPluginStart) {
          return {
            apiKeysEnabled: false
          };
        } // Create an API key using the new grant API - in this case the Kibana system user is creating the
        // API key for the user, instead of having the user create it themselves, which requires api_key
        // privileges


        const createAPIKeyResult = await securityPluginStart.authc.apiKeys.grantAsInternalUser(request, {
          name,
          role_descriptors: {}
        });

        if (!createAPIKeyResult) {
          return {
            apiKeysEnabled: false
          };
        }

        return {
          apiKeysEnabled: true,
          result: createAPIKeyResult
        };
      },

      async getActionsClient() {
        return actions.getActionsClientWithRequest(request);
      },

      async getEventLogClient() {
        return eventLog.getClient(request);
      },

      eventLogger: this.eventLogger
    });
  }

}

exports.RulesClientFactory = RulesClientFactory;