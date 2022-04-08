"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBundledPackageByName = getBundledPackageByName;
exports.getBundledPackages = getBundledPackages;

var _promises = _interopRequireDefault(require("fs/promises"));

var _path = _interopRequireDefault(require("path"));

var _app_context = require("../../app_context");

var _registry = require("../registry");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const BUNDLED_PACKAGE_DIRECTORY = _path.default.join(__dirname, '../../../bundled_packages');

async function getBundledPackages() {
  try {
    const dirContents = await _promises.default.readdir(BUNDLED_PACKAGE_DIRECTORY);
    const zipFiles = dirContents.filter(file => file.endsWith('.zip'));
    const result = await Promise.all(zipFiles.map(async zipFile => {
      const file = await _promises.default.readFile(_path.default.join(BUNDLED_PACKAGE_DIRECTORY, zipFile));
      const {
        pkgName,
        pkgVersion
      } = (0, _registry.splitPkgKey)(zipFile.replace(/\.zip$/, ''));
      return {
        name: pkgName,
        version: pkgVersion,
        buffer: file
      };
    }));
    return result;
  } catch (err) {
    const logger = _app_context.appContextService.getLogger();

    logger.debug(`Unable to read bundled packages from ${BUNDLED_PACKAGE_DIRECTORY}`);
    return [];
  }
}

async function getBundledPackageByName(name) {
  const bundledPackages = await getBundledPackages();
  const bundledPackage = bundledPackages.find(pkg => pkg.name === name);
  return bundledPackage;
}