"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PackageServiceImpl = void 0;

var _classPrivateMethodGet2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateMethodGet"));

var _security = require("../../routes/security");

var _errors = require("../../errors");

var _install = require("./elasticsearch/transform/install");

var _registry = require("./registry");

var _packages = require("./packages");

function _classPrivateMethodInitSpec(obj, privateSet) {
  _checkPrivateRedeclaration(obj, privateSet);

  privateSet.add(obj);
}

function _checkPrivateRedeclaration(obj, privateCollection) {
  if (privateCollection.has(obj)) {
    throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
}

class PackageServiceImpl {
  constructor(internalEsClient, internalSoClient, logger) {
    this.internalEsClient = internalEsClient;
    this.internalSoClient = internalSoClient;
    this.logger = logger;
  }

  asScoped(request) {
    const preflightCheck = () => {
      if (!(0, _security.checkSuperuser)(request)) {
        throw new _errors.FleetUnauthorizedError(`User does not have adequate permissions to access Fleet packages.`);
      }
    };

    return new PackageClientImpl(this.internalEsClient, this.internalSoClient, this.logger, preflightCheck);
  }

  get asInternalUser() {
    return new PackageClientImpl(this.internalEsClient, this.internalSoClient, this.logger);
  }

}

exports.PackageServiceImpl = PackageServiceImpl;

var _reinstallTransforms = /*#__PURE__*/new WeakSet();

var _runPreflight = /*#__PURE__*/new WeakSet();

class PackageClientImpl {
  constructor(internalEsClient, internalSoClient, logger, preflightCheck) {
    _classPrivateMethodInitSpec(this, _runPreflight);

    _classPrivateMethodInitSpec(this, _reinstallTransforms);

    this.internalEsClient = internalEsClient;
    this.internalSoClient = internalSoClient;
    this.logger = logger;
    this.preflightCheck = preflightCheck;
  }

  async getInstallation(pkgName) {
    await (0, _classPrivateMethodGet2.default)(this, _runPreflight, _runPreflight2).call(this);
    return (0, _packages.getInstallation)({
      pkgName,
      savedObjectsClient: this.internalSoClient
    });
  }

  async ensureInstalledPackage(options) {
    await (0, _classPrivateMethodGet2.default)(this, _runPreflight, _runPreflight2).call(this);
    return (0, _packages.ensureInstalledPackage)({ ...options,
      esClient: this.internalEsClient,
      savedObjectsClient: this.internalSoClient
    });
  }

  async fetchFindLatestPackage(packageName) {
    await (0, _classPrivateMethodGet2.default)(this, _runPreflight, _runPreflight2).call(this);
    return (0, _registry.fetchFindLatestPackageOrThrow)(packageName);
  }

  async getRegistryPackage(packageName, packageVersion) {
    await (0, _classPrivateMethodGet2.default)(this, _runPreflight, _runPreflight2).call(this);
    return (0, _registry.getRegistryPackage)(packageName, packageVersion);
  }

  async reinstallEsAssets(packageInfo, assetPaths) {
    await (0, _classPrivateMethodGet2.default)(this, _runPreflight, _runPreflight2).call(this);
    let installedAssets = [];
    const transformPaths = assetPaths.filter(_install.isTransform);

    if (transformPaths.length !== assetPaths.length) {
      throw new Error('reinstallEsAssets is currently only implemented for transform assets');
    }

    if (transformPaths.length) {
      const installedTransformAssets = await (0, _classPrivateMethodGet2.default)(this, _reinstallTransforms, _reinstallTransforms2).call(this, packageInfo, transformPaths);
      installedAssets = [...installedAssets, ...installedTransformAssets];
    }

    return installedAssets;
  }

}

function _reinstallTransforms2(packageInfo, paths) {
  return (0, _install.installTransform)(packageInfo, paths, this.internalEsClient, this.internalSoClient, this.logger);
}

function _runPreflight2() {
  if (this.preflightCheck) {
    return this.preflightCheck();
  }
}