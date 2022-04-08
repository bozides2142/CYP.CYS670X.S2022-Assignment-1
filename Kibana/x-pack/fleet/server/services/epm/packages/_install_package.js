"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._installPackage = _installPackage;

var _common = require("../../../../common");

var _constants = require("../../../constants");

var _install = require("../elasticsearch/template/install");

var _ingest_pipeline = require("../elasticsearch/ingest_pipeline/");

var _install2 = require("../elasticsearch/ilm/install");

var _install3 = require("../kibana/assets/install");

var _template = require("../elasticsearch/template/template");

var _install4 = require("../elasticsearch/transform/install");

var _ml_model = require("../elasticsearch/ml_model/");

var _install5 = require("../elasticsearch/datastream_ilm/install");

var _storage = require("../archive/storage");

var _errors = require("../../../errors");

var _ = require("../..");

var _install6 = require("./install");

var _remove = require("./remove");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// this is only exported for testing
// use a leading underscore to indicate it's not the supported path
// only the more explicit `installPackage*` functions should be used


async function _installPackage({
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
}) {
  const {
    name: pkgName,
    version: pkgVersion
  } = packageInfo;

  try {
    // if some installation already exists
    if (installedPkg) {
      // if the installation is currently running, don't try to install
      // instead, only return already installed assets
      if (installedPkg.attributes.install_status === 'installing' && Date.now() - Date.parse(installedPkg.attributes.install_started_at) < _common.MAX_TIME_COMPLETE_INSTALL) {
        throw new _errors.ConcurrentInstallOperationError(`Concurrent installation or upgrade of ${pkgName || 'unknown'}-${pkgVersion || 'unknown'} detected, aborting.`);
      } else {
        // if no installation is running, or the installation has been running longer than MAX_TIME_COMPLETE_INSTALL
        // (it might be stuck) update the saved object and proceed
        await savedObjectsClient.update(_constants.PACKAGES_SAVED_OBJECT_TYPE, pkgName, {
          install_version: pkgVersion,
          install_status: 'installing',
          install_started_at: new Date().toISOString(),
          install_source: installSource
        });
      }
    } else {
      await (0, _install6.createInstallation)({
        savedObjectsClient,
        packageInfo,
        installSource,
        spaceId
      });
    }

    const kibanaAssets = await (0, _install3.getKibanaAssets)(paths);
    if (installedPkg) await (0, _remove.deleteKibanaSavedObjectsAssets)({
      savedObjectsClient,
      installedPkg
    }); // save new kibana refs before installing the assets

    const installedKibanaAssetsRefs = await (0, _install6.saveKibanaAssetsRefs)(savedObjectsClient, pkgName, kibanaAssets);
    await (0, _install3.installKibanaAssets)({
      logger,
      savedObjectsImporter,
      pkgName,
      kibanaAssets
    }); // the rest of the installation must happen in sequential order
    // currently only the base package has an ILM policy
    // at some point ILM policies can be installed/modified
    // per data stream and we should then save them

    await (0, _install2.installILMPolicy)(packageInfo, paths, esClient, logger);
    const installedDataStreamIlm = await (0, _install5.installIlmForDataStream)(packageInfo, paths, esClient, savedObjectsClient, logger); // installs ml models

    const installedMlModel = await (0, _ml_model.installMlModel)(packageInfo, paths, esClient, savedObjectsClient, logger); // installs versionized pipelines without removing currently installed ones

    const installedPipelines = await (0, _ingest_pipeline.installPipelines)(packageInfo, paths, esClient, savedObjectsClient, logger); // install or update the templates referencing the newly installed pipelines

    const installedTemplates = await (0, _install.installTemplates)(packageInfo, esClient, logger, paths, savedObjectsClient); // update current backing indices of each data stream

    await (0, _template.updateCurrentWriteIndices)(esClient, logger, installedTemplates);
    const installedTransforms = await (0, _install4.installTransform)(packageInfo, paths, esClient, savedObjectsClient, logger); // If this is an update or retrying an update, delete the previous version's pipelines
    // Top-level pipeline assets will not be removed on upgrade as of ml model package addition which requires previous
    // assets to remain installed. This is a temporary solution - more robust solution tracked here https://github.com/elastic/kibana/issues/115035

    if (paths.filter(path => (0, _ingest_pipeline.isTopLevelPipeline)(path)).length === 0 && (installType === 'update' || installType === 'reupdate') && installedPkg) {
      await (0, _ingest_pipeline.deletePreviousPipelines)(esClient, savedObjectsClient, pkgName, installedPkg.attributes.version);
    } // pipelines from a different version may have installed during a failed update


    if (installType === 'rollback' && installedPkg) {
      await (0, _ingest_pipeline.deletePreviousPipelines)(esClient, savedObjectsClient, pkgName, installedPkg.attributes.install_version);
    }

    const installedTemplateRefs = (0, _install.getAllTemplateRefs)(installedTemplates);
    const packageAssetResults = await (0, _storage.saveArchiveEntries)({
      savedObjectsClient,
      paths,
      packageInfo,
      installSource
    });
    const packageAssetRefs = packageAssetResults.saved_objects.map(result => ({
      id: result.id,
      type: _common.ASSETS_SAVED_OBJECT_TYPE
    })); // update to newly installed version when all assets are successfully installed

    if (installedPkg) await (0, _install6.updateVersion)(savedObjectsClient, pkgName, pkgVersion);
    const updatedPackage = await savedObjectsClient.update(_constants.PACKAGES_SAVED_OBJECT_TYPE, pkgName, {
      install_version: pkgVersion,
      install_status: 'installed',
      package_assets: packageAssetRefs
    }); // If the package is flagged with the `keep_policies_up_to_date` flag, upgrade its
    // associated package policies after installation

    if (updatedPackage.attributes.keep_policies_up_to_date) {
      const policyIdsToUpgrade = await _.packagePolicyService.listIds(savedObjectsClient, {
        page: 1,
        perPage: _common.SO_SEARCH_LIMIT,
        kuery: `${_common.PACKAGE_POLICY_SAVED_OBJECT_TYPE}.package.name:${pkgName}`
      });
      await _.packagePolicyService.upgrade(savedObjectsClient, esClient, policyIdsToUpgrade.items);
    }

    return [...installedKibanaAssetsRefs, ...installedPipelines, ...installedDataStreamIlm, ...installedTemplateRefs, ...installedTransforms, ...installedMlModel];
  } catch (err) {
    if (savedObjectsClient.errors.isConflictError(err)) {
      throw new _errors.ConcurrentInstallOperationError(`Concurrent installation or upgrade of ${pkgName || 'unknown'}-${pkgVersion || 'unknown'} detected, aborting. Original error: ${err.message}`);
    } else {
      throw err;
    }
  }
}