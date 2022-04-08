"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PackageNotInstalledError = void 0;
Object.defineProperty(exports, "bulkInstallPackages", {
  enumerable: true,
  get: function () {
    return _bulk_install_packages.bulkInstallPackages;
  }
});
exports.createInstallableFrom = createInstallableFrom;
Object.defineProperty(exports, "ensureInstalledPackage", {
  enumerable: true,
  get: function () {
    return _install.ensureInstalledPackage;
  }
});
Object.defineProperty(exports, "getCategories", {
  enumerable: true,
  get: function () {
    return _get.getCategories;
  }
});
Object.defineProperty(exports, "getFile", {
  enumerable: true,
  get: function () {
    return _get.getFile;
  }
});
Object.defineProperty(exports, "getInstallation", {
  enumerable: true,
  get: function () {
    return _get.getInstallation;
  }
});
Object.defineProperty(exports, "getInstallationObject", {
  enumerable: true,
  get: function () {
    return _get.getInstallationObject;
  }
});
Object.defineProperty(exports, "getInstallations", {
  enumerable: true,
  get: function () {
    return _get.getInstallations;
  }
});
Object.defineProperty(exports, "getLimitedPackages", {
  enumerable: true,
  get: function () {
    return _get.getLimitedPackages;
  }
});
Object.defineProperty(exports, "getPackageInfo", {
  enumerable: true,
  get: function () {
    return _get.getPackageInfo;
  }
});
Object.defineProperty(exports, "getPackageInfoFromRegistry", {
  enumerable: true,
  get: function () {
    return _get.getPackageInfoFromRegistry;
  }
});
Object.defineProperty(exports, "getPackages", {
  enumerable: true,
  get: function () {
    return _get.getPackages;
  }
});
Object.defineProperty(exports, "handleInstallPackageFailure", {
  enumerable: true,
  get: function () {
    return _install.handleInstallPackageFailure;
  }
});
Object.defineProperty(exports, "installPackage", {
  enumerable: true,
  get: function () {
    return _install.installPackage;
  }
});
Object.defineProperty(exports, "isBulkInstallError", {
  enumerable: true,
  get: function () {
    return _bulk_install_packages.isBulkInstallError;
  }
});
exports.kibanaSavedObjectTypes = void 0;
Object.defineProperty(exports, "removeInstallation", {
  enumerable: true,
  get: function () {
    return _remove.removeInstallation;
  }
});
exports.savedObjectTypes = void 0;

var _common = require("../../../../common");

var _types = require("../../../types");

var _bulk_install_packages = require("./bulk_install_packages");

var _get = require("./get");

var _install = require("./install");

var _remove = require("./remove");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class PackageNotInstalledError extends Error {
  constructor(pkgkey) {
    super(`${pkgkey} is not installed`);
  }

} // only Kibana Assets use Saved Objects at this point


exports.PackageNotInstalledError = PackageNotInstalledError;
const savedObjectTypes = Object.values(_types.KibanaAssetType);
exports.savedObjectTypes = savedObjectTypes;
const kibanaSavedObjectTypes = Object.values(_common.KibanaSavedObjectType);
exports.kibanaSavedObjectTypes = kibanaSavedObjectTypes;

function createInstallableFrom(from, savedObject) {
  return savedObject ? { ...from,
    status: savedObject.attributes.install_status,
    savedObject
  } : { ...from,
    status: _common.installationStatuses.NotInstalled
  };
}