"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stopTransforms = exports.deleteTransforms = exports.deleteTransformRefs = void 0;

var _types = require("../../../../types");

var _constants = require("../../../../../common/constants");

var _app_context = require("../../../app_context");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const stopTransforms = async (transformIds, esClient) => {
  for (const transformId of transformIds) {
    await esClient.transform.stopTransform({
      transform_id: transformId,
      force: true
    }, {
      ignore: [404]
    });
  }
};

exports.stopTransforms = stopTransforms;

const deleteTransforms = async (esClient, transformIds) => {
  const logger = _app_context.appContextService.getLogger();

  if (transformIds.length) {
    logger.info(`Deleting currently installed transform ids ${transformIds}`);
  }

  await Promise.all(transformIds.map(async transformId => {
    // get the index the transform
    const {
      body: transformResponse
    } = await esClient.transform.getTransform({
      transform_id: transformId
    }, {
      ignore: [404]
    });
    await stopTransforms([transformId], esClient);
    await esClient.transform.deleteTransform({
      force: true,
      transform_id: transformId
    }, {
      ignore: [404]
    });
    logger.info(`Deleted: ${transformId}`);

    if (transformResponse !== null && transformResponse !== void 0 && transformResponse.transforms) {
      // expect this to be 1
      for (const transform of transformResponse.transforms) {
        var _transform$dest;

        await esClient.transport.request({
          method: 'DELETE',
          // @ts-expect-error @elastic/elasticsearch Transform is empty interface
          path: `/${transform === null || transform === void 0 ? void 0 : (_transform$dest = transform.dest) === null || _transform$dest === void 0 ? void 0 : _transform$dest.index}`
        }, {
          ignore: [404]
        });
      }
    } else {
      logger.warn(`cannot find transform for ${transformId}`);
    }
  }));
};

exports.deleteTransforms = deleteTransforms;

const deleteTransformRefs = async (savedObjectsClient, installedEsAssets, pkgName, installedEsIdToRemove, currentInstalledEsTransformIds) => {
  const seen = new Set();
  const filteredAssets = installedEsAssets.filter(({
    type,
    id
  }) => {
    if (type !== _types.ElasticsearchAssetType.transform) return true;
    const add = (currentInstalledEsTransformIds.includes(id) || !installedEsIdToRemove.includes(id)) && !seen.has(id);
    seen.add(id);
    return add;
  });
  return savedObjectsClient.update(_constants.PACKAGES_SAVED_OBJECT_TYPE, pkgName, {
    installed_es: filteredAssets
  });
};

exports.deleteTransformRefs = deleteTransformRefs;