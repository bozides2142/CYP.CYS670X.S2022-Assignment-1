"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MetricsEntitiesPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _routes = require("./routes");

var _metrics_entities_client = require("./services/metrics_entities_client");

var _delete_transforms = require("./routes/delete_transforms");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class MetricsEntitiesPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "kibanaVersion", void 0);
    (0, _defineProperty2.default)(this, "createRouteHandlerContext", () => {
      return async context => {
        const {
          core: {
            elasticsearch: {
              client: {
                asCurrentUser: esClient
              }
            }
          }
        } = context;
        return {
          getMetricsEntitiesClient: () => new _metrics_entities_client.MetricsEntitiesClient({
            esClient,
            kibanaVersion: this.kibanaVersion,
            logger: this.logger
          })
        };
      };
    });
    this.logger = initializerContext.logger.get();
    this.kibanaVersion = initializerContext.env.packageInfo.version;
  }

  setup(core) {
    const router = core.http.createRouter();
    core.http.registerRouteHandlerContext('metricsEntities', this.createRouteHandlerContext()); // Register server side APIs
    // TODO: Add all of these into a separate file and call that file called init_routes.ts

    (0, _routes.getTransforms)(router);
    (0, _routes.postTransforms)(router);
    (0, _delete_transforms.deleteTransforms)(router);
    return {
      getMetricsEntitiesClient: esClient => new _metrics_entities_client.MetricsEntitiesClient({
        esClient,
        kibanaVersion: this.kibanaVersion,
        logger: this.logger
      })
    };
  } // eslint-disable-next-line @typescript-eslint/no-unused-vars


  start(core) {
    this.logger.debug('Starting plugin');
  }

  stop() {
    this.logger.debug('Stopping plugin');
  }

}

exports.MetricsEntitiesPlugin = MetricsEntitiesPlugin;