"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RemoteClustersServerPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _i18n = require("@kbn/i18n");

var _constants = require("../common/constants");

var _api = require("./routes/api");

var _shared_imports = require("./shared_imports");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class RemoteClustersServerPlugin {
  constructor({
    logger,
    config
  }) {
    (0, _defineProperty2.default)(this, "licenseStatus", void 0);
    (0, _defineProperty2.default)(this, "log", void 0);
    (0, _defineProperty2.default)(this, "config", void 0);
    this.log = logger.get();
    this.config = config.get();
    this.licenseStatus = {
      valid: false
    };
  }

  setup({
    http
  }, {
    features,
    licensing,
    cloud
  }) {
    const router = http.createRouter();
    const routeDependencies = {
      router,
      getLicenseStatus: () => this.licenseStatus,
      config: {
        isCloudEnabled: Boolean(cloud === null || cloud === void 0 ? void 0 : cloud.isCloudEnabled)
      },
      lib: {
        handleEsError: _shared_imports.handleEsError
      }
    };
    features.registerElasticsearchFeature({
      id: 'remote_clusters',
      management: {
        data: ['remote_clusters']
      },
      privileges: [{
        requiredClusterPrivileges: ['manage'],
        ui: []
      }]
    }); // Register routes

    (0, _api.registerGetRoute)(routeDependencies);
    (0, _api.registerAddRoute)(routeDependencies);
    (0, _api.registerUpdateRoute)(routeDependencies);
    (0, _api.registerDeleteRoute)(routeDependencies);
    licensing.license$.subscribe(license => {
      const {
        state,
        message
      } = license.check(_constants.PLUGIN.getI18nName(), _constants.PLUGIN.minimumLicenseType);
      const hasRequiredLicense = state === 'valid';

      if (hasRequiredLicense) {
        this.licenseStatus = {
          valid: true
        };
      } else {
        this.licenseStatus = {
          valid: false,
          message: message || _i18n.i18n.translate('xpack.remoteClusters.licenseCheckErrorMessage', {
            defaultMessage: 'License check failed'
          })
        };

        if (message) {
          this.log.info(message);
        }
      }
    });
    return {
      isUiEnabled: this.config.ui.enabled
    };
  }

  start() {}

  stop() {}

}

exports.RemoteClustersServerPlugin = RemoteClustersServerPlugin;