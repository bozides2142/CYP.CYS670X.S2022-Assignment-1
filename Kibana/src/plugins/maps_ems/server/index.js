"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plugin = exports.config = exports.MapsEmsPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _config = require("../config");

var _common = require("../common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const config = {
  exposeToBrowser: {
    tilemap: true,
    includeElasticMapsService: true,
    emsUrl: true,
    emsFileApiUrl: true,
    emsTileApiUrl: true,
    emsLandingPageUrl: true,
    emsFontLibraryUrl: true,
    emsTileLayerId: true
  },
  schema: _config.mapConfigSchema
};
exports.config = config;

class MapsEmsPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "_initializerContext", void 0);
    this._initializerContext = initializerContext;
  }

  setup(core, plugins) {
    const mapConfig = this._initializerContext.config.get();

    let isEnterprisePlus = false;

    if (plugins.licensing) {
      function updateLicenseState(license) {
        const enterprise = license.check(_common.LICENSE_CHECK_ID, 'enterprise');
        isEnterprisePlus = enterprise.state === 'valid';
      }

      plugins.licensing.refresh().then(updateLicenseState);
      plugins.licensing.license$.subscribe(updateLicenseState);
    }

    return {
      config: mapConfig,
      createEMSSettings: () => {
        return new _common.EMSSettings(mapConfig, () => {
          return isEnterprisePlus;
        });
      }
    };
  }

  start() {}

}

exports.MapsEmsPlugin = MapsEmsPlugin;

const plugin = initializerContext => new MapsEmsPlugin(initializerContext);

exports.plugin = plugin;