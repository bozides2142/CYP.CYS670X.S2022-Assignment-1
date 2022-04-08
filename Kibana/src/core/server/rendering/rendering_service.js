"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RenderingService = void 0;

var _react = _interopRequireDefault(require("react"));

var _server = require("react-dom/server");

var _operators = require("rxjs/operators");

var _i18n = require("@kbn/i18n");

var _views = require("./views");

var _bootstrap = require("./bootstrap");

var _render_utils = require("./render_utils");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/** @internal */
class RenderingService {
  constructor(coreContext) {
    this.coreContext = coreContext;
  }

  async preboot({
    http,
    uiPlugins
  }) {
    http.registerRoutes('', router => {
      (0, _bootstrap.registerBootstrapRoute)({
        router,
        renderer: (0, _bootstrap.bootstrapRendererFactory)({
          uiPlugins,
          serverBasePath: http.basePath.serverBasePath,
          packageInfo: this.coreContext.env.packageInfo,
          auth: http.auth
        })
      });
    });
    return {
      render: this.render.bind(this, {
        http,
        uiPlugins
      })
    };
  }

  async setup({
    http,
    status,
    uiPlugins
  }) {
    (0, _bootstrap.registerBootstrapRoute)({
      router: http.createRouter(''),
      renderer: (0, _bootstrap.bootstrapRendererFactory)({
        uiPlugins,
        serverBasePath: http.basePath.serverBasePath,
        packageInfo: this.coreContext.env.packageInfo,
        auth: http.auth
      })
    });
    return {
      render: this.render.bind(this, {
        http,
        uiPlugins,
        status
      })
    };
  }

  async render({
    http,
    uiPlugins,
    status
  }, request, uiSettings, {
    includeUserSettings = true,
    vars
  } = {}) {
    var _uiSettings$getRegist, _status$isStatusPageA;

    const env = {
      mode: this.coreContext.env.mode,
      packageInfo: this.coreContext.env.packageInfo
    };
    const buildNum = env.packageInfo.buildNum;
    const basePath = http.basePath.get(request);
    const {
      serverBasePath,
      publicBaseUrl
    } = http.basePath;
    const settings = {
      defaults: (_uiSettings$getRegist = uiSettings.getRegistered()) !== null && _uiSettings$getRegist !== void 0 ? _uiSettings$getRegist : {},
      user: includeUserSettings ? await uiSettings.getUserProvided() : {}
    };
    const darkMode = (0, _render_utils.getSettingValue)('theme:darkMode', settings, Boolean);
    const themeVersion = 'v8';
    const stylesheetPaths = (0, _render_utils.getStylesheetPaths)({
      darkMode,
      themeVersion,
      basePath: serverBasePath,
      buildNum
    });
    const metadata = {
      strictCsp: http.csp.strict,
      uiPublicUrl: `${basePath}/ui`,
      bootstrapScriptUrl: `${basePath}/bootstrap.js`,
      i18n: _i18n.i18n.translate,
      locale: _i18n.i18n.getLocale(),
      darkMode,
      themeVersion,
      stylesheetPaths,
      injectedMetadata: {
        version: env.packageInfo.version,
        buildNumber: env.packageInfo.buildNum,
        branch: env.packageInfo.branch,
        basePath,
        serverBasePath,
        publicBaseUrl,
        env,
        anonymousStatusPage: (_status$isStatusPageA = status === null || status === void 0 ? void 0 : status.isStatusPageAnonymous()) !== null && _status$isStatusPageA !== void 0 ? _status$isStatusPageA : false,
        i18n: {
          translationsUrl: `${basePath}/translations/${_i18n.i18n.getLocale()}.json`
        },
        theme: {
          darkMode,
          version: themeVersion
        },
        csp: {
          warnLegacyBrowsers: http.csp.warnLegacyBrowsers
        },
        externalUrl: http.externalUrl,
        vars: vars !== null && vars !== void 0 ? vars : {},
        uiPlugins: await Promise.all([...uiPlugins.public].map(async ([id, plugin]) => ({
          id,
          plugin,
          config: await getUiConfig(uiPlugins, id)
        }))),
        legacyMetadata: {
          uiSettings: settings
        }
      }
    };
    return `<!DOCTYPE html>${(0, _server.renderToStaticMarkup)( /*#__PURE__*/_react.default.createElement(_views.Template, {
      metadata: metadata
    }))}`;
  }

  async stop() {}

}

exports.RenderingService = RenderingService;

const getUiConfig = async (uiPlugins, pluginId) => {
  var _await$browserConfig$;

  const browserConfig = uiPlugins.browserConfigs.get(pluginId);
  return (_await$browserConfig$ = await (browserConfig === null || browserConfig === void 0 ? void 0 : browserConfig.pipe((0, _operators.take)(1)).toPromise())) !== null && _await$browserConfig$ !== void 0 ? _await$browserConfig$ : {};
};