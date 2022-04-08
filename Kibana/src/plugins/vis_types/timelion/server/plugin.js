"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimelionPlugin = void 0;

var _i18n = require("@kbn/i18n");

var _load_functions = _interopRequireDefault(require("./lib/load_functions"));

var _functions = require("./routes/functions");

var _validate_es = require("./routes/validate_es");

var _run = require("./routes/run");

var _config_manager = require("./lib/config_manager");

var _ui_settings = require("./ui_settings");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Represents Timelion Plugin instance that will be managed by the Kibana plugin system.
 */
class TimelionPlugin {
  constructor(initializerContext) {
    this.initializerContext = initializerContext;
  }

  setup(core) {
    const config = this.initializerContext.config.get();
    const configManager = new _config_manager.ConfigManager(this.initializerContext.config);
    const functions = (0, _load_functions.default)('series_functions');

    const getFunction = name => {
      if (functions[name]) {
        return functions[name];
      }

      throw new Error(_i18n.i18n.translate('timelion.noFunctionErrorMessage', {
        defaultMessage: 'No such function: {name}',
        values: {
          name
        }
      }));
    };

    const logger = this.initializerContext.logger.get('timelion');
    const router = core.http.createRouter();
    const deps = {
      configManager,
      functions,
      getFunction,
      logger,
      core
    };
    (0, _functions.functionsRoute)(router, deps);
    (0, _run.runRoute)(router, deps);
    (0, _validate_es.validateEsRoute)(router);
    core.uiSettings.register((0, _ui_settings.getUiSettings)(config));
  }

  start() {
    this.initializerContext.logger.get().debug('Starting plugin');
  }

  stop() {
    this.initializerContext.logger.get().debug('Stopping plugin');
  }

}

exports.TimelionPlugin = TimelionPlugin;