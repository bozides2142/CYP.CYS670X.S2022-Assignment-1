"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SharePlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _i18n = require("@kbn/i18n");

var _configSchema = require("@kbn/config-schema");

var _constants = require("../common/constants");

var _url_service = require("../common/url_service");

var _url_service2 = require("./url_service");

var _legacy_short_url_locator = require("../common/url_service/locators/legacy_short_url_locator");

var _short_url_redirect_locator = require("../common/url_service/locators/short_url_redirect_locator");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class SharePlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "url", void 0);
    (0, _defineProperty2.default)(this, "version", void 0);
    this.initializerContext = initializerContext;
    this.version = initializerContext.env.packageInfo.version;
  }

  setup(core) {
    this.url = new _url_service.UrlService({
      baseUrl: core.http.basePath.publicBaseUrl || core.http.basePath.serverBasePath,
      version: this.initializerContext.env.packageInfo.version,
      navigate: async () => {
        throw new Error('Locator .navigate() is not supported on the server.');
      },
      getUrl: async () => {
        throw new Error('Locator .getUrl() currently is not supported on the server.');
      },
      shortUrls: ({
        locators
      }) => new _url_service2.ServerShortUrlClientFactory({
        currentVersion: this.version,
        locators
      })
    });
    this.url.locators.create(new _legacy_short_url_locator.LegacyShortUrlLocatorDefinition());
    this.url.locators.create(new _short_url_redirect_locator.ShortUrlRedirectLocatorDefinition());
    (0, _url_service2.registerUrlServiceSavedObjectType)(core.savedObjects, this.url);
    (0, _url_service2.registerUrlServiceRoutes)(core, core.http.createRouter(), this.url);
    core.uiSettings.register({
      [_constants.CSV_SEPARATOR_SETTING]: {
        name: _i18n.i18n.translate('share.advancedSettings.csv.separatorTitle', {
          defaultMessage: 'CSV separator'
        }),
        value: ',',
        description: _i18n.i18n.translate('share.advancedSettings.csv.separatorText', {
          defaultMessage: 'Separate exported values with this string'
        }),
        schema: _configSchema.schema.string()
      },
      [_constants.CSV_QUOTE_VALUES_SETTING]: {
        name: _i18n.i18n.translate('share.advancedSettings.csv.quoteValuesTitle', {
          defaultMessage: 'Quote CSV values'
        }),
        value: true,
        description: _i18n.i18n.translate('share.advancedSettings.csv.quoteValuesText', {
          defaultMessage: 'Should values be quoted in csv exports?'
        }),
        schema: _configSchema.schema.boolean()
      }
    });
    return {
      url: this.url
    };
  }

  start() {
    this.initializerContext.logger.get().debug('Starting plugin');
    return {
      url: this.url
    };
  }

  stop() {
    this.initializerContext.logger.get().debug('Stopping plugin');
  }

}

exports.SharePlugin = SharePlugin;