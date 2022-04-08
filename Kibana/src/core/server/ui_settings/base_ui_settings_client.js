"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseUiSettingsClient = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = require("lodash");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Base implementation of the {@link IUiSettingsClient}.
 */
class BaseUiSettingsClient {
  constructor(options) {
    (0, _defineProperty2.default)(this, "defaults", void 0);
    (0, _defineProperty2.default)(this, "defaultValues", void 0);
    (0, _defineProperty2.default)(this, "overrides", void 0);
    (0, _defineProperty2.default)(this, "log", void 0);
    const {
      defaults = {},
      overrides = {},
      log
    } = options;
    this.log = log;
    this.overrides = overrides;
    this.defaults = defaults;
    this.defaultValues = Object.fromEntries(Object.entries(this.defaults).map(([key, {
      value
    }]) => [key, value]));
  }

  getRegistered() {
    const copiedDefaults = {};

    for (const [key, value] of Object.entries(this.defaults)) {
      copiedDefaults[key] = (0, _lodash.omit)(value, 'schema');
    }

    return copiedDefaults;
  }

  async get(key) {
    const all = await this.getAll();
    return all[key];
  }

  async getAll() {
    const result = { ...this.defaultValues
    };
    const userProvided = await this.getUserProvided();
    Object.keys(userProvided).forEach(key => {
      if (userProvided[key].userValue !== undefined) {
        result[key] = userProvided[key].userValue;
      }
    });
    return Object.freeze(result);
  }

  isOverridden(key) {
    return this.overrides.hasOwnProperty(key);
  }

  isSensitive(key) {
    const definition = this.defaults[key];
    return !!(definition !== null && definition !== void 0 && definition.sensitive);
  }

  validateKey(key, value) {
    const definition = this.defaults[key];
    if (value === null || definition === undefined) return;

    if (definition.schema) {
      definition.schema.validate(value, {}, `validation [${key}]`);
    }
  }

}

exports.BaseUiSettingsClient = BaseUiSettingsClient;