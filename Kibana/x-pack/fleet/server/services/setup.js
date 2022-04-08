"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ensureDefaultEnrollmentAPIKeysExists = ensureDefaultEnrollmentAPIKeysExists;
exports.ensureFleetGlobalEsAssets = ensureFleetGlobalEsAssets;
exports.formatNonFatalErrors = formatNonFatalErrors;
exports.setupFleet = setupFleet;

var _lodash = require("lodash");

var _common = require("../../common");

var _constants = require("../constants");

var _constants2 = require("../../../spaces/common/constants");

var _app_context = require("./app_context");

var _agent_policy = require("./agent_policy");

var _preconfiguration = require("./preconfiguration");

var _output = require("./output");

var _api_keys = require("./api_keys");

var _ = require(".");

var _setup_utils = require("./setup_utils");

var _install = require("./epm/elasticsearch/ingest_pipeline/install");

var _install2 = require("./epm/elasticsearch/template/install");

var _packages = require("./epm/packages");

var _install3 = require("./epm/packages/install");

var _registry = require("./epm/registry");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function setupFleet(soClient, esClient) {
  return (0, _setup_utils.awaitIfPending)(async () => createSetupSideEffects(soClient, esClient));
}

async function createSetupSideEffects(soClient, esClient) {
  var _appContextService$ge, _appContextService$ge2;

  const logger = _app_context.appContextService.getLogger();

  logger.info('Beginning fleet setup');
  const {
    agentPolicies: policiesOrUndefined,
    packages: packagesOrUndefined,
    outputs: outputsOrUndefined
  } = (_appContextService$ge = _app_context.appContextService.getConfig()) !== null && _appContextService$ge !== void 0 ? _appContextService$ge : {};
  const policies = policiesOrUndefined !== null && policiesOrUndefined !== void 0 ? policiesOrUndefined : [];
  let packages = packagesOrUndefined !== null && packagesOrUndefined !== void 0 ? packagesOrUndefined : [];
  logger.debug('Setting up Fleet outputs');
  await Promise.all([(0, _preconfiguration.ensurePreconfiguredOutputs)(soClient, esClient, outputsOrUndefined !== null && outputsOrUndefined !== void 0 ? outputsOrUndefined : []), _.settingsService.settingsSetup(soClient)]);
  const defaultOutput = await _output.outputService.ensureDefaultOutput(soClient);

  if ((_appContextService$ge2 = _app_context.appContextService.getConfig()) !== null && _appContextService$ge2 !== void 0 && _appContextService$ge2.agentIdVerificationEnabled) {
    logger.debug('Setting up Fleet Elasticsearch assets');
    await ensureFleetGlobalEsAssets(soClient, esClient);
  } // Ensure that required packages are always installed even if they're left out of the config


  const preconfiguredPackageNames = new Set(packages.map(pkg => pkg.name));
  const autoUpdateablePackages = (0, _lodash.compact)(await Promise.all(_common.AUTO_UPDATE_PACKAGES.map(pkg => (0, _install3.isPackageInstalled)({
    savedObjectsClient: soClient,
    pkgName: pkg.name
  }).then(installed => installed ? pkg : undefined))));
  packages = [...packages, ...autoUpdateablePackages.filter(pkg => !preconfiguredPackageNames.has(pkg.name))];
  logger.debug('Setting up initial Fleet packages');
  const {
    nonFatalErrors
  } = await (0, _preconfiguration.ensurePreconfiguredPackagesAndPolicies)(soClient, esClient, policies, packages, defaultOutput, _constants2.DEFAULT_SPACE_ID);
  logger.debug('Cleaning up Fleet outputs');
  await (0, _preconfiguration.cleanPreconfiguredOutputs)(soClient, outputsOrUndefined !== null && outputsOrUndefined !== void 0 ? outputsOrUndefined : []);
  logger.debug('Setting up Fleet enrollment keys');
  await ensureDefaultEnrollmentAPIKeysExists(soClient, esClient);

  if (nonFatalErrors.length > 0) {
    logger.info('Encountered non fatal errors during Fleet setup');
    formatNonFatalErrors(nonFatalErrors).forEach(error => logger.info(JSON.stringify(error)));
  }

  logger.info('Fleet setup completed');
  return {
    isInitialized: true,
    nonFatalErrors
  };
}
/**
 * Ensure ES assets shared by all Fleet index template are installed
 */


async function ensureFleetGlobalEsAssets(soClient, esClient) {
  const logger = _app_context.appContextService.getLogger(); // Ensure Global Fleet ES assets are installed


  logger.debug('Creating Fleet component template and ingest pipeline');
  const globalAssetsRes = await Promise.all([(0, _install2.ensureDefaultComponentTemplate)(esClient, logger), (0, _install.ensureFleetFinalPipelineIsInstalled)(esClient, logger)]);

  if (globalAssetsRes.some(asset => asset.isCreated)) {
    // Update existing index template
    const packages = await (0, _packages.getInstallations)(soClient);
    await Promise.all(packages.saved_objects.map(async ({
      attributes: installation
    }) => {
      if (installation.install_source !== 'registry') {
        logger.error(`Package needs to be manually reinstalled ${installation.name} after installing Fleet global assets`);
        return;
      }

      await (0, _packages.installPackage)({
        installSource: installation.install_source,
        savedObjectsClient: soClient,
        pkgkey: (0, _registry.pkgToPkgKey)({
          name: installation.name,
          version: installation.version
        }),
        esClient,
        spaceId: _constants2.DEFAULT_SPACE_ID,
        // Force install the package will update the index template and the datastream write indices
        force: true
      }).catch(err => {
        logger.error(`Package needs to be manually reinstalled ${installation.name} after installing Fleet global assets: ${err.message}`);
      });
    }));
  }
}

async function ensureDefaultEnrollmentAPIKeysExists(soClient, esClient, options) {
  const security = _app_context.appContextService.getSecurity();

  if (!security) {
    return;
  }

  if (!(await security.authc.apiKeys.areAPIKeysEnabled())) {
    return;
  }

  const {
    items: agentPolicies
  } = await _agent_policy.agentPolicyService.list(soClient, {
    perPage: _constants.SO_SEARCH_LIMIT
  });
  await Promise.all(agentPolicies.map(async agentPolicy => {
    const hasKey = await (0, _api_keys.hasEnrollementAPIKeysForPolicy)(esClient, agentPolicy.id);

    if (hasKey) {
      return;
    }

    return (0, _api_keys.generateEnrollmentAPIKey)(soClient, esClient, {
      name: `Default`,
      agentPolicyId: agentPolicy.id,
      forceRecreate: true // Always generate a new enrollment key when Fleet is being set up

    });
  }));
}
/**
 * Maps the `nonFatalErrors` object returned by the setup process to a more readable
 * and predictable format suitable for logging output or UI presentation.
 */


function formatNonFatalErrors(nonFatalErrors) {
  return nonFatalErrors.flatMap(e => {
    if ('error' in e) {
      return {
        name: e.error.name,
        message: e.error.message
      };
    } else if ('errors' in e) {
      return e.errors.map(upgradePackagePolicyError => {
        if (typeof upgradePackagePolicyError === 'string') {
          return {
            name: 'SetupNonFatalError',
            message: upgradePackagePolicyError
          };
        }

        return {
          name: upgradePackagePolicyError.key,
          message: upgradePackagePolicyError.message
        };
      });
    }
  });
}