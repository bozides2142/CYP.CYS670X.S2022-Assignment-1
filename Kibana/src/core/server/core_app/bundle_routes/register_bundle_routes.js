"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerBundleRoutes = registerBundleRoutes;

var _path = require("path");

var _utils = require("@kbn/utils");

var _uiSharedDepsNpm = _interopRequireDefault(require("@kbn/ui-shared-deps-npm"));

var UiSharedDepsSrc = _interopRequireWildcard(require("@kbn/ui-shared-deps-src"));

var _file_hash_cache = require("./file_hash_cache");

var _bundles_route = require("./bundles_route");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 *  Creates the routes that serves files from `bundlesPath`.
 *
 *  @param {Object} options
 *  @property {Array<{id,path}>} options.npUiPluginPublicDirs array of ids and paths that should be served for new platform plugins
 *  @property {string} options.regularBundlesPath
 *  @property {string} options.basePublicPath
 *
 *  @return Array.of({Hapi.Route})
 */
function registerBundleRoutes({
  router,
  serverBasePath,
  uiPlugins,
  packageInfo
}) {
  const {
    dist: isDist,
    buildNum
  } = packageInfo; // rather than calculate the fileHash on every request, we
  // provide a cache object to `resolveDynamicAssetResponse()` that
  // will store the most recently used hashes.

  const fileHashCache = new _file_hash_cache.FileHashCache();
  (0, _bundles_route.registerRouteForBundle)(router, {
    publicPath: `${serverBasePath}/${buildNum}/bundles/kbn-ui-shared-deps-npm/`,
    routePath: `/${buildNum}/bundles/kbn-ui-shared-deps-npm/`,
    bundlesPath: _uiSharedDepsNpm.default.distDir,
    fileHashCache,
    isDist
  });
  (0, _bundles_route.registerRouteForBundle)(router, {
    publicPath: `${serverBasePath}/${buildNum}/bundles/kbn-ui-shared-deps-src/`,
    routePath: `/${buildNum}/bundles/kbn-ui-shared-deps-src/`,
    bundlesPath: UiSharedDepsSrc.distDir,
    fileHashCache,
    isDist
  });
  (0, _bundles_route.registerRouteForBundle)(router, {
    publicPath: `${serverBasePath}/${buildNum}/bundles/core/`,
    routePath: `/${buildNum}/bundles/core/`,
    bundlesPath: (0, _utils.fromRoot)((0, _path.join)('src', 'core', 'target', 'public')),
    fileHashCache,
    isDist
  });
  [...uiPlugins.internal.entries()].forEach(([id, {
    publicTargetDir,
    version
  }]) => {
    (0, _bundles_route.registerRouteForBundle)(router, {
      publicPath: `${serverBasePath}/${buildNum}/bundles/plugin/${id}/${version}/`,
      routePath: `/${buildNum}/bundles/plugin/${id}/${version}/`,
      bundlesPath: publicTargetDir,
      fileHashCache,
      isDist
    });
  });
}