"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ShortUrlRedirectLocatorDefinition = exports.SHORT_URL_REDIRECT_LOCATOR = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const SHORT_URL_REDIRECT_LOCATOR = 'SHORT_URL_REDIRECT_LOCATOR';
exports.SHORT_URL_REDIRECT_LOCATOR = SHORT_URL_REDIRECT_LOCATOR;

/**
 * Locator that points to a frontend short URL redirect app by slug.
 */
class ShortUrlRedirectLocatorDefinition {
  constructor() {
    (0, _defineProperty2.default)(this, "id", SHORT_URL_REDIRECT_LOCATOR);
  }

  async getLocation(params) {
    const {
      slug
    } = params;
    return {
      app: 'r',
      path: 's/' + slug,
      state: {}
    };
  }

}

exports.ShortUrlRedirectLocatorDefinition = ShortUrlRedirectLocatorDefinition;