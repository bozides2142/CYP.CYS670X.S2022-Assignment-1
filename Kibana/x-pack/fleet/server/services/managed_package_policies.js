"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shouldUpgradePolicies = shouldUpgradePolicies;
exports.upgradeManagedPackagePolicies = void 0;

var _gte = _interopRequireDefault(require("semver/functions/gte"));

var _app_context = require("./app_context");

var _packages = require("./epm/packages");

var _package_policy = require("./package_policy");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Upgrade any package policies for packages installed through setup that are denoted as `AUTO_UPGRADE` packages
 * or have the `keep_policies_up_to_date` flag set to `true`
 */


const upgradeManagedPackagePolicies = async (soClient, esClient, packagePolicyIds) => {
  const results = [];

  for (const packagePolicyId of packagePolicyIds) {
    const packagePolicy = await _package_policy.packagePolicyService.get(soClient, packagePolicyId);

    if (!packagePolicy || !packagePolicy.package) {
      continue;
    }

    const installedPackage = await (0, _packages.getInstallation)({
      savedObjectsClient: soClient,
      pkgName: packagePolicy.package.name
    });

    if (!installedPackage) {
      results.push({
        packagePolicyId,
        errors: [`${packagePolicy.package.name} is not installed`]
      });
      continue;
    }

    if (shouldUpgradePolicies(packagePolicy.package.version, installedPackage)) {
      // Since upgrades don't report diffs/errors, we need to perform a dry run first in order
      // to notify the user of any granular policy upgrade errors that occur during Fleet's
      // preconfiguration check
      const dryRunResults = await _package_policy.packagePolicyService.getUpgradeDryRunDiff(soClient, packagePolicyId);

      if (dryRunResults.hasErrors) {
        var _dryRunResults$diff, _dryRunResults$body;

        const errors = dryRunResults.diff ? (_dryRunResults$diff = dryRunResults.diff) === null || _dryRunResults$diff === void 0 ? void 0 : _dryRunResults$diff[1].errors : [(_dryRunResults$body = dryRunResults.body) === null || _dryRunResults$body === void 0 ? void 0 : _dryRunResults$body.message];

        _app_context.appContextService.getLogger().error(new Error(`Error upgrading package policy ${packagePolicyId}: ${JSON.stringify(errors)}`));

        results.push({
          packagePolicyId,
          diff: dryRunResults.diff,
          errors
        });
        continue;
      }

      try {
        await _package_policy.packagePolicyService.upgrade(soClient, esClient, [packagePolicyId]);
        results.push({
          packagePolicyId,
          diff: dryRunResults.diff,
          errors: []
        });
      } catch (error) {
        results.push({
          packagePolicyId,
          diff: dryRunResults.diff,
          errors: [error]
        });
      }
    }
  }

  return results;
};

exports.upgradeManagedPackagePolicies = upgradeManagedPackagePolicies;

function shouldUpgradePolicies(packagePolicyPackageVersion, installedPackage) {
  const isPolicyVersionGteInstalledVersion = (0, _gte.default)(packagePolicyPackageVersion, installedPackage.version);
  return !isPolicyVersionGteInstalledVersion && !!installedPackage.keep_policies_up_to_date;
}