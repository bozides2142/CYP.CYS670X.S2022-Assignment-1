"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.License = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _i18n = require("@kbn/i18n");

var _types = require("./types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * @public
 */


class License {
  /**
   * @internal
   * Generate a License instance from json representation.
   */
  static fromJSON(json) {
    return new License(json);
  }

  constructor({
    license,
    features,
    error,
    signature
  }) {
    (0, _defineProperty2.default)(this, "license", void 0);
    (0, _defineProperty2.default)(this, "features", void 0);
    (0, _defineProperty2.default)(this, "error", void 0);
    (0, _defineProperty2.default)(this, "isActive", void 0);
    (0, _defineProperty2.default)(this, "isAvailable", void 0);
    (0, _defineProperty2.default)(this, "uid", void 0);
    (0, _defineProperty2.default)(this, "status", void 0);
    (0, _defineProperty2.default)(this, "expiryDateInMillis", void 0);
    (0, _defineProperty2.default)(this, "type", void 0);
    (0, _defineProperty2.default)(this, "mode", void 0);
    (0, _defineProperty2.default)(this, "signature", void 0);
    this.isAvailable = Boolean(license);
    this.license = license;
    this.features = features;
    this.error = error;
    this.signature = signature;

    if (license) {
      this.uid = license.uid;
      this.status = license.status;
      this.expiryDateInMillis = license.expiryDateInMillis;
      this.type = license.type;
      this.mode = license.mode;
    }

    this.isActive = this.status === 'active';
  }

  toJSON() {
    return {
      license: this.license,
      features: this.features,
      signature: this.signature
    };
  }

  getUnavailableReason() {
    if (this.error) return this.error;

    if (!this.isAvailable) {
      return 'X-Pack plugin is not installed on the Elasticsearch cluster.';
    }
  }

  hasAtLeast(minimumLicenseRequired) {
    const type = this.type;

    if (!type) {
      return false;
    }

    if (!(minimumLicenseRequired in _types.LICENSE_TYPE)) {
      throw new Error(`"${minimumLicenseRequired}" is not a valid license type`);
    }

    return _types.LICENSE_TYPE[minimumLicenseRequired] <= _types.LICENSE_TYPE[type];
  }

  check(pluginName, minimumLicenseRequired) {
    if (!this.isAvailable) {
      return {
        state: 'unavailable',
        message: _i18n.i18n.translate('xpack.licensing.check.errorUnavailableMessage', {
          defaultMessage: 'You cannot use {pluginName} because license information is not available at this time.',
          values: {
            pluginName
          }
        })
      };
    }

    if (!this.isActive) {
      return {
        state: 'expired',
        message: _i18n.i18n.translate('xpack.licensing.check.errorExpiredMessage', {
          defaultMessage: 'You cannot use {pluginName} because your {licenseType} license has expired.',
          values: {
            licenseType: this.type,
            pluginName
          }
        })
      };
    }

    if (!this.hasAtLeast(minimumLicenseRequired)) {
      return {
        state: 'invalid',
        message: _i18n.i18n.translate('xpack.licensing.check.errorUnsupportedMessage', {
          defaultMessage: 'Your {licenseType} license does not support {pluginName}. Please upgrade your license.',
          values: {
            licenseType: this.type,
            pluginName
          }
        })
      };
    }

    return {
      state: 'valid'
    };
  }

  getFeature(name) {
    if (this.isAvailable && this.features && this.features.hasOwnProperty(name)) {
      return { ...this.features[name]
      };
    }

    return {
      isAvailable: false,
      isEnabled: false
    };
  }

}

exports.License = License;