"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CasesClientFactory = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _constants = require("../../common/constants");

var _authorization = require("../authorization/authorization");

var _services = require("../services");

var _authorization2 = require("../authorization");

var _ = require(".");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * This class handles the logic for creating a CasesClient. We need this because some of the member variables
 * can't be initialized until a plugin's start() method but we need to register the case context in the setup() method.
 */


class CasesClientFactory {
  constructor(logger) {
    (0, _defineProperty2.default)(this, "isInitialized", false);
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "options", void 0);
    this.logger = logger;
  }
  /**
   * This should be called by the plugin's start() method.
   */


  initialize(options) {
    if (this.isInitialized) {
      throw new Error('CasesClientFactory already initialized');
    }

    this.isInitialized = true;
    this.options = options;
  }
  /**
   * Creates a cases client for the current request. This request will be used to authorize the operations done through
   * the client.
   */


  async create({
    request,
    scopedClusterClient,
    savedObjectsService
  }) {
    var _this$options$securit, _this$options$securit2, _this$options, _this$options$securit3;

    if (!this.isInitialized || !this.options) {
      throw new Error('CasesClientFactory must be initialized before calling create');
    }

    const auditLogger = (_this$options$securit = this.options.securityPluginSetup) === null || _this$options$securit === void 0 ? void 0 : _this$options$securit.audit.asScoped(request);
    const auth = await _authorization.Authorization.create({
      request,
      securityAuth: (_this$options$securit2 = this.options.securityPluginStart) === null || _this$options$securit2 === void 0 ? void 0 : _this$options$securit2.authz,
      getSpace: this.options.getSpace,
      features: this.options.featuresPluginStart,
      auditLogger: new _authorization2.AuthorizationAuditLogger(auditLogger),
      logger: this.logger
    });
    const caseService = new _services.CasesService(this.logger, (_this$options = this.options) === null || _this$options === void 0 ? void 0 : (_this$options$securit3 = _this$options.securityPluginStart) === null || _this$options$securit3 === void 0 ? void 0 : _this$options$securit3.authc);
    const userInfo = caseService.getUser({
      request
    });
    return (0, _.createCasesClient)({
      alertsService: new _services.AlertService(scopedClusterClient, this.logger),
      unsecuredSavedObjectsClient: savedObjectsService.getScopedClient(request, {
        includedHiddenTypes: _constants.SAVED_OBJECT_TYPES,
        // this tells the security plugin to not perform SO authorization and audit logging since we are handling
        // that manually using our Authorization class and audit logger.
        excludedWrappers: ['security']
      }),
      // We only want these fields from the userInfo object
      user: {
        username: userInfo.username,
        email: userInfo.email,
        full_name: userInfo.full_name
      },
      caseService,
      caseConfigureService: new _services.CaseConfigureService(this.logger),
      connectorMappingsService: new _services.ConnectorMappingsService(this.logger),
      userActionService: new _services.CaseUserActionService(this.logger),
      attachmentService: new _services.AttachmentService(this.logger),
      logger: this.logger,
      lensEmbeddableFactory: this.options.lensEmbeddableFactory,
      authorization: auth,
      actionsClient: await this.options.actionsPluginStart.getActionsClientWithRequest(request)
    });
  }

}

exports.CasesClientFactory = CasesClientFactory;