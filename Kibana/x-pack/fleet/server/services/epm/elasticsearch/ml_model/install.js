"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.installMlModel = void 0;

var _elasticsearch = require("@elastic/elasticsearch");

var _install = require("../../packages/install");

var _archive = require("../../archive");

var _models = require("../../../../../common/types/models");

var _retry = require("../retry");

var _common = require("./common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const installMlModel = async (installablePackage, paths, esClient, savedObjectsClient, logger) => {
  const mlModelPath = paths.find(path => isMlModel(path));
  const installedMlModels = [];

  if (mlModelPath !== undefined) {
    const content = (0, _common.getAsset)(mlModelPath).toString('utf-8');
    const pathParts = mlModelPath.split('/');
    const modelId = pathParts[pathParts.length - 1].replace('.json', '');
    const mlModelRef = {
      id: modelId,
      type: _models.ElasticsearchAssetType.mlModel
    }; // get and save ml model refs before installing ml model

    await (0, _install.saveInstalledEsRefs)(savedObjectsClient, installablePackage.name, [mlModelRef]);
    const mlModel = {
      installationName: modelId,
      content
    };
    const result = await handleMlModelInstall({
      esClient,
      logger,
      mlModel
    });
    installedMlModels.push(result);
  }

  return installedMlModels;
};

exports.installMlModel = installMlModel;

const isMlModel = path => {
  const pathParts = (0, _archive.getPathParts)(path);
  return !path.endsWith('/') && pathParts.type === _models.ElasticsearchAssetType.mlModel;
};

async function handleMlModelInstall({
  esClient,
  logger,
  mlModel
}) {
  try {
    await (0, _retry.retryTransientEsErrors)(() => esClient.ml.putTrainedModel({
      model_id: mlModel.installationName,
      defer_definition_decompression: true,
      timeout: '45s',
      // @ts-expect-error expects an object not a string
      body: mlModel.content
    }, {
      headers: {
        'content-type': 'application/json'
      }
    }), {
      logger
    });
  } catch (err) {
    var _err$body, _err$body$error; // swallow the error if the ml model already exists.


    const isAlreadyExistError = err instanceof _elasticsearch.errors.ResponseError && (err === null || err === void 0 ? void 0 : (_err$body = err.body) === null || _err$body === void 0 ? void 0 : (_err$body$error = _err$body.error) === null || _err$body$error === void 0 ? void 0 : _err$body$error.type) === 'resource_already_exists_exception';

    if (!isAlreadyExistError) {
      throw err;
    }
  }

  return {
    id: mlModel.installationName,
    type: _models.ElasticsearchAssetType.mlModel
  };
}