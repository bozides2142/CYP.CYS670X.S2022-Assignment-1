"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KibanaFeature = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _sub_feature = require("./sub_feature");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class KibanaFeature {
  constructor(config) {
    var _config$subFeatures;

    (0, _defineProperty2.default)(this, "subFeatures", void 0);
    this.config = config;
    this.subFeatures = ((_config$subFeatures = config.subFeatures) !== null && _config$subFeatures !== void 0 ? _config$subFeatures : []).map(subFeatureConfig => new _sub_feature.SubFeature(subFeatureConfig));
  }

  get id() {
    return this.config.id;
  }

  get name() {
    return this.config.name;
  }

  get order() {
    return this.config.order;
  }

  get category() {
    return this.config.category;
  }

  get app() {
    return this.config.app;
  }

  get catalogue() {
    return this.config.catalogue;
  }

  get management() {
    return this.config.management;
  }

  get minimumLicense() {
    return this.config.minimumLicense;
  }

  get privileges() {
    return this.config.privileges;
  }

  get alerting() {
    return this.config.alerting;
  }

  get cases() {
    return this.config.cases;
  }

  get excludeFromBasePrivileges() {
    var _this$config$excludeF;

    return (_this$config$excludeF = this.config.excludeFromBasePrivileges) !== null && _this$config$excludeF !== void 0 ? _this$config$excludeF : false;
  }

  get reserved() {
    return this.config.reserved;
  }

  toRaw() {
    return { ...this.config
    };
  }

}

exports.KibanaFeature = KibanaFeature;