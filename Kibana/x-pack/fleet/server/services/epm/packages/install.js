"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createInstallation = createInstallation;
exports.ensureInstalledPackage = ensureInstalledPackage;
exports.ensurePackagesCompletedInstall = ensurePackagesCompletedInstall;
exports.getInstallType = getInstallType;
exports.handleInstallPackageFailure = handleInstallPackageFailure;
exports.installPackage = installPackage;
exports.isPackageInstalled = isPackageInstalled;
exports.isPackageVersionOrLaterInstalled = isPackageVersionOrLaterInstalled;
exports.updateVersion = exports.updateInstallStatus = exports.saveKibanaAssetsRefs = exports.saveInstalledEsRefs = exports.removeAssetTypesFromInstalledEs = void 0;

var _i18n = require("@kbn/i18n");

var _lt = _interopRequireDefault(require("semver/functions/lt"));

var _template = require("../elasticsearch/template/template");

var _constants = require("../../../../../spaces/common/constants");

var _common = require("../../../../common");

var _errors = require("../../../errors");

var _constants2 = require("../../../constants");

var _ = require("../../");

var _app_context = require("../../app_context");

var Registry = _interopRequireWildcard(require("../registry"));

var _archive = require("../archive");

var _install = require("../kibana/assets/install");

var _upgrade_sender = require("../../upgrade_sender");

var _index = require("./index");

var _remove = require("./remove");

var _get = require("./get");

var _install_package = require("./_install_package");

var _cleanup = require("./cleanup");

var _bundled_packages = require("./bundled_packages");

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


async function isPackageInstalled(options) {
  const installedPackage = await (0, _index.getInstallation)(options);
  return installedPackage !== undefined;
}

async function isPackageVersionOrLaterInstalled(options) {
  const {
    savedObjectsClient,
    pkgName,
    pkgVersion
  } = options;
  const installedPackageObject = await (0, _index.getInstallationObject)({
    savedObjectsClient,
    pkgName
  });
  const installedPackage = installedPackageObject === null || installedPackageObject === void 0 ? void 0 : installedPackageObject.attributes;

  if (installedPackage && (installedPackage.version === pkgVersion || (0, _lt.default)(pkgVersion, installedPackage.version))) {
    let installType;

    try {
      installType = getInstallType({
        pkgVersion,
        installedPkg: installedPackageObject
      });
    } catch (e) {
      installType = 'unknown';
    }

    return {
      package: installedPackage,
      installType
    };
  }

  return false;
}

async function ensureInstalledPackage(options) {
  const {
    savedObjectsClient,
    pkgName,
    esClient,
    pkgVersion,
    spaceId = _constants.DEFAULT_SPACE_ID
  } = options; // If pkgVersion isn't specified, find the latest package version

  const pkgKeyProps = pkgVersion ? {
    name: pkgName,
    version: pkgVersion
  } : await Registry.fetchFindLatestPackageOrThrow(pkgName);
  const installedPackageResult = await isPackageVersionOrLaterInstalled({
    savedObjectsClient,
    pkgName: pkgKeyProps.name,
    pkgVersion: pkgKeyProps.version
  });

  if (installedPackageResult) {
    return installedPackageResult.package;
  }

  const pkgkey = Registry.pkgToPkgKey(pkgKeyProps);
  const installResult = await installPackage({
    installSource: 'registry',
    savedObjectsClient,
    pkgkey,
    spaceId,
    esClient,
    force: true // Always force outdated packages to be installed if a later version isn't installed

  });

  if (installResult.error) {
    const errorPrefix = installResult.installType === 'update' || installResult.installType === 'reupdate' ? _i18n.i18n.translate('xpack.fleet.epm.install.packageUpdateError', {
      defaultMessage: 'Error updating {pkgName} to {pkgVersion}',
      values: {
        pkgName: pkgKeyProps.name,
        pkgVersion: pkgKeyProps.version
      }
    }) : _i18n.i18n.translate('xpack.fleet.epm.install.packageInstallError', {
      defaultMessage: 'Error installing {pkgName} {pkgVersion}',
      values: {
        pkgName: pkgKeyProps.name,
        pkgVersion: pkgKeyProps.version
      }
    });
    throw new Error(`${errorPrefix}: ${installResult.error.message}`);
  }

  const installation = await (0, _index.getInstallation)({
    savedObjectsClient,
    pkgName
  });
  if (!installation) throw new Error(`could not get installation ${pkgName}`);
  return installation;
}

