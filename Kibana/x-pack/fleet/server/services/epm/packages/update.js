"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updatePackage = updatePackage;

var _constants = require("../../../constants");

var _errors = require("../../../errors");

var _get = require("./get");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function updatePackage(options) {
  const {
    savedObjectsClient,
    pkgName,
    keepPoliciesUpToDate
  } = options;
  const installedPackage = await (0, _get.getInstallationObject)({
    savedObjectsClient,
    pkgName
  });

  if (!installedPackage) {
    throw new _errors.IngestManagerError(`package ${pkgName} is not installed`);
  }

  await savedObjectsClient.update(_constants.PACKAGES_SAVED_OBJECT_TYPE, installedPackage.id, {
    keep_policies_up_to_date: keepPoliciesUpToDate !== null && keepPoliciesUpToDate !== void 0 ? keepPoliciesUpToDate : false
  });
  const packageInfo = await (0, _get.getPackageInfo)({
    savedObjectsClient,
    pkgName,
    pkgVersion: installedPackage.attributes.version
  });
  return packageInfo;
}