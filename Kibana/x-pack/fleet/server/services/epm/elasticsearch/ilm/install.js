"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.installILMPolicy = installILMPolicy;

var _types = require("../../../../types");

var _archive = require("../../archive");

var _meta = require("../meta");

var _retry = require("../retry");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function installILMPolicy(packageInfo, paths, esClient, logger) {
  const ilmPaths = paths.filter(path => isILMPolicy(path));
  if (!ilmPaths.length) return;
  await Promise.all(ilmPaths.map(async path => {
    const body = JSON.parse((0, _archive.getAsset)(path).toString('utf-8'));
    body.policy._meta = (0, _meta.getESAssetMetadata)({
      packageName: packageInfo.name
    });
    const {
      file
    } = (0, _archive.getPathParts)(path);
    const name = file.substr(0, file.lastIndexOf('.'));

    try {
      await (0, _retry.retryTransientEsErrors)(() => esClient.transport.request({
        method: 'PUT',
        path: '/_ilm/policy/' + name,
        body
      }), {
        logger
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }));
}

const isILMPolicy = path => {
  const pathParts = (0, _archive.getPathParts)(path);
  return pathParts.type === _types.ElasticsearchAssetType.ilmPolicy;
};