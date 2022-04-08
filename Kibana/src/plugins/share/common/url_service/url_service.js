"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UrlService = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _locators = require("./locators");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Common URL Service client interface for server-side and client-side.
 */
class UrlService {
  /**
   * Client to work with locators.
   */
  constructor(deps) {
    (0, _defineProperty2.default)(this, "locators", void 0);
    (0, _defineProperty2.default)(this, "shortUrls", void 0);
    this.deps = deps;
    this.locators = new _locators.LocatorClient(deps);
    this.shortUrls = deps.shortUrls({
      locators: this.locators
    });
  }

}

exports.UrlService = UrlService;