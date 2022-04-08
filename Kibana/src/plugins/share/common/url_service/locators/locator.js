"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Locator = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _use_locator_url = require("./use_locator_url");

var _redirect = require("./redirect");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class Locator {
  constructor(definition, deps) {
    (0, _defineProperty2.default)(this, "id", void 0);
    (0, _defineProperty2.default)(this, "migrations", void 0);
    (0, _defineProperty2.default)(this, "telemetry", (state, stats) => {
      return this.definition.telemetry ? this.definition.telemetry(state, stats) : stats;
    });
    (0, _defineProperty2.default)(this, "inject", (state, references) => {
      if (!this.definition.inject) return state;
      return this.definition.inject(state, references);
    });
    (0, _defineProperty2.default)(this, "extract", state => {
      if (!this.definition.extract) return {
        state,
        references: []
      };
      return this.definition.extract(state);
    });
    (0, _defineProperty2.default)(this, "useUrl", (params, getUrlParams, deps = []) => (0, _use_locator_url.useLocatorUrl)(this, params, getUrlParams, deps));
    this.definition = definition;
    this.deps = deps;
    this.id = definition.id;
    this.migrations = definition.migrations || {};
  } // PersistableState<P> -------------------------------------------------------


  // LocatorPublic<P> ----------------------------------------------------------
  async getLocation(params) {
    return await this.definition.getLocation(params);
  }

  async getUrl(params, {
    absolute = false
  } = {}) {
    const location = await this.getLocation(params);
    const url = this.deps.getUrl(location, {
      absolute
    });
    return url;
  }

  getRedirectUrl(params, options = {}) {
    var _options$lzCompress;

    const {
      baseUrl = '',
      version = '0.0.0'
    } = this.deps;
    const redirectOptions = {
      id: this.definition.id,
      version,
      params
    };
    const formatOptions = { ...options,
      lzCompress: (_options$lzCompress = options.lzCompress) !== null && _options$lzCompress !== void 0 ? _options$lzCompress : true
    };
    const search = (0, _redirect.formatSearchParams)(redirectOptions, formatOptions).toString();
    return baseUrl + '/app/r?' + search;
  }

  async navigate(params, {
    replace = false
  } = {}) {
    const location = await this.getLocation(params);
    await this.deps.navigate(location, {
      replace
    });
  }

  navigateSync(locatorParams, navigationParams = {}) {
    this.navigate(locatorParams, navigationParams).catch(error => {
      // eslint-disable-next-line no-console
      console.log(`Failed to navigate [locator = ${this.id}].`, locatorParams, navigationParams); // eslint-disable-next-line no-console

      console.error(error);
    });
  }

}

exports.Locator = Locator;