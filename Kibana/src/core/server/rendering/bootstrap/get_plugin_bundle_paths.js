"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPluginsBundlePaths = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getPluginsBundlePaths = ({
  uiPlugins,
  regularBundlePath
}) => {
  const pluginBundlePaths = new Map();
  const pluginsToProcess = [...uiPlugins.public.keys()];

  while (pluginsToProcess.length > 0) {
    var _uiPlugins$internal$g, _uiPlugins$internal$g2;

    const pluginId = pluginsToProcess.pop();
    const plugin = uiPlugins.internal.get(pluginId);

    if (!plugin) {
      continue;
    }

    const {
      version
    } = plugin;
    pluginBundlePaths.set(pluginId, {
      publicPath: `${regularBundlePath}/plugin/${pluginId}/${version}/`,
      bundlePath: `${regularBundlePath}/plugin/${pluginId}/${version}/${pluginId}.plugin.js`
    });
    const pluginBundleIds = (_uiPlugins$internal$g = (_uiPlugins$internal$g2 = uiPlugins.internal.get(pluginId)) === null || _uiPlugins$internal$g2 === void 0 ? void 0 : _uiPlugins$internal$g2.requiredBundles) !== null && _uiPlugins$internal$g !== void 0 ? _uiPlugins$internal$g : [];
    pluginBundleIds.forEach(bundleId => {
      if (!pluginBundlePaths.has(bundleId)) {
        pluginsToProcess.push(bundleId);
      }
    });
  }

  return pluginBundlePaths;
};

exports.getPluginsBundlePaths = getPluginsBundlePaths;