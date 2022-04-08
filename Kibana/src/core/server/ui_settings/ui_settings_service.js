"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UiSettingsService = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _operators = require("rxjs/operators");

var _std = require("@kbn/std");

var _ui_settings_config = require("./ui_settings_config");

var _ui_settings_client = require("./ui_settings_client");

var _saved_objects = require("./saved_objects");

var _routes = require("./routes");

var _settings = require("./settings");

var _ui_settings_defaults_client = require("./ui_settings_defaults_client");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/** @internal */
class UiSettingsService {
  constructor(coreContext) {
    (0, _defineProperty2.default)(this, "log", void 0);
    (0, _defineProperty2.default)(this, "config$", void 0);
    (0, _defineProperty2.default)(this, "isDist", void 0);
    (0, _defineProperty2.default)(this, "uiSettingsDefaults", new Map());
    (0, _defineProperty2.default)(this, "overrides", {});
    this.coreContext = coreContext;
    this.log = coreContext.logger.get('ui-settings-service');
    this.isDist = coreContext.env.packageInfo.dist;
    this.config$ = coreContext.configService.atPath(_ui_settings_config.config.path);
  }

  async preboot() {
    this.log.debug('Prebooting ui settings service');
    const {
      overrides
    } = await this.config$.pipe((0, _operators.first)()).toPromise();
    this.overrides = overrides;
    this.register((0, _settings.getCoreSettings)({
      isDist: this.isDist
    }));
    return {
      createDefaultsClient: () => new _ui_settings_defaults_client.UiSettingsDefaultsClient({
        defaults: (0, _std.mapToObject)(this.uiSettingsDefaults),
        overrides: this.overrides,
        log: this.log.get('core defaults')
      })
    };
  }

  async setup({
    http,
    savedObjects
  }) {
    this.log.debug('Setting up ui settings service');
    savedObjects.registerType(_saved_objects.uiSettingsType);
    (0, _routes.registerRoutes)(http.createRouter(''));
    const config = await this.config$.pipe((0, _operators.first)()).toPromise();
    this.overrides = config.overrides;
    return {
      register: this.register.bind(this)
    };
  }

  async start() {
    this.validatesDefinitions();
    this.validatesOverrides();
    return {
      asScopedToClient: this.getScopedClientFactory()
    };
  }

  async stop() {}

  getScopedClientFactory() {
    const {
      version,
      buildNum
    } = this.coreContext.env.packageInfo;
    return savedObjectsClient => new _ui_settings_client.UiSettingsClient({
      type: 'config',
      id: version,
      buildNum,
      savedObjectsClient,
      defaults: (0, _std.mapToObject)(this.uiSettingsDefaults),
      overrides: this.overrides,
      log: this.log
    });
  }

  register(settings = {}) {
    Object.entries(settings).forEach(([key, value]) => {
      if (this.uiSettingsDefaults.has(key)) {
        throw new Error(`uiSettings for the key [${key}] has been already registered`);
      }

      this.uiSettingsDefaults.set(key, value);
    });
  }

  validatesDefinitions() {
    for (const [key, definition] of this.uiSettingsDefaults) {
      if (!definition.schema) {
        throw new Error(`Validation schema is not provided for [${key}] UI Setting`);
      }

      definition.schema.validate(definition.value, {}, `ui settings defaults [${key}]`);
    }
  }

  validatesOverrides() {
    for (const [key, value] of Object.entries(this.overrides)) {
      const definition = this.uiSettingsDefaults.get(key); // overrides might contain UiSettings for a disabled plugin

      if (definition !== null && definition !== void 0 && definition.schema) {
        definition.schema.validate(value, {}, `ui settings overrides [${key}]`);
      }
    }
  }

}

exports.UiSettingsService = UiSettingsService;