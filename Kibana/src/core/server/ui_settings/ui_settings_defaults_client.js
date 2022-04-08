"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UiSettingsDefaultsClient = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _base_ui_settings_client = require("./base_ui_settings_client");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Implementation of the {@link IUiSettingsClient} that only gives a read-only access to the default UI Settings values and any overrides.
 */
class UiSettingsDefaultsClient extends _base_ui_settings_client.BaseUiSettingsClient {
  constructor(options) {
    super(options); // The only "userProvided" settings `UiSettingsDefaultsClient` is aware about are explicit overrides.

    (0, _defineProperty2.default)(this, "userProvided", void 0);
    this.userProvided = Object.fromEntries(Object.entries(this.overrides).map(([key, value]) => [key, // Dropping the userValue if override is null
    value === null ? {
      isOverridden: true
    } : {
      isOverridden: true,
      userValue: value
    }]));
  }

  async getUserProvided() {
    return this.userProvided;
  } // Any mutating operations are not supported by default UI settings.


  async setMany() {
    this.log.warn('`setMany` operation is not supported.');
  }

  async set() {
    this.log.warn('`set` operation is not supported.');
  }

  async remove() {
    this.log.warn('`remove` operation is not supported.');
  }

  async removeMany() {
    this.log.warn('`removeMany` operation is not supported.');
  }

}

exports.UiSettingsDefaultsClient = UiSettingsDefaultsClient;