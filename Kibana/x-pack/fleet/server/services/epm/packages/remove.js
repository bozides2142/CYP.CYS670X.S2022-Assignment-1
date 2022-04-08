"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteKibanaSavedObjectsAssets = deleteKibanaSavedObjectsAssets;
exports.removeInstallation = removeInstallation;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _server = require("../../../../../../../src/core/server");

var _constants = require("../../../constants");

var _constants2 = require("../../../../../spaces/common/constants");

var _types = require("../../../types");

var _ingest_pipeline = require("../elasticsearch/ingest_pipeline/");

var _install = require("../kibana/index_pattern/install");

var _remove = require("../elasticsearch/transform/remove");

var _ml_model = require("../elasticsearch/ml_model");

var _ = require("../..");

var _archive = require("../archive");

var _remove2 = require("../elasticsearch/datastream_ilm/remove");

var _storage = require("../archive/storage");

var _index = require("./index");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function removeInstallation(options) {
  const {
    savedObjectsClient,
    pkgName,
    pkgVersion,
    esClient,
    force
  } = options;
  const installation = await (0, _index.getInstallation)({
    savedObjectsClient,
    pkgName
  });
  if (!installation) throw _boom.default.badRequest(`${pkgName} is not installed`);
  if (installation.removable === false && !force) throw _boom.default.badRequest(`${pkgName} is installed by default and cannot be removed`);
  const {
    total
  } = await _.packagePolicyService.list(savedObjectsClient, {
    kuery: `${_constants.PACKAGE_POLICY_SAVED_OBJECT_TYPE}.package.name:${pkgName}`,
    page: 0,
    perPage: 0
  });
  if (total > 0) throw _boom.default.badRequest(`unable to remove package with existing package policy(s) in use by agent(s)`); // Delete the installed assets. Don't include installation.package_assets. Those are irrelevant to users

  const installedAssets = [...installation.installed_kibana, ...installation.installed_es];
  await deleteAssets(installation, savedObjectsClient, esClient); // Delete the manager saved object with references to the asset objects
  // could also update with [] or some other state

  await savedObjectsClient.delete(_constants.PACKAGES_SAVED_OBJECT_TYPE, pkgName); // delete the index patterns if no packages are installed
  // this must be done after deleting the saved object for the current package otherwise it will retrieve the package
  // from the registry again and keep the index patterns

  await (0, _install.removeUnusedIndexPatterns)(savedObjectsClient); // remove the package archive and its contents from the cache so that a reinstall fetches
  // a fresh copy from the registry

  (0, _archive.deletePackageCache)({
    name: pkgName,
    version: pkgVersion
  });
  await (0, _storage.removeArchiveEntries)({
    savedObjectsClient,
    refs: installation.package_assets
  }); // successful delete's in SO client return {}. return something more useful

  return installedAssets;
}

async function deleteKibanaAssets(installedObjects, spaceId = _constants2.DEFAULT_SPACE_ID) {
  const savedObjectsClient = new _server.SavedObjectsClient(_.appContextService.getSavedObjects().createInternalRepository());

  const namespace = _server.SavedObjectsUtils.namespaceStringToId(spaceId);

  const {
    resolved_objects: resolvedObjects
  } = await savedObjectsClient.bulkResolve(installedObjects, {
    namespace
  });
  const foundObjects = resolvedObjects.filter(({
    saved_object: savedObject
  }) => {
    var _savedObject$error;

    return (savedObject === null || savedObject === void 0 ? void 0 : (_savedObject$error = savedObject.error) === null || _savedObject$error === void 0 ? void 0 : _savedObject$error.statusCode) !== 404;
  }); // in the case of a partial install, it is expected that some assets will be not found
  // we filter these out before calling delete

  const assetsToDelete = foundObjects.map(({
    saved_object: {
      id,
      type
    }
  }) => ({
    id,
    type
  }));
  const promises = assetsToDelete.map(async ({
    id,
    type
  }) => {
    return savedObjectsClient.delete(type, id, {
      namespace
    });
  });
  return Promise.all(promises);
}

