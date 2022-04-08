"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.License = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class License {
  constructor() {
    (0, _defineProperty2.default)(this, "pluginName", void 0);
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "licenseCheckState", 'unavailable');
    (0, _defineProperty2.default)(this, "licenseType", void 0);
    (0, _defineProperty2.default)(this, "_isEsSecurityEnabled", false);
  }

  setup({
    pluginName,
    logger
  }) {
    this.pluginName = pluginName;
    this.logger = logger;
  }

  start({
    pluginId,
    minimumLicenseType,
    licensing
  }) {
    if (minimumLicenseType === 'basic') {
      throw Error(`Basic licenses don't restrict the use of plugins. Please don't use license_api_guard in the ${pluginId} plugin, or provide a more restrictive minimumLicenseType.`);
    }

    licensing.license$.subscribe(license => {
      this.licenseType = license.type;
      this.licenseCheckState = license.check(pluginId, minimumLicenseType).state; // Retrieving security checks the results of GET /_xpack as well as license state,
      // so we're also checking whether security is disabled in elasticsearch.yml.

      this._isEsSecurityEnabled = license.getFeature('security').isEnabled;
    });
  }

  getLicenseErrorMessage(licenseCheckState) {
    switch (licenseCheckState) {
      case 'invalid':
        return _i18n.i18n.translate('xpack.licenseApiGuard.license.errorUnsupportedMessage', {
          defaultMessage: 'Your {licenseType} license does not support {pluginName}. Please upgrade your license.',
          values: {
            licenseType: this.licenseType,
            pluginName: this.pluginName
          }
        });

      case 'expired':
        return _i18n.i18n.translate('xpack.licenseApiGuard.license.errorExpiredMessage', {
          defaultMessage: 'You cannot use {pluginName} because your {licenseType} license has expired.',
          values: {
            licenseType: this.licenseType,
            pluginName: this.pluginName
          }
        });

      case 'unavailable':
        return _i18n.i18n.translate('xpack.licenseApiGuard.license.errorUnavailableMessage', {
          defaultMessage: 'You cannot use {pluginName} because license information is not available at this time.',
          values: {
            pluginName: this.pluginName
          }
        });
    }

    return _i18n.i18n.translate('xpack.licenseApiGuard.license.genericErrorMessage', {
      defaultMessage: 'You cannot use {pluginName} because the license check failed.',
      values: {
        pluginName: this.pluginName
      }
    });
  }

  guardApiRoute(handler) {
    return (ctx, request, response) => {
      // We'll only surface license errors if users attempt disallowed access to the API.
      if (this.licenseCheckState !== 'valid') {
        var _this$logger;

        const licenseErrorMessage = this.getLicenseErrorMessage(this.licenseCheckState);
        (_this$logger = this.logger) === null || _this$logger === void 0 ? void 0 : _this$logger.warn(licenseErrorMessage);
        return response.forbidden({
          body: {
            message: licenseErrorMessage
          }
        });
      }

      return handler(ctx, request, response);
    };
  }

  get isEsSecurityEnabled() {
    return this._isEsSecurityEnabled;
  }

}

exports.License = License;