async function handleInstallPackageFailure({
  savedObjectsClient,
  error,
  pkgName,
  pkgVersion,
  installedPkg,
  esClient,
  spaceId
}) {
  if (error instanceof _errors.IngestManagerError) {
    return;
  }

  const logger = _app_context.appContextService.getLogger();

  const pkgkey = Registry.pkgToPkgKey({
    name: pkgName,
    version: pkgVersion
  }); // if there is an unknown server error, uninstall any package assets or reinstall the previous version if update

  try {
    const installType = getInstallType({
      pkgVersion,
      installedPkg
    });

    if (installType === 'install' || installType === 'reinstall') {
      logger.error(`uninstalling ${pkgkey} after error installing: [${error.toString()}]`);
      await (0, _remove.removeInstallation)({
        savedObjectsClient,
        pkgName,
        pkgVersion,
        esClient
      });
    }

    await updateInstallStatus({
      savedObjectsClient,
      pkgName,
      status: 'install_failed'
    });

    if (installType === 'update') {
      if (!installedPkg) {
        logger.error(`failed to rollback package after installation error ${error} because saved object was undefined`);
        return;
      }

      const prevVersion = `${pkgName}-${installedPkg.attributes.version}`;
      logger.error(`rolling back to ${prevVersion} after error installing ${pkgkey}`);
      await installPackage({
        installSource: 'registry',
        savedObjectsClient,
        pkgkey: prevVersion,
        esClient,
        spaceId,
        force: true
      });
    }
  } catch (e) {
    logger.error(`failed to uninstall or rollback package after installation error ${e}`);
  }
}

function getTelemetryEvent(pkgName, pkgVersion) {
  return {
    packageName: pkgName,
    currentVersion: 'unknown',
    newVersion: pkgVersion,
    status: 'failure',
    dryRun: false,
    eventType: _upgrade_sender.UpdateEventType.PACKAGE_INSTALL,
    installType: 'unknown'
  };
}

function sendEvent(telemetryEvent) {
  (0, _upgrade_sender.sendTelemetryEvents)(_app_context.appContextService.getLogger(), _app_context.appContextService.getTelemetryEventsSender(), telemetryEvent);
}

