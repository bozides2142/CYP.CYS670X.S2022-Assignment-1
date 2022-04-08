"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isTransform = exports.installTransform = void 0;

var _elasticsearch = require("@elastic/elasticsearch");

var _install = require("../../packages/install");

var _archive = require("../../archive");

var _models = require("../../../../../common/types/models");

var _packages = require("../../packages");

var _meta = require("../meta");

var _retry = require("../retry");

var _remove = require("./remove");

var _common = require("./common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const installTransform = async (installablePackage, paths, esClient, savedObjectsClient, logger) => {
  const installation = await (0, _packages.getInstallation)({
    savedObjectsClient,
    pkgName: installablePackage.name
  });
  let previousInstalledTransformEsAssets = [];

  if (installation) {
    previousInstalledTransformEsAssets = installation.installed_es.filter(({
      type,
      id
    }) => type === _models.ElasticsearchAssetType.transform);

    if (previousInstalledTransformEsAssets.length) {
      logger.info(`Found previous transform references:\n ${JSON.stringify(previousInstalledTransformEsAssets)}`);
    }
  } // delete all previous transform


  await (0, _remove.deleteTransforms)(esClient, previousInstalledTransformEsAssets.map(asset => asset.id));
  const installNameSuffix = `${installablePackage.version}`;
  const transformPaths = paths.filter(path => isTransform(path));
  let installedTransforms = [];

  if (transformPaths.length > 0) {
    const transformRefs = transformPaths.reduce((acc, path) => {
      acc.push({
        id: getTransformNameForInstallation(installablePackage, path, installNameSuffix),
        type: _models.ElasticsearchAssetType.transform
      });
      return acc;
    }, []); // get and save transform refs before installing transforms

    await (0, _install.saveInstalledEsRefs)(savedObjectsClient, installablePackage.name, transformRefs);
    const transforms = transformPaths.map(path => {
      const content = JSON.parse((0, _common.getAsset)(path).toString('utf-8'));
      content._meta = (0, _meta.getESAssetMetadata)({
        packageName: installablePackage.name
      });
      return {
        installationName: getTransformNameForInstallation(installablePackage, path, installNameSuffix),
        content
      };
    });
    const installationPromises = transforms.map(async transform => {
      return handleTransformInstall({
        esClient,
        logger,
        transform
      });
    });
    installedTransforms = await Promise.all(installationPromises).then(results => results.flat());
  }

  if (previousInstalledTransformEsAssets.length > 0) {
    const currentInstallation = await (0, _packages.getInstallation)({
      savedObjectsClient,
      pkgName: installablePackage.name
    }); // remove the saved object reference

    await (0, _remove.deleteTransformRefs)(savedObjectsClient, (currentInstallation === null || currentInstallation === void 0 ? void 0 : currentInstallation.installed_es) || [], installablePackage.name, previousInstalledTransformEsAssets.map(asset => asset.id), installedTransforms.map(installed => installed.id));
  }

  return installedTransforms;
};

exports.installTransform = installTransform;

const isTransform = path => {
  const pathParts = (0, _archive.getPathParts)(path);
  return !path.endsWith('/') && pathParts.type === _models.ElasticsearchAssetType.transform;
};

exports.isTransform = isTransform;

async function handleTransformInstall({
  esClient,
  logger,
  transform
}) {
  try {
    await (0, _retry.retryTransientEsErrors)(() => // defer validation on put if the source index is not available
    esClient.transform.putTransform({
      transform_id: transform.installationName,
      defer_validation: true,
      body: transform.content
    }), {
      logger
    });
  } catch (err) {
    var _err$body, _err$body$error; // swallow the error if the transform already exists.


    const isAlreadyExistError = err instanceof _elasticsearch.errors.ResponseError && (err === null || err === void 0 ? void 0 : (_err$body = err.body) === null || _err$body === void 0 ? void 0 : (_err$body$error = _err$body.error) === null || _err$body$error === void 0 ? void 0 : _err$body$error.type) === 'resource_already_exists_exception';

    if (!isAlreadyExistError) {
      throw err;
    }
  }

  await esClient.transform.startTransform({
    transform_id: transform.installationName
  }, {
    ignore: [409]
  });
  return {
    id: transform.installationName,
    type: _models.ElasticsearchAssetType.transform
  };
}

const getTransformNameForInstallation = (installablePackage, path, suffix) => {
  var _pathPaths$pop;

  const pathPaths = path.split('/');
  const filename = pathPaths === null || pathPaths === void 0 ? void 0 : (_pathPaths$pop = pathPaths.pop()) === null || _pathPaths$pop === void 0 ? void 0 : _pathPaths$pop.split('.')[0];
  const folderName = pathPaths === null || pathPaths === void 0 ? void 0 : pathPaths.pop();
  return `${installablePackage.name}.${folderName}-${filename}-${suffix}`;
};