"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IndexLifecycleManagementServerPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _i18n = require("@kbn/i18n");

var _constants = require("../common/constants");

var _routes = require("./routes");

var _services = require("./services");

var _shared_imports = require("./shared_imports");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const indexLifecycleDataEnricher = async (indicesList, client) => {
  if (!indicesList || !indicesList.length) {
    return [];
  }

  const {
    body: {
      indices: ilmIndicesData
    }
  } = await client.asCurrentUser.ilm.explainLifecycle({
    index: '*'
  }); // @ts-expect-error IndexLifecyclePolicy is not compatible with IlmExplainLifecycleResponse

  return indicesList.map(index => {
    return { ...index,
      ilm: { ...(ilmIndicesData[index.name] || {})
      }
    };
  });
};

class IndexLifecycleManagementServerPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "config", void 0);
    (0, _defineProperty2.default)(this, "license", void 0);
    (0, _defineProperty2.default)(this, "logger", void 0);
    this.logger = initializerContext.logger.get();
    this.config = initializerContext.config.get();
    this.license = new _services.License();
  }

  setup({
    http
  }, {
    licensing,
    indexManagement,
    features
  }) {
    const router = http.createRouter();
    const config = this.config;
    this.license.setup({
      pluginId: _constants.PLUGIN.ID,
      minimumLicenseType: _constants.PLUGIN.minimumLicenseType,
      defaultErrorMessage: _i18n.i18n.translate('xpack.indexLifecycleMgmt.licenseCheckErrorMessage', {
        defaultMessage: 'License check failed'
      })
    }, {
      licensing,
      logger: this.logger
    });
    features.registerElasticsearchFeature({
      id: _constants.PLUGIN.ID,
      management: {
        data: [_constants.PLUGIN.ID]
      },
      catalogue: [_constants.PLUGIN.ID],
      privileges: [{
        requiredClusterPrivileges: ['manage_ilm'],
        ui: []
      }]
    });
    (0, _routes.registerApiRoutes)({
      router,
      config,
      license: this.license,
      lib: {
        handleEsError: _shared_imports.handleEsError
      }
    });

    if (config.ui.enabled) {
      if (indexManagement && indexManagement.indexDataEnricher) {
        indexManagement.indexDataEnricher.add(indexLifecycleDataEnricher);
      }
    }
  }

  start() {}

  stop() {}

}

exports.IndexLifecycleManagementServerPlugin = IndexLifecycleManagementServerPlugin;