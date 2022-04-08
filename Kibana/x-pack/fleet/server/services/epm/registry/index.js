"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ensureCachedArchiveInfo = ensureCachedArchiveInfo;
exports.fetchCategories = fetchCategories;
exports.fetchFile = fetchFile;
exports.fetchFindLatestPackageOrThrow = fetchFindLatestPackageOrThrow;
exports.fetchFindLatestPackageOrUndefined = fetchFindLatestPackageOrUndefined;
exports.fetchInfo = fetchInfo;
exports.fetchList = fetchList;
exports.getFile = getFile;
exports.getInfo = getInfo;
exports.getNoticePath = getNoticePath;
exports.getRegistryPackage = getRegistryPackage;
exports.groupPathsByService = groupPathsByService;
exports.splitPkgKey = exports.pkgToPkgKey = void 0;

var _url = require("url");

var _mimeTypes = _interopRequireDefault(require("mime-types"));

var _gte = _interopRequireDefault(require("semver/functions/gte"));

var _common = require("../../../../common");

var _types = require("../../../types");

var _archive = require("../archive");

var _streams = require("../streams");

var _ = require("../..");

var _errors = require("../../../errors");

var _bundled_packages = require("../packages/bundled_packages");

var _requests = require("./requests");

var _registry_url = require("./registry_url");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const splitPkgKey = _common.splitPkgKey;
exports.splitPkgKey = splitPkgKey;

const pkgToPkgKey = ({
  name,
  version
}) => `${name}-${version}`;

exports.pkgToPkgKey = pkgToPkgKey;

async function fetchList(params) {
  const registryUrl = (0, _registry_url.getRegistryUrl)();
  const url = new _url.URL(`${registryUrl}/search`);

  if (params) {
    if (params.category) {
      url.searchParams.set('category', params.category);
    }

    if (params.experimental) {
      url.searchParams.set('experimental', params.experimental.toString());
    }
  }

  setKibanaVersion(url);
  return (0, _requests.fetchUrl)(url.toString()).then(JSON.parse);
}

async function _fetchFindLatestPackage(packageName, options) {
  const logger = _.appContextService.getLogger();

  const {
    ignoreConstraints = false
  } = options !== null && options !== void 0 ? options : {};
  const bundledPackage = await (0, _bundled_packages.getBundledPackageByName)(packageName);
  const registryUrl = (0, _registry_url.getRegistryUrl)();
  const url = new _url.URL(`${registryUrl}/search?package=${packageName}&experimental=true`);

  if (!ignoreConstraints) {
    setKibanaVersion(url);
  }

  try {
    var _searchResults$;

    const res = await (0, _requests.fetchUrl)(url.toString(), 1);
    const searchResults = JSON.parse(res);
    const latestPackageFromRegistry = (_searchResults$ = searchResults[0]) !== null && _searchResults$ !== void 0 ? _searchResults$ : null;

    if (bundledPackage && (0, _gte.default)(bundledPackage.version, latestPackageFromRegistry.version)) {
      return bundledPackage;
    }

    return latestPackageFromRegistry;
  } catch (error) {
    logger.error(`Failed to fetch latest version of ${packageName} from registry: ${error.message}`); // Fall back to the bundled version of the package if it exists

    if (bundledPackage) {
      return bundledPackage;
    } // Otherwise, return null and allow callers to determine whether they'll consider this an error or not


    return null;
  }
}

async function fetchFindLatestPackageOrThrow(packageName, options) {
  const latestPackage = await _fetchFindLatestPackage(packageName, options);

  if (!latestPackage) {
    throw new _errors.PackageNotFoundError(`[${packageName}] package not found in registry`);
  }

  return latestPackage;
}

async function fetchFindLatestPackageOrUndefined(packageName, options) {
  const logger = _.appContextService.getLogger();

  try {
    const latestPackage = await _fetchFindLatestPackage(packageName, options);

    if (!latestPackage) {
      return undefined;
    }

    return latestPackage;
  } catch (error) {
    logger.warn(`Error fetching latest package for ${packageName}: ${error.message}`);
    return undefined;
  }
}

async function fetchInfo(pkgName, pkgVersion) {
  const registryUrl = (0, _registry_url.getRegistryUrl)();

  try {
    const res = await (0, _requests.fetchUrl)(`${registryUrl}/package/${pkgName}/${pkgVersion}`).then(JSON.parse);
    return res;
  } catch (err) {
    if (err instanceof _errors.RegistryResponseError && err.status === 404) {
      throw new _errors.PackageNotFoundError(`${pkgName}@${pkgVersion} not found`);
    }

    throw err;
  }
}

async function getFile(pkgName, pkgVersion, relPath) {
  const filePath = `/package/${pkgName}/${pkgVersion}/${relPath}`;
  return fetchFile(filePath);
}

