"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MlLicense = exports.MINIMUM_LICENSE = exports.MINIMUM_FULL_LICENSE = void 0;
exports.isFullLicense = isFullLicense;
exports.isMinimumLicense = isMinimumLicense;
exports.isMlEnabled = isMlEnabled;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _app = require("../constants/app");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const MINIMUM_LICENSE = 'basic';
exports.MINIMUM_LICENSE = MINIMUM_LICENSE;
const MINIMUM_FULL_LICENSE = 'platinum';
exports.MINIMUM_FULL_LICENSE = MINIMUM_FULL_LICENSE;

class MlLicense {
  constructor() {
    (0, _defineProperty2.default)(this, "_licenseSubscription", null);
    (0, _defineProperty2.default)(this, "_license", null);
    (0, _defineProperty2.default)(this, "_isSecurityEnabled", false);
    (0, _defineProperty2.default)(this, "_hasLicenseExpired", false);
    (0, _defineProperty2.default)(this, "_isMlEnabled", false);
    (0, _defineProperty2.default)(this, "_isMinimumLicense", false);
    (0, _defineProperty2.default)(this, "_isFullLicense", false);
    (0, _defineProperty2.default)(this, "_initialized", false);
  }

  setup(license$, postInitFunctions) {
    this._licenseSubscription = license$.subscribe(async license => {
      const {
        isEnabled: securityIsEnabled
      } = license.getFeature('security');
      this._license = license;
      this._isSecurityEnabled = securityIsEnabled;
      this._hasLicenseExpired = this._license.status === 'expired';
      this._isMlEnabled = this._license.getFeature(_app.PLUGIN_ID).isEnabled;
      this._isMinimumLicense = isMinimumLicense(this._license);
      this._isFullLicense = isFullLicense(this._license);

      if (this._initialized === false && postInitFunctions !== undefined) {
        postInitFunctions.forEach(f => f(this));
      }

      this._initialized = true;
    });
  }

  unsubscribe() {
    if (this._licenseSubscription !== null) {
      this._licenseSubscription.unsubscribe();
    }
  }

  isSecurityEnabled() {
    return this._isSecurityEnabled;
  }

  hasLicenseExpired() {
    return this._hasLicenseExpired;
  }

  isMlEnabled() {
    return this._isMlEnabled;
  }

  isMinimumLicense() {
    return this._isMinimumLicense;
  }

  isFullLicense() {
    return this._isFullLicense;
  }

}

exports.MlLicense = MlLicense;

function isFullLicense(license) {
  return license.check(_app.PLUGIN_ID, MINIMUM_FULL_LICENSE).state === 'valid';
}

function isMinimumLicense(license) {
  return license.check(_app.PLUGIN_ID, MINIMUM_LICENSE).state === 'valid';
}

function isMlEnabled(license) {
  return license.getFeature(_app.PLUGIN_ID).isEnabled;
}