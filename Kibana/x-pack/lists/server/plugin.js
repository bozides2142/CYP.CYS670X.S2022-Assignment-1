"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _init_routes = require("./routes/init_routes");

var _list_client = require("./services/lists/list_client");

var _get_space_id = require("./get_space_id");

var _get_user = require("./get_user");

var _saved_objects = require("./saved_objects");

var _exception_list_client = require("./services/exception_lists/exception_list_client");

var _extension_points = require("./services/extension_points");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class ListPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "config", void 0);
    (0, _defineProperty2.default)(this, "extensionPoints", void 0);
    (0, _defineProperty2.default)(this, "spaces", void 0);
    (0, _defineProperty2.default)(this, "security", void 0);
    (0, _defineProperty2.default)(this, "createRouteHandlerContext", () => {
      return async (context, request) => {
        const {
          spaces,
          config,
          security,
          extensionPoints
        } = this;
        const {
          core: {
            savedObjects: {
              client: savedObjectsClient
            },
            elasticsearch: {
              client: {
                asCurrentUser: esClient
              }
            }
          }
        } = context;

        if (config == null) {
          throw new TypeError('Configuration is required for this plugin to operate');
        } else {
          const spaceId = (0, _get_space_id.getSpaceId)({
            request,
            spaces
          });
          const user = (0, _get_user.getUser)({
            request,
            security
          });
          return {
            getExceptionListClient: () => new _exception_list_client.ExceptionListClient({
              request,
              savedObjectsClient,
              serverExtensionsClient: this.extensionPoints.getClient(),
              user
            }),
            getExtensionPointClient: () => extensionPoints.getClient(),
            getListClient: () => new _list_client.ListClient({
              config,
              esClient,
              spaceId,
              user
            })
          };
        }
      };
    });
    this.initializerContext = initializerContext;
    this.logger = this.initializerContext.logger.get();
    this.config = this.initializerContext.config.get();
    this.extensionPoints = new _extension_points.ExtensionPointStorage(this.logger);
  }

  setup(core) {
    const {
      config
    } = this;
    (0, _saved_objects.initSavedObjects)(core.savedObjects);
    core.http.registerRouteHandlerContext('lists', this.createRouteHandlerContext());
    const router = core.http.createRouter();
    (0, _init_routes.initRoutes)(router, config);
    return {
      getExceptionListClient: (savedObjectsClient, user, enableServerExtensionPoints = true) => {
        return new _exception_list_client.ExceptionListClient({
          enableServerExtensionPoints,
          savedObjectsClient,
          serverExtensionsClient: this.extensionPoints.getClient(),
          user
        });
      },
      getListClient: (esClient, spaceId, user) => {
        return new _list_client.ListClient({
          config,
          esClient,
          spaceId,
          user
        });
      },
      registerExtension: extension => {
        this.extensionPoints.add(extension);
      }
    };
  }

  start(core, plugins) {
    var _plugins$spaces;

    this.logger.debug('Starting plugin');
    this.security = plugins.security;
    this.spaces = (_plugins$spaces = plugins.spaces) === null || _plugins$spaces === void 0 ? void 0 : _plugins$spaces.spacesService;
  }

  stop() {
    this.extensionPoints.clear();
    this.logger.debug('Stopping plugin');
  }

}

exports.ListPlugin = ListPlugin;