function deleteESAssets(installedObjects, esClient) {
  return installedObjects.map(async ({
    id,
    type
  }) => {
    const assetType = type;

    if (assetType === _types.ElasticsearchAssetType.ingestPipeline) {
      return (0, _ingest_pipeline.deletePipeline)(esClient, id);
    } else if (assetType === _types.ElasticsearchAssetType.indexTemplate) {
      return deleteIndexTemplate(esClient, id);
    } else if (assetType === _types.ElasticsearchAssetType.componentTemplate) {
      return deleteComponentTemplate(esClient, id);
    } else if (assetType === _types.ElasticsearchAssetType.transform) {
      return (0, _remove.deleteTransforms)(esClient, [id]);
    } else if (assetType === _types.ElasticsearchAssetType.dataStreamIlmPolicy) {
      return (0, _remove2.deleteIlms)(esClient, [id]);
    } else if (assetType === _types.ElasticsearchAssetType.mlModel) {
      return (0, _ml_model.deleteMlModel)(esClient, [id]);
    }
  });
}

async function deleteAssets({
  installed_es: installedEs,
  installed_kibana: installedKibana,
  installed_kibana_space_id: spaceId = _constants2.DEFAULT_SPACE_ID
}, savedObjectsClient, esClient) {
  const logger = _.appContextService.getLogger(); // must delete index templates first, or component templates which reference them cannot be deleted
  // must delete ingestPipelines first, or ml models referenced in them cannot be deleted.
  // separate the assets into Index Templates and other assets.


  const [indexTemplatesAndPipelines, otherAssets] = installedEs.reduce(([indexAssetTypes, otherAssetTypes], asset) => {
    if (asset.type === _types.ElasticsearchAssetType.indexTemplate || asset.type === _types.ElasticsearchAssetType.ingestPipeline) {
      indexAssetTypes.push(asset);
    } else {
      otherAssetTypes.push(asset);
    }

    return [indexAssetTypes, otherAssetTypes];
  }, [[], []]);

  try {
    // must delete index templates and pipelines first
    await Promise.all(deleteESAssets(indexTemplatesAndPipelines, esClient)); // then the other asset types

    await Promise.all([...deleteESAssets(otherAssets, esClient), deleteKibanaAssets(installedKibana, spaceId)]);
  } catch (err) {
    // in the rollback case, partial installs are likely, so missing assets are not an error
    if (!savedObjectsClient.errors.isNotFoundError(err)) {
      logger.error(err);
    }
  }
}

async function deleteIndexTemplate(esClient, name) {
  // '*' shouldn't ever appear here, but it still would delete all templates
  if (name && name !== '*') {
    try {
      await esClient.indices.deleteIndexTemplate({
        name
      }, {
        ignore: [404]
      });
    } catch {
      throw new Error(`error deleting index template ${name}`);
    }
  }
}

async function deleteComponentTemplate(esClient, name) {
  // '*' shouldn't ever appear here, but it still would delete all templates
  if (name && name !== '*') {
    try {
      await esClient.cluster.deleteComponentTemplate({
        name
      }, {
        ignore: [404]
      });
    } catch (error) {
      throw new Error(`error deleting component template ${name}`);
    }
  }
}

async function deleteKibanaSavedObjectsAssets({
  savedObjectsClient,
  installedPkg
}) {
  const {
    installed_kibana: installedRefs,
    installed_kibana_space_id: spaceId
  } = installedPkg.attributes;
  if (!installedRefs.length) return;

  const logger = _.appContextService.getLogger();

  const assetsToDelete = installedRefs.filter(({
    type
  }) => _index.kibanaSavedObjectTypes.includes(type)).map(({
    id,
    type
  }) => ({
    id,
    type
  }));

  try {
    await deleteKibanaAssets(assetsToDelete, spaceId);
  } catch (err) {
    // in the rollback case, partial installs are likely, so missing assets are not an error
    if (!savedObjectsClient.errors.isNotFoundError(err)) {
      logger.error(err);
    }
  }
}