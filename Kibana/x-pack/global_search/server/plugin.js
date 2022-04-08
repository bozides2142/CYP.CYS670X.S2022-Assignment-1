"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GlobalSearchPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _license_checker = require("../common/license_checker");

var _services = require("./services");

var _routes = require("./routes");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class GlobalSearchPlugin {
  constructor(context) {
    (0, _defineProperty2.default)(this, "config", void 0);
    (0, _defineProperty2.default)(this, "searchService", new _services.SearchService());
    (0, _defineProperty2.default)(this, "searchServiceStart", void 0);
    (0, _defineProperty2.default)(this, "licenseChecker", void 0);
    this.config = context.config.get();
  }

  setup(core) {
    const {
      registerResultProvider
    } = this.searchService.setup({
      basePath: core.http.basePath,
      config: this.config
    });
    (0, _routes.registerRoutes)(core.http.createRouter());
    core.http.registerRouteHandlerContext('globalSearch', (_, req) => {
      return {
        find: (term, options) => this.searchServiceStart.find(term, options, req),
        getSearchableTypes: () => this.searchServiceStart.getSearchableTypes(req)
      };
    });
    return {
      registerResultProvider
    };
  }

  start(core, {
    licensing
  }) {
    this.licenseChecker = new _license_checker.LicenseChecker(licensing.license$);
    this.searchServiceStart = this.searchService.start({
      core,
      licenseChecker: this.licenseChecker
    });
    return {
      find: this.searchServiceStart.find,
      getSearchableTypes: this.searchServiceStart.getSearchableTypes
    };
  }

  stop() {
    if (this.licenseChecker) {
      this.licenseChecker.clean();
    }
  }

}

exports.GlobalSearchPlugin = GlobalSearchPlugin;