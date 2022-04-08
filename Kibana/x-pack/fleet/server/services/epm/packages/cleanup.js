"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeOldAssets = removeOldAssets;

var _storage = require("../archive/storage");

var _common = require("../../../../common");

var _package_policy = require("../../package_policy");

var _ = require("../..");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function removeOldAssets(options) {
  const {
    soClient,
    pkgName,
    currentVersion
  } = options; // find all assets of older versions

  const aggs = {
    versions: {
      terms: {
        field: `${_common.ASSETS_SAVED_OBJECT_TYPE}.attributes.package_version`
      }
    }
  };
  const oldVersionsAgg = await soClient.find({
    type: _common.ASSETS_SAVED_OBJECT_TYPE,
    filter: `${_common.ASSETS_SAVED_OBJECT_TYPE}.attributes.package_name:${pkgName} AND ${_common.ASSETS_SAVED_OBJECT_TYPE}.attributes.package_version<${currentVersion}`,
    aggs,
    page: 0,
    perPage: 0
  });
  const oldVersions = oldVersionsAgg.aggregations.versions.buckets.map(obj => obj.key);

  for (const oldVersion of oldVersions) {
    await removeAssetsFromVersion(soClient, pkgName, oldVersion);
  }
}

async function removeAssetsFromVersion(soClient, pkgName, oldVersion) {
  // check if any policies are using this package version
  const {
    total
  } = await _package_policy.packagePolicyService.list(soClient, {
    kuery: `${_common.PACKAGE_POLICY_SAVED_OBJECT_TYPE}.package.name:${pkgName} AND ${_common.PACKAGE_POLICY_SAVED_OBJECT_TYPE}.package.version:${oldVersion}`,
    page: 0,
    perPage: 0
  }); // don't delete if still being used

  if (total > 0) {
    _.appContextService.getLogger().debug(`Package "${pkgName}-${oldVersion}" still being used by policies`);

    return;
  } // check if old version has assets


  const finder = await soClient.createPointInTimeFinder({
    type: _common.ASSETS_SAVED_OBJECT_TYPE,
    filter: `${_common.ASSETS_SAVED_OBJECT_TYPE}.attributes.package_name:${pkgName} AND ${_common.ASSETS_SAVED_OBJECT_TYPE}.attributes.package_version:${oldVersion}`,
    perPage: 1000,
    fields: ['id']
  });

  for await (const assets of finder.find()) {
    const refs = assets.saved_objects.map(obj => ({
      id: obj.id,
      type: _common.ASSETS_SAVED_OBJECT_TYPE
    }));
    await (0, _storage.removeArchiveEntries)({
      savedObjectsClient: soClient,
      refs
    });
  }

  await finder.close();
}