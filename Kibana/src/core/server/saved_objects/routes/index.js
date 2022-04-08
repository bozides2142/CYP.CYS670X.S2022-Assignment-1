"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRoutes = registerRoutes;

var _get = require("./get");

var _resolve = require("./resolve");

var _create = require("./create");

var _delete = require("./delete");

var _find = require("./find");

var _update = require("./update");

var _bulk_get = require("./bulk_get");

var _bulk_create = require("./bulk_create");

var _bulk_update = require("./bulk_update");

var _export = require("./export");

var _import = require("./import");

var _resolve_import_errors = require("./resolve_import_errors");

var _migrate = require("./migrate");

var _import2 = require("./legacy_import_export/import");

var _export2 = require("./legacy_import_export/export");

var _bulk_resolve = require("./bulk_resolve");

var _deprecations = require("./deprecations");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function registerRoutes({
  http,
  coreUsageData,
  logger,
  config,
  migratorPromise,
  kibanaVersion,
  kibanaIndex
}) {
  const router = http.createRouter('/api/saved_objects/');
  (0, _get.registerGetRoute)(router, {
    coreUsageData
  });
  (0, _resolve.registerResolveRoute)(router, {
    coreUsageData
  });
  (0, _create.registerCreateRoute)(router, {
    coreUsageData
  });
  (0, _delete.registerDeleteRoute)(router, {
    coreUsageData
  });
  (0, _find.registerFindRoute)(router, {
    coreUsageData
  });
  (0, _update.registerUpdateRoute)(router, {
    coreUsageData
  });
  (0, _bulk_get.registerBulkGetRoute)(router, {
    coreUsageData
  });
  (0, _bulk_create.registerBulkCreateRoute)(router, {
    coreUsageData
  });
  (0, _bulk_resolve.registerBulkResolveRoute)(router, {
    coreUsageData
  });
  (0, _bulk_update.registerBulkUpdateRoute)(router, {
    coreUsageData
  });
  (0, _export.registerExportRoute)(router, {
    config,
    coreUsageData
  });
  (0, _import.registerImportRoute)(router, {
    config,
    coreUsageData
  });
  (0, _resolve_import_errors.registerResolveImportErrorsRoute)(router, {
    config,
    coreUsageData
  });
  const legacyRouter = http.createRouter('');
  (0, _import2.registerLegacyImportRoute)(legacyRouter, {
    maxImportPayloadBytes: config.maxImportPayloadBytes,
    coreUsageData,
    logger
  });
  (0, _export2.registerLegacyExportRoute)(legacyRouter, {
    kibanaVersion,
    coreUsageData,
    logger
  });
  const internalRouter = http.createRouter('/internal/saved_objects/');
  (0, _migrate.registerMigrateRoute)(internalRouter, migratorPromise);
  (0, _deprecations.registerDeleteUnknownTypesRoute)(internalRouter, {
    kibanaIndex,
    kibanaVersion
  });
}