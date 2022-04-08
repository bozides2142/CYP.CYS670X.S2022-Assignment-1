"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CasePlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _constants = require("../common/constants");

var _api = require("./routes/api");

var _saved_object_types = require("./saved_object_types");

var _factory = require("./client/factory");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class CasePlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "log", void 0);
    (0, _defineProperty2.default)(this, "kibanaVersion", void 0);
    (0, _defineProperty2.default)(this, "clientFactory", void 0);
    (0, _defineProperty2.default)(this, "securityPluginSetup", void 0);
    (0, _defineProperty2.default)(this, "lensEmbeddableFactory", void 0);
    (0, _defineProperty2.default)(this, "createRouteHandlerContext", ({
      core
    }) => {
      return async (context, request, response) => {
        return {
          getCasesClient: async () => {
            const [{
              savedObjects
            }] = await core.getStartServices();
            return this.clientFactory.create({
              request,
              scopedClusterClient: context.core.elasticsearch.client.asCurrentUser,
              savedObjectsService: savedObjects
            });
          }
        };
      };
    });
    this.initializerContext = initializerContext;
    this.kibanaVersion = initializerContext.env.packageInfo.version;
    this.log = this.initializerContext.logger.get();
    this.clientFactory = new _factory.CasesClientFactory(this.log);
  }

  setup(core, plugins) {
    this.securityPluginSetup = plugins.security;
    this.lensEmbeddableFactory = plugins.lens.lensEmbeddableFactory;
    core.savedObjects.registerType((0, _saved_object_types.createCaseCommentSavedObjectType)({
      migrationDeps: {
        lensEmbeddableFactory: this.lensEmbeddableFactory
      }
    }));
    core.savedObjects.registerType(_saved_object_types.caseConfigureSavedObjectType);
    core.savedObjects.registerType(_saved_object_types.caseConnectorMappingsSavedObjectType);
    core.savedObjects.registerType((0, _saved_object_types.createCaseSavedObjectType)(core, this.log));
    core.savedObjects.registerType(_saved_object_types.caseUserActionSavedObjectType);
    this.log.debug(`Setting up Case Workflow with core contract [${Object.keys(core)}] and plugins [${Object.keys(plugins)}]`);
    core.http.registerRouteHandlerContext(_constants.APP_ID, this.createRouteHandlerContext({
      core
    }));
    const router = core.http.createRouter();
    (0, _api.initCaseApi)({
      logger: this.log,
      router,
      kibanaVersion: this.kibanaVersion
    });
  }

  start(core, plugins) {
    this.log.debug(`Starting Case Workflow`);
    this.clientFactory.initialize({
      securityPluginSetup: this.securityPluginSetup,
      securityPluginStart: plugins.security,
      getSpace: async request => {
        var _plugins$spaces;

        return (_plugins$spaces = plugins.spaces) === null || _plugins$spaces === void 0 ? void 0 : _plugins$spaces.spacesService.getActiveSpace(request);
      },
      featuresPluginStart: plugins.features,
      actionsPluginStart: plugins.actions,

      /**
       * Lens will be always defined as
       * it is declared as required plugin in kibana.json
       */
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      lensEmbeddableFactory: this.lensEmbeddableFactory
    });
    const client = core.elasticsearch.client;

    const getCasesClientWithRequest = async request => {
      return this.clientFactory.create({
        request,
        scopedClusterClient: client.asScoped(request).asCurrentUser,
        savedObjectsService: core.savedObjects
      });
    };

    return {
      getCasesClientWithRequest
    };
  }

  stop() {
    this.log.debug(`Stopping Case Workflow`);
  }

}

exports.CasePlugin = CasePlugin;