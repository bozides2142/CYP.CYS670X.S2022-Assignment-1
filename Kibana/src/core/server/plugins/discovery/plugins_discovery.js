"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.discover = discover;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _plugin = require("../plugin");

var _plugin_context = require("../plugin_context");

var _plugin_manifest_parser = require("./plugin_manifest_parser");

var _scan_plugin_search_paths = require("./scan_plugin_search_paths");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Tries to discover all possible plugins based on the provided plugin config.
 * Discovery result consists of two separate streams, the one (`plugin$`) is
 * for the successfully discovered plugins and the other one (`error$`) is for
 * all the errors that occurred during discovery process.
 *
 * @param config Plugin config instance.
 * @param coreContext Kibana core values.
 * @internal
 */
function discover(config, coreContext, instanceInfo) {
  const log = coreContext.logger.get('plugins-discovery');
  log.debug('Discovering plugins...');

  if (config.additionalPluginPaths.length && coreContext.env.mode.dev) {
    log.warn(`Explicit plugin paths [${config.additionalPluginPaths}] should only be used in development. Relative imports may not work properly in production.`);
  }

  const discoveryResults$ = (0, _rxjs.merge)((0, _rxjs.from)(config.additionalPluginPaths), (0, _scan_plugin_search_paths.scanPluginSearchPaths)(config.pluginSearchPaths, log)).pipe((0, _operators.toArray)(), (0, _operators.mergeMap)(pathAndErrors => {
    return pathAndErrors.sort((a, b) => {
      const pa = typeof a === 'string' ? a : a.path;
      const pb = typeof b === 'string' ? b : b.path;
      return pa < pb ? -1 : pa > pb ? 1 : 0;
    });
  }), (0, _operators.concatMap)(pluginPathOrError => {
    return typeof pluginPathOrError === 'string' ? createPlugin$(pluginPathOrError, log, coreContext, instanceInfo) : [pluginPathOrError];
  }), (0, _operators.shareReplay)());
  return {
    plugin$: discoveryResults$.pipe((0, _operators.filter)(entry => entry instanceof _plugin.PluginWrapper)),
    error$: discoveryResults$.pipe((0, _operators.filter)(entry => !(entry instanceof _plugin.PluginWrapper)))
  };
}
/**
 * Tries to load and parse the plugin manifest file located at the provided plugin
 * directory path and produces an error result if it fails to do so or plugin manifest
 * isn't valid.
 * @param path Path to the plugin directory where manifest should be loaded from.
 * @param log Plugin discovery logger instance.
 * @param coreContext Kibana core context.
 */


function createPlugin$(path, log, coreContext, instanceInfo) {
  return (0, _rxjs.from)((0, _plugin_manifest_parser.parseManifest)(path, coreContext.env.packageInfo)).pipe((0, _operators.map)(manifest => {
    log.debug(`Successfully discovered plugin "${manifest.id}" at "${path}"`);
    const opaqueId = Symbol(manifest.id);
    return new _plugin.PluginWrapper({
      path,
      manifest,
      opaqueId,
      initializerContext: (0, _plugin_context.createPluginInitializerContext)(coreContext, opaqueId, manifest, instanceInfo)
    });
  }), (0, _operators.catchError)(err => [err]));
}