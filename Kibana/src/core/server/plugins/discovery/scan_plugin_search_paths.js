"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scanPluginSearchPaths = scanPluginSearchPaths;

var _fs = require("fs");

var _path = require("path");

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _plugin_discovery_error = require("./plugin_discovery_error");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const fsReadDir$ = (0, _rxjs.bindNodeCallback)(_fs.readdir);
const fsStat$ = (0, _rxjs.bindNodeCallback)(_fs.stat);
const maxScanDepth = 5;

/**
 * Recursively iterates over every plugin search path and returns a merged stream of all
 * sub-directories containing a manifest file. If directory cannot be read or it's impossible to get stat
 * for any of the nested entries then error is added into the stream instead.
 *
 * @param pluginDirs List of the top-level directories to process.
 * @param log Plugin discovery logger instance.
 */
function scanPluginSearchPaths(pluginDirs, log) {
  function recursiveScanFolder(ent) {
    return (0, _rxjs.from)([ent]).pipe((0, _operators.mergeMap)(entry => {
      return findManifestInFolder(entry.dir, () => {
        if (entry.depth > maxScanDepth) {
          return [];
        }

        return mapSubdirectories(entry.dir, subDir => recursiveScanFolder({
          dir: subDir,
          depth: entry.depth + 1
        }));
      });
    }));
  }

  return (0, _rxjs.from)(pluginDirs.map(dir => ({
    dir,
    depth: 0
  }))).pipe((0, _operators.mergeMap)(entry => {
    log.debug(`Scanning "${entry.dir}" for plugin sub-directories...`);
    return fsReadDir$(entry.dir).pipe((0, _operators.mergeMap)(() => recursiveScanFolder(entry)), (0, _operators.catchError)(err => [_plugin_discovery_error.PluginDiscoveryError.invalidSearchPath(entry.dir, err)]));
  }));
}
/**
 * Attempts to read manifest file in specified directory or calls `notFound` and returns results if not found. For any
 * manifest files that cannot be read, a PluginDiscoveryError is added.
 * @param dir
 * @param notFound
 */


function findManifestInFolder(dir, notFound) {
  return fsStat$((0, _path.resolve)(dir, 'kibana.json')).pipe((0, _operators.mergeMap)(stats => {
    // `kibana.json` exists in given directory, we got a plugin
    if (stats.isFile()) {
      return [dir];
    }

    return [];
  }), (0, _operators.catchError)(manifestStatError => {
    // did not find manifest. recursively process sub directories until we reach max depth.
    if (manifestStatError.code !== 'ENOENT') {
      return [_plugin_discovery_error.PluginDiscoveryError.invalidPluginPath(dir, manifestStatError)];
    }

    return notFound();
  }));
}
/**
 * Finds all subdirectories in `dir` and executed `mapFunc` for each one. For any directories that cannot be read,
 * a PluginDiscoveryError is added.
 * @param dir
 * @param mapFunc
 */


function mapSubdirectories(dir, mapFunc) {
  return fsReadDir$(dir).pipe((0, _operators.mergeMap)(subDirs => subDirs.map(subDir => (0, _path.resolve)(dir, subDir))), (0, _operators.mergeMap)(subDir => fsStat$(subDir).pipe((0, _operators.mergeMap)(pathStat => pathStat.isDirectory() ? mapFunc(subDir) : []), (0, _operators.catchError)(subDirStatError => [_plugin_discovery_error.PluginDiscoveryError.invalidPluginPath(subDir, subDirStatError)]))));
}