async function installPackageFromRegistry({
  savedObjectsClient,
  pkgkey,
  esClient,
  spaceId,
  force = false,
  ignoreConstraints = false
}) {
  const logger = _app_context.appContextService.getLogger(); // TODO: change epm API to /packageName/version so we don't need to do this


  const {
    pkgName,
    pkgVersion
  } = Registry.splitPkgKey(pkgkey); // if an error happens during getInstallType, report that we don't know

  let installType = 'unknown';
  const telemetryEvent = getTelemetryEvent(pkgName, pkgVersion);

  try {
    // get the currently installed package
    const installedPkg = await (0, _index.getInstallationObject)({
      savedObjectsClient,
      pkgName
    });
    installType = getInstallType({
      pkgVersion,
      installedPkg
    }); // get latest package version

    const latestPackage = await Registry.fetchFindLatestPackageOrThrow(pkgName, {
      ignoreConstraints
    }); // let the user install if using the force flag or needing to reinstall or install a previous version due to failed update

    const installOutOfDateVersionOk = force || ['reinstall', 'reupdate', 'rollback'].includes(installType); // if the requested version is the same as installed version, check if we allow it based on
    // current installed package status and force flag, if we don't allow it,
    // just return the asset references from the existing installation

    if ((installedPkg === null || installedPkg === void 0 ? void 0 : installedPkg.attributes.version) === pkgVersion && (installedPkg === null || installedPkg === void 0 ? void 0 : installedPkg.attributes.install_status) === 'installed') {
      if (!force) {
        logger.debug(`${pkgkey} is already installed, skipping installation`);
        return {
          assets: [...installedPkg.attributes.installed_es, ...installedPkg.attributes.installed_kibana],
          status: 'already_installed',
          installType
        };
      }
    }

    telemetryEvent.installType = installType;
    telemetryEvent.currentVersion = (installedPkg === null || installedPkg === void 0 ? void 0 : installedPkg.attributes.version) || 'not_installed'; // if the requested version is out-of-date of the latest package version, check if we allow it
    // if we don't allow it, return an error

    if ((0, _lt.default)(pkgVersion, latestPackage.version)) {
      if (!installOutOfDateVersionOk) {
        throw new _errors.PackageOutdatedError(`${pkgkey} is out-of-date and cannot be installed or updated`);
      }

      logger.debug(`${pkgkey} is out-of-date, installing anyway due to ${force ? 'force flag' : `install type ${installType}`}`);
    } // get package info


    const {
      paths,
      packageInfo
    } = await Registry.getRegistryPackage(pkgName, pkgVersion);

    if (!_.licenseService.hasAtLeast(packageInfo.license || 'basic')) {
      const err = new Error(`Requires ${packageInfo.license} license`);
      sendEvent({ ...telemetryEvent,
        errorMessage: err.message
      });
      return {
        error: err,
        installType
      };
    }

    const savedObjectsImporter = _app_context.appContextService.getSavedObjects().createImporter(savedObjectsClient); // try installing the package, if there was an error, call error handler and rethrow
    // @ts-expect-error status is string instead of InstallResult.status 'installed' | 'already_installed'


    return (0, _install_package._installPackage)({
      savedObjectsClient,
      savedObjectsImporter,
      esClient,
      logger,
      installedPkg,
      paths,
      packageInfo,
      installType,
      spaceId,
      installSource: 'registry'
    }).then(async assets => {
      await (0, _cleanup.removeOldAssets)({
        soClient: savedObjectsClient,
        pkgName: packageInfo.name,
        currentVersion: packageInfo.version
      });
      sendEvent({ ...telemetryEvent,
        status: 'success'
      });
      return {
        assets,
        status: 'installed',
        installType
      };
    }).catch(async err => {
      logger.warn(`Failure to install package [${pkgName}]: [${err.toString()}]`);
      await handleInstallPackageFailure({
        savedObjectsClient,
        error: err,
        pkgName,
        pkgVersion,
        installedPkg,
        spaceId,
        esClient
      });
      sendEvent({ ...telemetryEvent,
        errorMessage: err.message
      });
      return {
        error: err,
        installType
      };
    });
  } catch (e) {
    sendEvent({ ...telemetryEvent,
      errorMessage: e.message
    });
    return {
      error: e,
      installType
    };
  }
}

async function installPackageByUpload({
  savedObjectsClient,
  esClient,
  archiveBuffer,
  contentType,
  spaceId
}) {
  const logger = _app_context.appContextService.getLogger(); // if an error happens during getInstallType, report that we don't know


  let installType = 'unknown';
  const telemetryEvent = getTelemetryEvent('', '');

  try {
    const {
      packageInfo
    } = await (0, _archive.parseAndVerifyArchiveEntries)(archiveBuffer, contentType);
    const installedPkg = await (0, _index.getInstallationObject)({
      savedObjectsClient,
      pkgName: packageInfo.name
    });
    installType = getInstallType({
      pkgVersion: packageInfo.version,
      installedPkg
    });
    telemetryEvent.packageName = packageInfo.name;
    telemetryEvent.newVersion = packageInfo.version;
    telemetryEvent.installType = installType;
    telemetryEvent.currentVersion = (installedPkg === null || installedPkg === void 0 ? void 0 : installedPkg.attributes.version) || 'not_installed';
    const installSource = 'upload';
    const paths = await (0, _archive.unpackBufferToCache)({
      name: packageInfo.name,
      version: packageInfo.version,
      installSource,
      archiveBuffer,
      contentType
    });
    (0, _archive.setPackageInfo)({
      name: packageInfo.name,
      version: packageInfo.version,
      packageInfo
    });

    const savedObjectsImporter = _app_context.appContextService.getSavedObjects().createImporter(savedObjectsClient); // @ts-expect-error status is string instead of InstallResult.status 'installed' | 'already_installed'


    return (0, _install_package._installPackage)({
      savedObjectsClient,
      savedObjectsImporter,
      esClient,
      logger,
      installedPkg,
      paths,
      packageInfo,
      installType,
      installSource,
      spaceId
    }).then(assets => {
      sendEvent({ ...telemetryEvent,
        status: 'success'
      });
      return {
        assets,
        status: 'installed',
        installType
      };
    }).catch(async err => {
      sendEvent({ ...telemetryEvent,
        errorMessage: err.message
      });
      return {
        error: err,
        installType
      };
    });
  } catch (e) {
    sendEvent({ ...telemetryEvent,
      errorMessage: e.message
    });
    return {
      error: e,
      installType
    };
  }
}

