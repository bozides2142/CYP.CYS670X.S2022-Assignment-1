"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeprecationsService = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _operators = require("rxjs/operators");

var _deprecations_factory = require("./deprecations_factory");

var _routes = require("./routes");

var _deprecation_config = require("./deprecation_config");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/** @internal */
class DeprecationsService {
  constructor(coreContext) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "configService", void 0);
    (0, _defineProperty2.default)(this, "deprecationsFactory", void 0);
    this.logger = coreContext.logger.get('deprecations-service');
    this.configService = coreContext.configService;
  }

  async setup({
    http
  }) {
    this.logger.debug('Setting up Deprecations service');
    const config = await this.configService.atPath(_deprecation_config.config.path).pipe((0, _operators.take)(1)).toPromise();
    this.deprecationsFactory = new _deprecations_factory.DeprecationsFactory({
      logger: this.logger,
      config: {
        ignoredConfigDeprecations: config.skip_deprecated_settings
      }
    });
    (0, _routes.registerRoutes)({
      http
    });
    this.registerConfigDeprecationsInfo(this.deprecationsFactory);
    const deprecationsFactory = this.deprecationsFactory;
    return {
      getRegistry: domainId => {
        const registry = deprecationsFactory.getRegistry(domainId);
        return {
          registerDeprecations: registry.registerDeprecations
        };
      }
    };
  }

  start() {
    if (!this.deprecationsFactory) {
      throw new Error('`setup` must be called before `start`');
    }

    return {
      asScopedToClient: this.createScopedDeprecations()
    };
  }

  stop() {}

  createScopedDeprecations() {
    return (esClient, savedObjectsClient) => {
      return {
        getAllDeprecations: this.deprecationsFactory.getAllDeprecations.bind(null, {
          savedObjectsClient,
          esClient
        })
      };
    };
  }

  registerConfigDeprecationsInfo(deprecationsFactory) {
    const handledDeprecatedConfigs = this.configService.getHandledDeprecatedConfigs();

    for (const [domainId, deprecationsContexts] of handledDeprecatedConfigs) {
      const deprecationsRegistry = deprecationsFactory.getRegistry(domainId);
      deprecationsRegistry.registerDeprecations({
        getDeprecations: () => {
          return deprecationsContexts.map(({
            configPath,
            title = `${domainId} has a deprecated setting`,
            level,
            message,
            correctiveActions,
            documentationUrl
          }) => ({
            configPath,
            title,
            level,
            message,
            correctiveActions,
            documentationUrl,
            deprecationType: 'config',
            requireRestart: true
          }));
        }
      });
    }
  }

}

exports.DeprecationsService = DeprecationsService;