"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LegacyShortUrlLocatorDefinition = exports.LEGACY_SHORT_URL_LOCATOR_ID = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _short_url_assert_valid = require("./short_url_assert_valid");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const LEGACY_SHORT_URL_LOCATOR_ID = 'LEGACY_SHORT_URL_LOCATOR';
exports.LEGACY_SHORT_URL_LOCATOR_ID = LEGACY_SHORT_URL_LOCATOR_ID;

class LegacyShortUrlLocatorDefinition {
  constructor() {
    (0, _defineProperty2.default)(this, "id", LEGACY_SHORT_URL_LOCATOR_ID);
  }

  async getLocation(params) {
    const {
      url
    } = params;
    (0, _short_url_assert_valid.shortUrlAssertValid)(url);
    const match = url.match(/^.*\/app\/([^\/#]+)(.+)$/);

    if (!match) {
      throw new Error('Unexpected URL path.');
    }

    const [, app, path] = match;

    if (!app || !path) {
      throw new Error('Could not parse URL path.');
    }

    return {
      app,
      path,
      state: {}
    };
  }

}

exports.LegacyShortUrlLocatorDefinition = LegacyShortUrlLocatorDefinition;