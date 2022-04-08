"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LicenseService = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// Generic license service class that works with the license observable
// Both server and client plugins instancates a singleton version of this class


class LicenseService {
  constructor() {
    (0, _defineProperty2.default)(this, "observable", null);
    (0, _defineProperty2.default)(this, "subscription", null);
    (0, _defineProperty2.default)(this, "licenseInformation", null);
  }

  updateInformation(licenseInformation) {
    this.licenseInformation = licenseInformation;
  }

  start(license$) {
    this.observable = license$;
    this.subscription = this.observable.subscribe(this.updateInformation.bind(this));
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

  isGoldPlus() {
    var _this$licenseInformat, _this$licenseInformat2, _this$licenseInformat3;

    return ((_this$licenseInformat = this.licenseInformation) === null || _this$licenseInformat === void 0 ? void 0 : _this$licenseInformat.isAvailable) && ((_this$licenseInformat2 = this.licenseInformation) === null || _this$licenseInformat2 === void 0 ? void 0 : _this$licenseInformat2.isActive) && ((_this$licenseInformat3 = this.licenseInformation) === null || _this$licenseInformat3 === void 0 ? void 0 : _this$licenseInformat3.hasAtLeast('gold'));
  }

  isEnterprise() {
    var _this$licenseInformat4, _this$licenseInformat5, _this$licenseInformat6;

    return ((_this$licenseInformat4 = this.licenseInformation) === null || _this$licenseInformat4 === void 0 ? void 0 : _this$licenseInformat4.isAvailable) && ((_this$licenseInformat5 = this.licenseInformation) === null || _this$licenseInformat5 === void 0 ? void 0 : _this$licenseInformat5.isActive) && ((_this$licenseInformat6 = this.licenseInformation) === null || _this$licenseInformat6 === void 0 ? void 0 : _this$licenseInformat6.hasAtLeast('enterprise'));
  }

  hasAtLeast(licenseType) {
    var _this$licenseInformat7, _this$licenseInformat8, _this$licenseInformat9;

    return ((_this$licenseInformat7 = this.licenseInformation) === null || _this$licenseInformat7 === void 0 ? void 0 : _this$licenseInformat7.isAvailable) && ((_this$licenseInformat8 = this.licenseInformation) === null || _this$licenseInformat8 === void 0 ? void 0 : _this$licenseInformat8.isActive) && ((_this$licenseInformat9 = this.licenseInformation) === null || _this$licenseInformat9 === void 0 ? void 0 : _this$licenseInformat9.hasAtLeast(licenseType));
  }

}

exports.LicenseService = LicenseService;