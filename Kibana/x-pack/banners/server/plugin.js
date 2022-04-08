"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BannersPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _routes = require("./routes");

var _ui_settings = require("./ui_settings");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class BannersPlugin {
  constructor(context) {
    (0, _defineProperty2.default)(this, "config", void 0);
    this.config = context.config.get();
  }

  setup({
    uiSettings,
    getStartServices,
    http
  }) {
    const router = http.createRouter();
    (0, _routes.registerRoutes)(router, this.config);
    (0, _ui_settings.registerSettings)(uiSettings, this.config);
    return {};
  }

  start() {
    return {};
  }

}

exports.BannersPlugin = BannersPlugin;