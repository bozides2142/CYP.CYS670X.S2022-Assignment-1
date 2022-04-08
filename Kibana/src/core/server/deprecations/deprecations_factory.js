"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeprecationsFactory = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _i18n = require("@kbn/i18n");

var _deprecations_registry = require("./deprecations_registry");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class DeprecationsFactory {
  constructor({
    logger,
    config
  }) {
    (0, _defineProperty2.default)(this, "registries", new Map());
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "config", void 0);
    (0, _defineProperty2.default)(this, "getRegistry", domainId => {
      const existing = this.registries.get(domainId);

      if (existing) {
        return existing;
      }

      const registry = new _deprecations_registry.DeprecationsRegistry();
      this.registries.set(domainId, registry);
      return registry;
    });
    (0, _defineProperty2.default)(this, "getDeprecations", async (domainId, dependencies) => {
      const infoBody = await this.getDeprecationsBody(domainId, dependencies);
      return this.createDeprecationInfo(domainId, infoBody);
    });
    (0, _defineProperty2.default)(this, "getAllDeprecations", async dependencies => {
      const domainIds = [...this.registries.keys()];
      const deprecationsInfo = await Promise.all(domainIds.map(async domainId => {
        const infoBody = await this.getDeprecationsBody(domainId, dependencies);
        return this.createDeprecationInfo(domainId, infoBody);
      }));
      return deprecationsInfo.flat();
    });
    (0, _defineProperty2.default)(this, "createDeprecationInfo", (domainId, deprecationInfoBody) => {
      return deprecationInfoBody.map(pluginDeprecation => ({ ...pluginDeprecation,
        domainId
      }));
    });
    (0, _defineProperty2.default)(this, "getDeprecationsBody", async (domainId, dependencies) => {
      const deprecationsRegistry = this.registries.get(domainId);

      if (!deprecationsRegistry) {
        return [];
      }

      try {
        const settledResults = await deprecationsRegistry.getDeprecations(dependencies);
        return settledResults.flatMap(settledResult => {
          if (settledResult.status === 'rejected') {
            this.logger.warn(`Failed to get deprecations info for plugin "${domainId}".`, settledResult.reason);
            return [{
              title: _i18n.i18n.translate('core.deprecations.deprecations.fetchFailedTitle', {
                defaultMessage: `Failed to fetch deprecations for {domainId}`,
                values: {
                  domainId
                }
              }),
              message: _i18n.i18n.translate('core.deprecations.deprecations.fetchFailedMessage', {
                defaultMessage: 'Unable to fetch deprecations info for plugin {domainId}.',
                values: {
                  domainId
                }
              }),
              level: 'fetch_error',
              correctiveActions: {
                manualSteps: [_i18n.i18n.translate('core.deprecations.deprecations.fetchFailed.manualStepOneMessage', {
                  defaultMessage: 'Check Kibana server logs for error message.'
                })]
              }
            }];
          }

          return filterIgnoredDeprecations(settledResult.value.flat(), this.config);
        });
      } catch (err) {
        this.logger.warn(`Failed to get deprecations info for plugin "${domainId}".`, err);
        return [];
      }
    });
    this.logger = logger;
    this.config = config;
  }

}

exports.DeprecationsFactory = DeprecationsFactory;

const filterIgnoredDeprecations = (deprecations, config) => {
  return deprecations.filter(deprecation => {
    if (deprecation.deprecationType === 'config') {
      return !config.ignoredConfigDeprecations.includes(deprecation.configPath);
    }

    return true;
  });
};