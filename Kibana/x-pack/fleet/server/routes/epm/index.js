"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRoutes = void 0;

var _constants = require("../../constants");

var _registry = require("../../services/epm/registry");

var _types = require("../../types");

var _handlers = require("./handlers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const MAX_FILE_SIZE_BYTES = 104857600; // 100MB

const registerRoutes = router => {
  router.get({
    path: _constants.EPM_API_ROUTES.CATEGORIES_PATTERN,
    validate: _types.GetCategoriesRequestSchema,
    fleetAuthz: {
      integrations: {
        readPackageInfo: true
      }
    }
  }, _handlers.getCategoriesHandler);
  router.get({
    path: _constants.EPM_API_ROUTES.LIST_PATTERN,
    validate: _types.GetPackagesRequestSchema,
    fleetAuthz: {
      integrations: {
        readPackageInfo: true
      }
    }
  }, _handlers.getListHandler);
  router.get({
    path: _constants.EPM_API_ROUTES.LIMITED_LIST_PATTERN,
    validate: false,
    fleetAuthz: {
      integrations: {
        readPackageInfo: true
      }
    }
  }, _handlers.getLimitedListHandler);
  router.get({
    path: _constants.EPM_API_ROUTES.STATS_PATTERN,
    validate: _types.GetStatsRequestSchema,
    fleetAuthz: {
      integrations: {
        readPackageInfo: true
      }
    }
  }, _handlers.getStatsHandler);
  router.get({
    path: _constants.EPM_API_ROUTES.FILEPATH_PATTERN,
    validate: _types.GetFileRequestSchema,
    fleetAuthz: {
      integrations: {
        readPackageInfo: true
      }
    }
  }, _handlers.getFileHandler);
  router.get({
    path: _constants.EPM_API_ROUTES.INFO_PATTERN,
    validate: _types.GetInfoRequestSchema,
    fleetAuthz: {
      integrations: {
        readPackageInfo: true
      }
    }
  }, _handlers.getInfoHandler);
  router.put({
    path: _constants.EPM_API_ROUTES.INFO_PATTERN,
    validate: _types.UpdatePackageRequestSchema,
    fleetAuthz: {
      integrations: {
        upgradePackages: true,
        writePackageSettings: true
      }
    }
  }, _handlers.updatePackageHandler);
  router.post({
    path: _constants.EPM_API_ROUTES.INSTALL_FROM_REGISTRY_PATTERN,
    validate: _types.InstallPackageFromRegistryRequestSchema,
    fleetAuthz: {
      integrations: {
        installPackages: true
      }
    }
  }, _handlers.installPackageFromRegistryHandler);
  router.post({
    path: _constants.EPM_API_ROUTES.BULK_INSTALL_PATTERN,
    validate: _types.BulkUpgradePackagesFromRegistryRequestSchema,
    fleetAuthz: {
      integrations: {
        installPackages: true,
        upgradePackages: true
      }
    }
  }, _handlers.bulkInstallPackagesFromRegistryHandler); // Only allow upload for superuser

  router.post({
    path: _constants.EPM_API_ROUTES.INSTALL_BY_UPLOAD_PATTERN,
    validate: _types.InstallPackageByUploadRequestSchema,
    options: {
      body: {
        accepts: ['application/gzip', 'application/zip'],
        parse: false,
        maxBytes: MAX_FILE_SIZE_BYTES
      }
    },
    fleetAuthz: {
      integrations: {
        uploadPackages: true
      }
    }
  }, _handlers.installPackageByUploadHandler);
  router.delete({
    path: _constants.EPM_API_ROUTES.DELETE_PATTERN,
    validate: _types.DeletePackageRequestSchema,
    fleetAuthz: {
      integrations: {
        removePackages: true
      }
    }
  }, _handlers.deletePackageHandler); // deprecated since 8.0

  router.get({
    path: _constants.EPM_API_ROUTES.INFO_PATTERN_DEPRECATED,
    validate: _types.GetInfoRequestSchemaDeprecated,
    fleetAuthz: {
      integrations: {
        readPackageInfo: true
      }
    }
  }, async (context, request, response) => {
    var _resp$payload;

    const newRequest = { ...request,
      params: (0, _registry.splitPkgKey)(request.params.pkgkey)
    };
    const resp = await (0, _handlers.getInfoHandler)(context, newRequest, response);

    if ((_resp$payload = resp.payload) !== null && _resp$payload !== void 0 && _resp$payload.item) {
      // returning item as well here, because pkgVersion is optional in new GET endpoint, and if not specified, the router selects the deprecated route
      return response.ok({
        body: {
          item: resp.payload.item,
          response: resp.payload.item
        }
      });
    }

    return resp;
  });
  router.put({
    path: _constants.EPM_API_ROUTES.INFO_PATTERN_DEPRECATED,
    validate: _types.UpdatePackageRequestSchemaDeprecated,
    fleetAuthz: {
      integrations: {
        upgradePackages: true,
        writePackageSettings: true
      }
    }
  }, async (context, request, response) => {
    var _resp$payload2;

    const newRequest = { ...request,
      params: (0, _registry.splitPkgKey)(request.params.pkgkey)
    };
    const resp = await (0, _handlers.updatePackageHandler)(context, newRequest, response);

    if ((_resp$payload2 = resp.payload) !== null && _resp$payload2 !== void 0 && _resp$payload2.item) {
      return response.ok({
        body: {
          response: resp.payload.item
        }
      });
    }

    return resp;
  });
  router.post({
    path: _constants.EPM_API_ROUTES.INSTALL_FROM_REGISTRY_PATTERN_DEPRECATED,
    validate: _types.InstallPackageFromRegistryRequestSchemaDeprecated,
    fleetAuthz: {
      integrations: {
        installPackages: true
      }
    }
  }, async (context, request, response) => {
    var _resp$payload3;

    const newRequest = { ...request,
      params: (0, _registry.splitPkgKey)(request.params.pkgkey)
    };
    const resp = await (0, _handlers.installPackageFromRegistryHandler)(context, newRequest, response);

    if ((_resp$payload3 = resp.payload) !== null && _resp$payload3 !== void 0 && _resp$payload3.items) {
      return response.ok({
        body: {
          response: resp.payload.items
        }
      });
    }

    return resp;
  });
  router.delete({
    path: _constants.EPM_API_ROUTES.DELETE_PATTERN_DEPRECATED,
    validate: _types.DeletePackageRequestSchemaDeprecated,
    fleetAuthz: {
      integrations: {
        removePackages: true
      }
    }
  }, async (context, request, response) => {
    var _resp$payload4;

    const newRequest = { ...request,
      params: (0, _registry.splitPkgKey)(request.params.pkgkey)
    };
    const resp = await (0, _handlers.deletePackageHandler)(context, newRequest, response);

    if ((_resp$payload4 = resp.payload) !== null && _resp$payload4 !== void 0 && _resp$payload4.items) {
      return response.ok({
        body: {
          response: resp.payload.items
        }
      });
    }

    return resp;
  });
};

exports.registerRoutes = registerRoutes;