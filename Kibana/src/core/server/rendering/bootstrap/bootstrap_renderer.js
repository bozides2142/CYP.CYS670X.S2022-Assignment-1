"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bootstrapRendererFactory = void 0;

var _crypto = require("crypto");

var _get_plugin_bundle_paths = require("./get_plugin_bundle_paths");

var _get_js_dependency_paths = require("./get_js_dependency_paths");

var _get_theme_tag = require("./get_theme_tag");

var _render_template = require("./render_template");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const bootstrapRendererFactory = ({
  packageInfo,
  serverBasePath,
  uiPlugins,
  auth
}) => {
  const isAuthenticated = request => {
    const {
      status: authStatus
    } = auth.get(request); // status is 'unknown' when auth is disabled. we just need to not be `unauthenticated` here.

    return authStatus !== 'unauthenticated';
  };

  return async function bootstrapRenderer({
    uiSettingsClient,
    request
  }) {
    let darkMode = false;
    const themeVersion = 'v8';

    try {
      const authenticated = isAuthenticated(request);
      darkMode = authenticated ? await uiSettingsClient.get('theme:darkMode') : false;
    } catch (e) {// just use the default values in case of connectivity issues with ES
    }

    const themeTag = (0, _get_theme_tag.getThemeTag)({
      themeVersion,
      darkMode
    });
    const buildHash = packageInfo.buildNum;
    const regularBundlePath = `${serverBasePath}/${buildHash}/bundles`;
    const bundlePaths = (0, _get_plugin_bundle_paths.getPluginsBundlePaths)({
      uiPlugins,
      regularBundlePath
    });
    const jsDependencyPaths = (0, _get_js_dependency_paths.getJsDependencyPaths)(regularBundlePath, bundlePaths); // These paths should align with the bundle routes configured in
    // src/optimize/bundles_route/bundles_route.ts

    const publicPathMap = JSON.stringify({
      core: `${regularBundlePath}/core/`,
      'kbn-ui-shared-deps-src': `${regularBundlePath}/kbn-ui-shared-deps-src/`,
      'kbn-ui-shared-deps-npm': `${regularBundlePath}/kbn-ui-shared-deps-npm/`,
      ...Object.fromEntries([...bundlePaths.entries()].map(([pluginId, plugin]) => [pluginId, plugin.publicPath]))
    });
    const body = (0, _render_template.renderTemplate)({
      themeTag,
      jsDependencyPaths,
      publicPathMap
    });
    const hash = (0, _crypto.createHash)('sha1');
    hash.update(body);
    const etag = hash.digest('hex');
    return {
      body,
      etag
    };
  };
};

exports.bootstrapRendererFactory = bootstrapRendererFactory;