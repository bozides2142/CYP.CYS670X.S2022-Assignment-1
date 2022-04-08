"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bulkInstallPackages = bulkInstallPackages;
exports.isBulkInstallError = isBulkInstallError;

var _app_context = require("../../app_context");

var Registry = _interopRequireWildcard(require("../registry"));

var _install = require("./install");

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function bulkInstallPackages({
  savedObjectsClient,
  packagesToInstall,
  esClient,
  spaceId,
  force
}) {
  const logger = _app_context.appContextService.getLogger();

  const packagesResults = await Promise.allSettled(packagesToInstall.map(async pkg => {
    if (typeof pkg !== 'string') {
      return Promise.resolve(pkg);
    }

    return Registry.fetchFindLatestPackageOrThrow(pkg);
  }));
  logger.debug(`kicking off bulk install of ${packagesToInstall.map(pkg => typeof pkg === 'string' ? pkg : pkg.name).join(', ')}`);
  const bulkInstallResults = await Promise.allSettled(packagesResults.map(async (result, index) => {
    const packageName = getNameFromPackagesToInstall(packagesToInstall, index);

    if (result.status === 'rejected') {
      return {
        name: packageName,
        error: result.reason
      };
    }

    const pkgKeyProps = result.value;
    const installedPackageResult = await (0, _install.isPackageVersionOrLaterInstalled)({
      savedObjectsClient,
      pkgName: pkgKeyProps.name,
      pkgVersion: pkgKeyProps.version
    });

    if (installedPackageResult) {
      const {
        name,
        version,
        installed_es: installedEs,
        installed_kibana: installedKibana
      } = installedPackageResult.package;
      return {
        name,
        version,
        result: {
          assets: [...installedEs, ...installedKibana],
          status: 'already_installed',
          installType: installedPackageResult.installType
        }
      };
    }

    const pkgkey = Registry.pkgToPkgKey(pkgKeyProps);
    const installResult = await (0, _install.installPackage)({
      savedObjectsClient,
      esClient,
      pkgkey,
      installSource: 'registry',
      spaceId,
      force
    });

    if (installResult.error) {
      return {
        name: packageName,
        error: installResult.error,
        installType: installResult.installType
      };
    }

    return {
      name: packageName,
      version: pkgKeyProps.version,
      result: installResult
    };
  }));
  return bulkInstallResults.map((result, index) => {
    const packageName = getNameFromPackagesToInstall(packagesToInstall, index);

    if (result.status === 'fulfilled') {
      if (result.value && result.value.error) {
        return {
          name: packageName,
          error: result.value.error,
          installType: result.value.installType
        };
      } else {
        return result.value;
      }
    } else {
      return {
        name: packageName,
        error: result.reason
      };
    }
  });
}

function isBulkInstallError(installResponse) {
  return 'error' in installResponse && installResponse.error instanceof Error;
}

function getNameFromPackagesToInstall(packagesToInstall, index) {
  const entry = packagesToInstall[index];
  if (typeof entry === 'string') return entry;
  return entry.name;
}