async function installPackage(args) {
  if (!('installSource' in args)) {
    throw new Error('installSource is required');
  }

  const logger = _app_context.appContextService.getLogger();

  const {
    savedObjectsClient,
    esClient
  } = args;
  const bundledPackages = await (0, _bundled_packages.getBundledPackages)();

  if (args.installSource === 'registry') {
    const {
      pkgkey,
      force,
      ignoreConstraints,
      spaceId
    } = args;
    const matchingBundledPackage = bundledPackages.find(pkg => Registry.pkgToPkgKey(pkg) === pkgkey);

    if (matchingBundledPackage) {
      logger.debug(`found bundled package for requested install of ${pkgkey} - installing from bundled package archive`);
      const response = installPackageByUpload({
        savedObjectsClient,
        esClient,
        archiveBuffer: matchingBundledPackage.buffer,
        contentType: 'application/zip',
        spaceId
      });
      return response;
    }

    logger.debug(`kicking off install of ${pkgkey} from registry`);
    const response = installPackageFromRegistry({
      savedObjectsClient,
      pkgkey,
      esClient,
      spaceId,
      force,
      ignoreConstraints
    });
    return response;
  } else if (args.installSource === 'upload') {
    const {
      archiveBuffer,
      contentType,
      spaceId
    } = args;
    const response = installPackageByUpload({
      savedObjectsClient,
      esClient,
      archiveBuffer,
      contentType,
      spaceId
    });
    return response;
  } // @ts-expect-error s/b impossibe b/c `never` by this point, but just in case


  throw new Error(`Unknown installSource: ${args.installSource}`);
}

const updateVersion = async (savedObjectsClient, pkgName, pkgVersion) => {
  return savedObjectsClient.update(_constants2.PACKAGES_SAVED_OBJECT_TYPE, pkgName, {
    version: pkgVersion
  });
};

exports.updateVersion = updateVersion;

const updateInstallStatus = async ({
  savedObjectsClient,
  pkgName,
  status
}) => {
  return savedObjectsClient.update(_constants2.PACKAGES_SAVED_OBJECT_TYPE, pkgName, {
    install_status: status
  });
};

exports.updateInstallStatus = updateInstallStatus;

async function createInstallation(options) {
  const {
    savedObjectsClient,
    packageInfo,
    installSource
  } = options;
  const {
    name: pkgName,
    version: pkgVersion
  } = packageInfo;
  const toSaveESIndexPatterns = (0, _template.generateESIndexPatterns)(packageInfo.data_streams); // For "stack-aligned" packages, default the `keep_policies_up_to_date` setting to true. For all other
  // packages, default it to undefined. Use undefined rather than false to allow us to differentiate
  // between "unset" and "user explicitly disabled".

  const defaultKeepPoliciesUpToDate = _common.AUTO_UPGRADE_POLICIES_PACKAGES.some(({
    name
  }) => name === packageInfo.name) ? true : undefined; // TODO cleanup removable flag and isUnremovablePackage function

  const created = await savedObjectsClient.create(_constants2.PACKAGES_SAVED_OBJECT_TYPE, {
    installed_kibana: [],
    installed_kibana_space_id: options.spaceId,
    installed_es: [],
    package_assets: [],
    es_index_patterns: toSaveESIndexPatterns,
    name: pkgName,
    version: pkgVersion,
    removable: true,
    install_version: pkgVersion,
    install_status: 'installing',
    install_started_at: new Date().toISOString(),
    install_source: installSource,
    keep_policies_up_to_date: defaultKeepPoliciesUpToDate
  }, {
    id: pkgName,
    overwrite: true
  });
  return created;
}

