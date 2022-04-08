"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LicenseState = void 0;
exports.verifyApiAccess = verifyApiAccess;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _operators = require("rxjs/operators");

var _check_license = require("../../common/check_license");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class LicenseState {
  constructor() {
    (0, _defineProperty2.default)(this, "licenseInformation", (0, _check_license.checkLicense)(undefined));
    (0, _defineProperty2.default)(this, "subscription", null);
    (0, _defineProperty2.default)(this, "observable", null);
    (0, _defineProperty2.default)(this, "_notifyUsage", null);
  }

  updateInformation(licenseInformation) {
    this.licenseInformation = licenseInformation;
  }

  start(license$) {
    this.observable = license$.pipe((0, _operators.map)(_check_license.checkLicense));
    this.subscription = this.observable.subscribe(this.updateInformation.bind(this));
  }

  setNotifyUsage(notifyUsage) {
    this._notifyUsage = notifyUsage;
  } // 'Graph' is the only allowed feature here at the moment, if this gets extended in the future, add to the union type


  notifyUsage(featureName) {
    if (this._notifyUsage) {
      this._notifyUsage(featureName);
    }
  }

  stop() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getLicenseInformation() {
    return this.licenseInformation;
  }

  getLicenseInformation$() {
    return this.observable;
  }

}

exports.LicenseState = LicenseState;

function verifyApiAccess(licenseState) {
  const licenseCheckResults = licenseState.getLicenseInformation();

  if (licenseCheckResults.showAppLink && licenseCheckResults.enableAppLink) {
    return;
  }

  throw _boom.default.forbidden(licenseCheckResults.message);
}