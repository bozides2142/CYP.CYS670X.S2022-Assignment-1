"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PainlessLabServerPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _i18n = require("@kbn/i18n");

var _constants = require("../common/constants");

var _services = require("./services");

var _api = require("./routes/api");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class PainlessLabServerPlugin {
  constructor({
    logger
  }) {
    (0, _defineProperty2.default)(this, "license", void 0);
    (0, _defineProperty2.default)(this, "logger", void 0);
    this.logger = logger.get();
    this.license = new _services.License();
  }

  setup({
    http
  }, {
    licensing
  }) {
    const router = http.createRouter();
    this.license.setup({
      pluginId: _constants.PLUGIN.id,
      minimumLicenseType: _constants.PLUGIN.minimumLicenseType,
      defaultErrorMessage: _i18n.i18n.translate('xpack.painlessLab.licenseCheckErrorMessage', {
        defaultMessage: 'License check failed'
      })
    }, {
      licensing,
      logger: this.logger
    });
    (0, _api.registerExecuteRoute)({
      router,
      license: this.license
    });
  }

  start() {}

  stop() {}

}

exports.PainlessLabServerPlugin = PainlessLabServerPlugin;