const saveKibanaAssetsRefs = async (savedObjectsClient, pkgName, kibanaAssets) => {
  const assetRefs = Object.values(kibanaAssets).flat().map(_install.toAssetReference);
  await savedObjectsClient.update(_constants2.PACKAGES_SAVED_OBJECT_TYPE, pkgName, {
    installed_kibana: assetRefs
  });
  return assetRefs;
};

exports.saveKibanaAssetsRefs = saveKibanaAssetsRefs;

const saveInstalledEsRefs = async (savedObjectsClient, pkgName, installedAssets) => {
  const installedPkg = await (0, _index.getInstallationObject)({
    savedObjectsClient,
    pkgName
  });
  const installedAssetsToSave = installedPkg === null || installedPkg === void 0 ? void 0 : installedPkg.attributes.installed_es.concat(installedAssets);
  const deduplicatedAssets = (installedAssetsToSave === null || installedAssetsToSave === void 0 ? void 0 : installedAssetsToSave.reduce((acc, currentAsset) => {
    const foundAsset = acc.find(asset => asset.id === currentAsset.id);

    if (!foundAsset) {
      return acc.concat([currentAsset]);
    } else {
      return acc;
    }
  }, [])) || [];
  await savedObjectsClient.update(_constants2.PACKAGES_SAVED_OBJECT_TYPE, pkgName, {
    installed_es: deduplicatedAssets
  });
  return installedAssets;
};

exports.saveInstalledEsRefs = saveInstalledEsRefs;

const removeAssetTypesFromInstalledEs = async (savedObjectsClient, pkgName, assetTypes) => {
  const installedPkg = await (0, _index.getInstallationObject)({
    savedObjectsClient,
    pkgName
  });
  const installedAssets = installedPkg === null || installedPkg === void 0 ? void 0 : installedPkg.attributes.installed_es;
  if (!(installedAssets !== null && installedAssets !== void 0 && installedAssets.length)) return;
  const installedAssetsToSave = installedAssets === null || installedAssets === void 0 ? void 0 : installedAssets.filter(asset => !assetTypes.includes(asset.type));
  return savedObjectsClient.update(_constants2.PACKAGES_SAVED_OBJECT_TYPE, pkgName, {
    installed_es: installedAssetsToSave
  });
};

exports.removeAssetTypesFromInstalledEs = removeAssetTypesFromInstalledEs;

async function ensurePackagesCompletedInstall(savedObjectsClient, esClient) {
  const installingPackages = await (0, _get.getPackageSavedObjects)(savedObjectsClient, {
    searchFields: ['install_status'],
    search: 'installing'
  });
  const installingPromises = installingPackages.saved_objects.reduce((acc, pkg) => {
    const startDate = pkg.attributes.install_started_at;
    const nowDate = new Date().toISOString();
    const elapsedTime = Date.parse(nowDate) - Date.parse(startDate);
    const pkgkey = `${pkg.attributes.name}-${pkg.attributes.install_version}`; // reinstall package

    if (elapsedTime > _constants2.MAX_TIME_COMPLETE_INSTALL) {
      acc.push(installPackage({
        installSource: 'registry',
        savedObjectsClient,
        pkgkey,
        esClient,
        spaceId: pkg.attributes.installed_kibana_space_id || _constants.DEFAULT_SPACE_ID
      }));
    }

    return acc;
  }, []);
  await Promise.all(installingPromises);
  return installingPackages;
} // implementation


function getInstallType(args) {
  const {
    pkgVersion,
    installedPkg
  } = args;
  if (!installedPkg) return 'install';
  const currentPkgVersion = installedPkg.attributes.version;
  const lastStartedInstallVersion = installedPkg.attributes.install_version;
  if (pkgVersion === currentPkgVersion && pkgVersion !== lastStartedInstallVersion) return 'rollback';
  if (pkgVersion === currentPkgVersion) return 'reinstall';
  if (pkgVersion === lastStartedInstallVersion && pkgVersion !== currentPkgVersion) return 'reupdate';
  if (pkgVersion !== lastStartedInstallVersion && pkgVersion !== currentPkgVersion) return 'update';
  throw new Error('unknown install type');
}