async function fetchFile(filePath) {
  const registryUrl = (0, _registry_url.getRegistryUrl)();
  return (0, _requests.getResponse)(`${registryUrl}${filePath}`);
}

function setKibanaVersion(url) {
  var _appContextService$ge, _appContextService$ge2, _appContextService$ge3;

  const disableVersionCheck = (_appContextService$ge = (_appContextService$ge2 = _.appContextService.getConfig()) === null || _appContextService$ge2 === void 0 ? void 0 : (_appContextService$ge3 = _appContextService$ge2.developer) === null || _appContextService$ge3 === void 0 ? void 0 : _appContextService$ge3.disableRegistryVersionCheck) !== null && _appContextService$ge !== void 0 ? _appContextService$ge : false;

  if (disableVersionCheck) {
    return;
  }

  const kibanaVersion = _.appContextService.getKibanaVersion().split('-')[0]; // may be x.y.z-SNAPSHOT


  if (kibanaVersion) {
    url.searchParams.set('kibana.version', kibanaVersion);
  }
}

async function fetchCategories(params) {
  const registryUrl = (0, _registry_url.getRegistryUrl)();
  const url = new _url.URL(`${registryUrl}/categories`);

  if (params) {
    if (params.experimental) {
      url.searchParams.set('experimental', params.experimental.toString());
    }

    if (params.include_policy_templates) {
      url.searchParams.set('include_policy_templates', params.include_policy_templates.toString());
    }
  }

  setKibanaVersion(url);
  return (0, _requests.fetchUrl)(url.toString()).then(JSON.parse);
}

async function getInfo(name, version) {
  let packageInfo = (0, _archive.getPackageInfo)({
    name,
    version
  });

  if (!packageInfo) {
    packageInfo = await fetchInfo(name, version);
    (0, _archive.setPackageInfo)({
      name,
      version,
      packageInfo
    });
  }

  return packageInfo;
}

async function getRegistryPackage(name, version) {
  const installSource = 'registry';
  let paths = (0, _archive.getArchiveFilelist)({
    name,
    version
  });

  if (!paths || paths.length === 0) {
    const {
      archiveBuffer,
      archivePath
    } = await fetchArchiveBuffer(name, version);
    paths = await (0, _archive.unpackBufferToCache)({
      name,
      version,
      installSource,
      archiveBuffer,
      contentType: ensureContentType(archivePath)
    });
  }

  const packageInfo = await getInfo(name, version);
  return {
    paths,
    packageInfo
  };
}

function ensureContentType(archivePath) {
  const contentType = _mimeTypes.default.lookup(archivePath);

  if (!contentType) {
    throw new Error(`Unknown compression format for '${archivePath}'. Please use .zip or .gz`);
  }

  return contentType;
}

async function ensureCachedArchiveInfo(name, version, installSource = 'registry') {
  const paths = (0, _archive.getArchiveFilelist)({
    name,
    version
  });

  if (!paths || paths.length === 0) {
    if (installSource === 'registry') {
      await getRegistryPackage(name, version);
    } else {
      throw new _errors.PackageCacheError(`Package ${name}-${version} not cached. If it was uploaded, try uninstalling and reinstalling manually.`);
    }
  }
}

async function fetchArchiveBuffer(pkgName, pkgVersion) {
  const {
    download: archivePath
  } = await getInfo(pkgName, pkgVersion);
  const archiveUrl = `${(0, _registry_url.getRegistryUrl)()}${archivePath}`;
  const archiveBuffer = await (0, _requests.getResponseStream)(archiveUrl).then(_streams.streamToBuffer);
  return {
    archiveBuffer,
    archivePath
  };
}

function groupPathsByService(paths) {
  const kibanaAssetTypes = Object.values(_types.KibanaAssetType); // ASK: best way, if any, to avoid `any`?

  const assets = paths.reduce((map, path) => {
    const parts = (0, _archive.getPathParts)(path.replace(/^\/package\//, ''));

    if (parts.service === 'kibana' && kibanaAssetTypes.includes(parts.type) || parts.service === 'elasticsearch') {
      if (!map[parts.service]) map[parts.service] = {};
      if (!map[parts.service][parts.type]) map[parts.service][parts.type] = [];
      map[parts.service][parts.type].push(parts);
    }

    return map;
  }, {});
  return {
    kibana: assets.kibana,
    elasticsearch: assets.elasticsearch
  };
}

function getNoticePath(paths) {
  for (const path of paths) {
    const parts = (0, _archive.getPathParts)(path.replace(/^\/package\//, ''));

    if (parts.type === 'notice') {
      const {
        pkgName,
        pkgVersion
      } = splitPkgKey(parts.pkgkey);
      return `/package/${pkgName}/${pkgVersion}/${parts.file}`;
    }
  }

  return undefined;
}