"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LicenseState = void 0;
exports.verifyApiAccessFactory = verifyApiAccessFactory;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _i18n = require("@kbn/i18n");

var _std = require("@kbn/std");

var _lodash = require("lodash");

var _plugin = require("../constants/plugin");

var _get_rule_type_feature_usage_name = require("./get_rule_type_feature_usage_name");

var _alert_type_disabled = require("./errors/alert_type_disabled");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class LicenseState {
  constructor(license$) {
    (0, _defineProperty2.default)(this, "licenseInformation", this.checkLicense(undefined));
    (0, _defineProperty2.default)(this, "subscription", void 0);
    (0, _defineProperty2.default)(this, "license", void 0);
    (0, _defineProperty2.default)(this, "_notifyUsage", null);
    this.subscription = license$.subscribe(this.updateInformation.bind(this));
  }

  updateInformation(license) {
    this.license = license;
    this.licenseInformation = this.checkLicense(license);
  }

  clean() {
    this.subscription.unsubscribe();
  }

  getLicenseInformation() {
    return this.licenseInformation;
  }

  getIsSecurityEnabled() {
    var _this$license;

    if (!this.license || !((_this$license = this.license) !== null && _this$license !== void 0 && _this$license.isAvailable)) {
      return null;
    }

    const {
      isEnabled
    } = this.license.getFeature('security');
    return isEnabled;
  }

  setNotifyUsage(notifyUsage) {
    this._notifyUsage = notifyUsage;
  }

  getLicenseCheckForRuleType(ruleTypeId, ruleTypeName, minimumLicenseRequired, {
    notifyUsage
  } = {
    notifyUsage: false
  }) {
    var _this$license2;

    if (notifyUsage) {
      this.notifyUsage(ruleTypeName, minimumLicenseRequired);
    }

    if (!((_this$license2 = this.license) !== null && _this$license2 !== void 0 && _this$license2.isAvailable)) {
      return {
        isValid: false,
        reason: 'unavailable'
      };
    }

    const check = this.license.check(ruleTypeId, minimumLicenseRequired);

    switch (check.state) {
      case 'expired':
        return {
          isValid: false,
          reason: 'expired'
        };

      case 'invalid':
        return {
          isValid: false,
          reason: 'invalid'
        };

      case 'unavailable':
        return {
          isValid: false,
          reason: 'unavailable'
        };

      case 'valid':
        return {
          isValid: true
        };

      default:
        return (0, _std.assertNever)(check.state);
    }
  }

  notifyUsage(ruleTypeName, minimumLicenseRequired) {
    // No need to notify usage on basic alert types
    if (this._notifyUsage && minimumLicenseRequired !== 'basic') {
      this._notifyUsage((0, _get_rule_type_feature_usage_name.getRuleTypeFeatureUsageName)(ruleTypeName));
    }
  }

  checkLicense(license) {
    if (!license || !license.isAvailable) {
      return {
        showAppLink: true,
        enableAppLink: false,
        message: _i18n.i18n.translate('xpack.alerting.serverSideErrors.unavailableLicenseInformationErrorMessage', {
          defaultMessage: 'Alerts is unavailable - license information is not available at this time.'
        })
      };
    }

    const check = license.check(_plugin.PLUGIN.ID, _plugin.PLUGIN.MINIMUM_LICENSE_REQUIRED);

    switch (check.state) {
      case 'expired':
        return {
          showAppLink: true,
          enableAppLink: false,
          message: check.message || ''
        };

      case 'invalid':
      case 'unavailable':
        return {
          showAppLink: false,
          enableAppLink: false,
          message: check.message || ''
        };

      case 'valid':
        return {
          showAppLink: true,
          enableAppLink: true,
          message: ''
        };

      default:
        return (0, _std.assertNever)(check.state);
    }
  }

  ensureLicenseForRuleType(ruleType) {
    this.notifyUsage(ruleType.name, ruleType.minimumLicenseRequired);
    const check = this.getLicenseCheckForRuleType(ruleType.id, ruleType.name, ruleType.minimumLicenseRequired);

    if (check.isValid) {
      return;
    }

    switch (check.reason) {
      case 'unavailable':
        throw new _alert_type_disabled.AlertTypeDisabledError(_i18n.i18n.translate('xpack.alerting.serverSideErrors.unavailableLicenseErrorMessage', {
          defaultMessage: 'Rule type {ruleTypeId} is disabled because license information is not available at this time.',
          values: {
            ruleTypeId: ruleType.id
          }
        }), 'license_unavailable');

      case 'expired':
        throw new _alert_type_disabled.AlertTypeDisabledError(_i18n.i18n.translate('xpack.alerting.serverSideErrors.expirerdLicenseErrorMessage', {
          defaultMessage: 'Rule type {ruleTypeId} is disabled because your {licenseType} license has expired.',
          values: {
            ruleTypeId: ruleType.id,
            licenseType: this.license.type
          }
        }), 'license_expired');

      case 'invalid':
        throw new _alert_type_disabled.AlertTypeDisabledError(_i18n.i18n.translate('xpack.alerting.serverSideErrors.invalidLicenseErrorMessage', {
          defaultMessage: 'Rule {ruleTypeId} is disabled because it requires a {licenseType} license. Go to License Management to view upgrade options.',
          values: {
            ruleTypeId: ruleType.id,
            licenseType: (0, _lodash.capitalize)(ruleType.minimumLicenseRequired)
          }
        }), 'license_invalid');

      default:
        (0, _std.assertNever)(check.reason);
    }
  }

}

exports.LicenseState = LicenseState;

function verifyApiAccessFactory(licenseState) {
  function verifyApiAccess() {
    const licenseCheckResults = licenseState.getLicenseInformation();

    if (licenseCheckResults.showAppLink && licenseCheckResults.enableAppLink) {
      return null;
    }

    throw _boom.default.forbidden(licenseCheckResults.message);
  }

  return verifyApiAccess;
}