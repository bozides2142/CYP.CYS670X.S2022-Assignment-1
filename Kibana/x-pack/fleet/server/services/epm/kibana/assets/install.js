"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSavedObjectKibanaAsset = createSavedObjectKibanaAsset;
exports.deleteKibanaInstalledRefs = void 0;
exports.getKibanaAsset = getKibanaAsset;
exports.getKibanaAssets = getKibanaAssets;
exports.installKibanaAssets = installKibanaAssets;
exports.installKibanaSavedObjects = installKibanaSavedObjects;
exports.toAssetReference = toAssetReference;

var _promises = require("timers/promises");

var _utils = require("@kbn/utils");

var _lodash = require("lodash");

var _common = require("../../../../../common");

var _archive = require("../../archive");

var _types = require("../../../../types");

var _packages = require("../../packages");

var _install = require("../index_pattern/install");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const formatImportErrorsForLog = errors => JSON.stringify(errors.map(({
  type,
  id,
  error
}) => ({
  type,
  id,
  error
})) // discard other fields
);

const validKibanaAssetTypes = new Set(Object.values(_types.KibanaAssetType)); // KibanaSavedObjectTypes are used to ensure saved objects being created for a given
// KibanaAssetType have the correct type

const KibanaSavedObjectTypeMapping = {
  [_types.KibanaAssetType.dashboard]: _types.KibanaSavedObjectType.dashboard,
  [_types.KibanaAssetType.indexPattern]: _types.KibanaSavedObjectType.indexPattern,
  [_types.KibanaAssetType.map]: _types.KibanaSavedObjectType.map,
  [_types.KibanaAssetType.search]: _types.KibanaSavedObjectType.search,
  [_types.KibanaAssetType.visualization]: _types.KibanaSavedObjectType.visualization,
  [_types.KibanaAssetType.lens]: _types.KibanaSavedObjectType.lens,
  [_types.KibanaAssetType.mlModule]: _types.KibanaSavedObjectType.mlModule,
  [_types.KibanaAssetType.securityRule]: _types.KibanaSavedObjectType.securityRule,
  [_types.KibanaAssetType.tag]: _types.KibanaSavedObjectType.tag
};
const AssetFilters = {
  [_types.KibanaAssetType.indexPattern]: removeReservedIndexPatterns
};

async function getKibanaAsset(key) {
  const buffer = (0, _archive.getAsset)(key); // cache values are buffers. convert to string / JSON

  return JSON.parse(buffer.toString('utf8'));
}

function createSavedObjectKibanaAsset(asset) {
  // convert that to an object
  return {
    type: asset.type,
    id: asset.id,
    attributes: asset.attributes,
    references: asset.references || [],
    migrationVersion: asset.migrationVersion || {}
  };
}

async function installKibanaAssets(options) {
  const {
    kibanaAssets,
    savedObjectsImporter,
    logger
  } = options;
  const assetsToInstall = Object.entries(kibanaAssets).flatMap(([assetType, assets]) => {
    if (!validKibanaAssetTypes.has(assetType)) {
      return [];
    }

    if (!assets.length) {
      return [];
    }

    const assetFilter = AssetFilters[assetType];

    if (assetFilter) {
      return assetFilter(assets);
    }

    return assets;
  });

  if (!assetsToInstall.length) {
    return [];
  } // As we use `import` to create our saved objects, we have to install
  // their references (the index patterns) at the same time
  // to prevent a reference error


  const indexPatternSavedObjects = (0, _install.getIndexPatternSavedObjects)();
  const installedAssets = await installKibanaSavedObjects({
    logger,
    savedObjectsImporter,
    kibanaAssets: [...indexPatternSavedObjects, ...assetsToInstall]
  });
  return installedAssets;
}

const deleteKibanaInstalledRefs = async (savedObjectsClient, pkgName, installedKibanaRefs) => {
  const installedAssetsToSave = installedKibanaRefs.filter(({
    id,
    type
  }) => {
    const assetType = type;
    return !_packages.savedObjectTypes.includes(assetType);
  });
  return savedObjectsClient.update(_common.PACKAGES_SAVED_OBJECT_TYPE, pkgName, {
    installed_kibana: installedAssetsToSave
  });
};

exports.deleteKibanaInstalledRefs = deleteKibanaInstalledRefs;

async function getKibanaAssets(paths) {
  const kibanaAssetTypes = Object.values(_types.KibanaAssetType);

  const isKibanaAssetType = path => {
    const parts = (0, _archive.getPathParts)(path);
    return parts.service === 'kibana' && kibanaAssetTypes.includes(parts.type);
  };

  const filteredPaths = paths.filter(isKibanaAssetType).map(path => [path, (0, _archive.getPathParts)(path)]);
  const assetArrays = [];

  for (const assetType of kibanaAssetTypes) {
    const matching = filteredPaths.filter(([path, parts]) => parts.type === assetType);
    assetArrays.push(Promise.all(matching.map(([path]) => path).map(getKibanaAsset)));
  }

  const resolvedAssets = await Promise.all(assetArrays);
  const result = {};

  for (const [index, assetType] of kibanaAssetTypes.entries()) {
    const expectedType = KibanaSavedObjectTypeMapping[assetType];
    const properlyTypedAssets = resolvedAssets[index].filter(({
      type
    }) => type === expectedType);
    result[assetType] = properlyTypedAssets;
  }

  return result;
}

