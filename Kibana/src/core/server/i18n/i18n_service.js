"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.I18nService = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _operators = require("rxjs/operators");

var _i18n_config = require("./i18n_config");

var _get_kibana_translation_files = require("./get_kibana_translation_files");

var _init_translations = require("./init_translations");

var _routes = require("./routes");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class I18nService {
  constructor(coreContext) {
    (0, _defineProperty2.default)(this, "log", void 0);
    (0, _defineProperty2.default)(this, "configService", void 0);
    this.log = coreContext.logger.get('i18n');
    this.configService = coreContext.configService;
  }

  async preboot({
    pluginPaths,
    http
  }) {
    const {
      locale
    } = await this.initTranslations(pluginPaths);
    http.registerRoutes('', router => (0, _routes.registerRoutes)({
      router,
      locale
    }));
  }

  async setup({
    pluginPaths,
    http
  }) {
    const {
      locale,
      translationFiles
    } = await this.initTranslations(pluginPaths);
    const router = http.createRouter('');
    (0, _routes.registerRoutes)({
      router,
      locale
    });
    return {
      getLocale: () => locale,
      getTranslationFiles: () => translationFiles
    };
  }

  async initTranslations(pluginPaths) {
    const i18nConfig = await this.configService.atPath(_i18n_config.config.path).pipe((0, _operators.take)(1)).toPromise();
    const locale = i18nConfig.locale;
    this.log.debug(`Using locale: ${locale}`);
    const translationFiles = await (0, _get_kibana_translation_files.getKibanaTranslationFiles)(locale, pluginPaths);
    this.log.debug(`Using translation files: [${translationFiles.join(', ')}]`);
    await (0, _init_translations.initTranslations)(locale, translationFiles);
    return {
      locale,
      translationFiles
    };
  }

}

exports.I18nService = I18nService;