const isImportConflictError = e => {
  var _e$error;

  return (e === null || e === void 0 ? void 0 : (_e$error = e.error) === null || _e$error === void 0 ? void 0 : _e$error.type) === 'conflict';
};
/**
 * retry saved object import if only conflict errors are encountered
 */


async function retryImportOnConflictError(importCall, {
  logger,
  maxAttempts = 50,
  _attempt = 0
} = {}) {
  var _result$errors;

  const result = await importCall();
  const errors = (_result$errors = result.errors) !== null && _result$errors !== void 0 ? _result$errors : [];

  if (_attempt < maxAttempts && errors.length && errors.every(isImportConflictError)) {
    const retryCount = _attempt + 1;
    const retryDelayMs = 1000 + Math.floor(Math.random() * 3000); // 1s + 0-3s of jitter

    logger === null || logger === void 0 ? void 0 : logger.debug(`Retrying import operation after [${retryDelayMs * 1000}s] due to conflict errors: ${JSON.stringify(errors)}`);
    await (0, _promises.setTimeout)(retryDelayMs);
    return retryImportOnConflictError(importCall, {
      logger,
      _attempt: retryCount
    });
  }

  return result;
} // only exported for testing


async function installKibanaSavedObjects({
  savedObjectsImporter,
  kibanaAssets,
  logger
}) {
  const toBeSavedObjects = await Promise.all(kibanaAssets.map(asset => createSavedObjectKibanaAsset(asset)));
  let allSuccessResults = [];

  if (toBeSavedObjects.length === 0) {
    return [];
  } else {
    const {
      successResults: importSuccessResults = [],
      errors: importErrors = [],
      success
    } = await retryImportOnConflictError(() => savedObjectsImporter.import({
      overwrite: true,
      readStream: (0, _utils.createListStream)(toBeSavedObjects),
      createNewCopies: false
    }));

    if (success) {
      allSuccessResults = importSuccessResults;
    }

    const [referenceErrors, otherErrors] = (0, _lodash.partition)(importErrors, e => {
      var _e$error2;

      return (e === null || e === void 0 ? void 0 : (_e$error2 = e.error) === null || _e$error2 === void 0 ? void 0 : _e$error2.type) === 'missing_references';
    });

    if (otherErrors !== null && otherErrors !== void 0 && otherErrors.length) {
      throw new Error(`Encountered ${otherErrors.length} errors creating saved objects: ${formatImportErrorsForLog(otherErrors)}`);
    }
    /*
    A reference error here means that a saved object reference in the references
    array cannot be found. This is an error in the package its-self but not a fatal
    one. For example a dashboard may still refer to the legacy `metricbeat-*` index 
    pattern. We ignore reference errors here so that legacy version of a package
    can still be installed, but if a warning is logged it should be reported to
    the integrations team. */


    if (referenceErrors.length) {
      logger.debug(`Resolving ${referenceErrors.length} reference errors creating saved objects: ${formatImportErrorsForLog(referenceErrors)}`);
      const retries = toBeSavedObjects.map(({
        id,
        type
      }) => {
        if (referenceErrors.find(({
          id: idToSearch
        }) => idToSearch === id)) {
          return {
            id,
            type,
            ignoreMissingReferences: true,
            replaceReferences: [],
            overwrite: true
          };
        }

        return {
          id,
          type,
          overwrite: true,
          replaceReferences: []
        };
      });
      const {
        successResults: resolveSuccessResults = [],
        errors: resolveErrors = []
      } = await savedObjectsImporter.resolveImportErrors({
        readStream: (0, _utils.createListStream)(toBeSavedObjects),
        createNewCopies: false,
        retries
      });

      if (resolveErrors !== null && resolveErrors !== void 0 && resolveErrors.length) {
        throw new Error(`Encountered ${resolveErrors.length} errors resolving reference errors: ${formatImportErrorsForLog(resolveErrors)}`);
      }

      allSuccessResults = allSuccessResults.concat(resolveSuccessResults);
    }

    return allSuccessResults;
  }
} // Filter out any reserved index patterns


function removeReservedIndexPatterns(kibanaAssets) {
  const reservedPatterns = _install.indexPatternTypes.map(pattern => `${pattern}-*`);

  return kibanaAssets.filter(asset => !reservedPatterns.includes(asset.id));
}

function toAssetReference({
  id,
  type
}) {
  const reference = {
    id,
    type: type
  };
  return reference;
}