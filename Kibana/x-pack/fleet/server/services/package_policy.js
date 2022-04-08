"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DATA_STREAM_ALLOWED_INDEX_PRIVILEGES = void 0;
exports._applyIndexPrivileges = _applyIndexPrivileges;
exports.packagePolicyService = void 0;
exports.preconfigurePackageInputs = preconfigurePackageInputs;
exports.updatePackageInputs = updatePackageInputs;

var _lodash = require("lodash");

var _i18n = require("@kbn/i18n");

var _lt = _interopRequireDefault(require("semver/functions/lt"));

var _std = require("@kbn/std");

var _uuid = _interopRequireDefault(require("uuid"));

var _jsYaml = require("js-yaml");

var _constants = require("../../../spaces/common/constants");

var _common = require("../../common");

var _constants2 = require("../constants");

var _errors = require("../errors");

var _types = require("../types");

var _agent_policies = require("./agent_policies");

var _agent_policy = require("./agent_policy");

var _output = require("./output");

var Registry = _interopRequireWildcard(require("./epm/registry"));

var _packages = require("./epm/packages");

var _assets = require("./epm/packages/assets");

var _agent = require("./epm/agent/agent");

var _saved_object = require("./saved_object");

var _ = require(".");

var _cleanup = require("./epm/packages/cleanup");

var _upgrade_sender = require("./upgrade_sender");

var _archive = require("./epm/archive");

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const SAVED_OBJECT_TYPE = _constants2.PACKAGE_POLICY_SAVED_OBJECT_TYPE;
const DATA_STREAM_ALLOWED_INDEX_PRIVILEGES = new Set(['auto_configure', 'create_doc', 'maintenance', 'monitor', 'read', 'read_cross_cluster']);
exports.DATA_STREAM_ALLOWED_INDEX_PRIVILEGES = DATA_STREAM_ALLOWED_INDEX_PRIVILEGES;

class PackagePolicyService {
  async create(soClient, esClient, packagePolicy, options) {
    var _packagePolicy$packag, _options$user$usernam, _options$user, _options$user$usernam2, _options$user2, _options$bumpRevision; // trailing whitespace causes issues creating API keys


    packagePolicy.name = packagePolicy.name.trim();

    if (!(options !== null && options !== void 0 && options.skipUniqueNameVerification)) {
      const existingPoliciesWithName = await this.list(soClient, {
        perPage: 1,
        kuery: `${_constants2.PACKAGE_POLICY_SAVED_OBJECT_TYPE}.name: "${packagePolicy.name}"`
      }); // Check that the name does not exist already

      if (existingPoliciesWithName.items.length > 0) {
        throw new _errors.IngestManagerError(`An integration policy with the name ${packagePolicy.name} already exists. Please rename it or choose a different name.`);
      }
    }

    let elasticsearch; // Add ids to stream

    const packagePolicyId = (options === null || options === void 0 ? void 0 : options.id) || _uuid.default.v4();

    let inputs = packagePolicy.inputs.map(input => assignStreamIdToInput(packagePolicyId, input)); // Make sure the associated package is installed

    if ((_packagePolicy$packag = packagePolicy.package) !== null && _packagePolicy$packag !== void 0 && _packagePolicy$packag.name) {
      var _getArchivePackage;

      const pkgInfoPromise = (0, _packages.getPackageInfo)({
        savedObjectsClient: soClient,
        pkgName: packagePolicy.package.name,
        pkgVersion: packagePolicy.package.version
      });
      let pkgInfo;
      if (options !== null && options !== void 0 && options.skipEnsureInstalled) pkgInfo = await pkgInfoPromise;else {
        const [, packageInfo] = await Promise.all([(0, _packages.ensureInstalledPackage)({
          esClient,
          spaceId: (options === null || options === void 0 ? void 0 : options.spaceId) || _constants.DEFAULT_SPACE_ID,
          savedObjectsClient: soClient,
          pkgName: packagePolicy.package.name,
          pkgVersion: packagePolicy.package.version
        }), pkgInfoPromise]);
        pkgInfo = packageInfo;
      } // Check if it is a limited package, and if so, check that the corresponding agent policy does not
      // already contain a package policy for this package

      if ((0, _common.isPackageLimited)(pkgInfo)) {
        const agentPolicy = await _agent_policy.agentPolicyService.get(soClient, packagePolicy.policy_id, true);

        if (agentPolicy && (0, _common.doesAgentPolicyAlreadyIncludePackage)(agentPolicy, pkgInfo.name)) {
          throw new _errors.IngestManagerError(`Unable to create package policy. Package '${pkgInfo.name}' already exists on this agent policy.`);
        }
      }

      validatePackagePolicyOrThrow(packagePolicy, pkgInfo);
      let installablePackage = (_getArchivePackage = (0, _archive.getArchivePackage)(pkgInfo)) === null || _getArchivePackage === void 0 ? void 0 : _getArchivePackage.packageInfo;

      if (!installablePackage) {
        installablePackage = await Registry.fetchInfo(pkgInfo.name, pkgInfo.version);
      }

      inputs = await this._compilePackagePolicyInputs(installablePackage, pkgInfo, packagePolicy.vars || {}, inputs);
      elasticsearch = installablePackage.elasticsearch;
    }

    const isoDate = new Date().toISOString();
    const newSo = await soClient.create(SAVED_OBJECT_TYPE, { ...packagePolicy,
      inputs,
      elasticsearch,
      revision: 1,
      created_at: isoDate,
      created_by: (_options$user$usernam = options === null || options === void 0 ? void 0 : (_options$user = options.user) === null || _options$user === void 0 ? void 0 : _options$user.username) !== null && _options$user$usernam !== void 0 ? _options$user$usernam : 'system',
      updated_at: isoDate,
      updated_by: (_options$user$usernam2 = options === null || options === void 0 ? void 0 : (_options$user2 = options.user) === null || _options$user2 === void 0 ? void 0 : _options$user2.username) !== null && _options$user$usernam2 !== void 0 ? _options$user$usernam2 : 'system'
    }, { ...options,
      id: packagePolicyId
    }); // Assign it to the given agent policy

    await _agent_policy.agentPolicyService.assignPackagePolicies(soClient, esClient, packagePolicy.policy_id, [newSo.id], {
      user: options === null || options === void 0 ? void 0 : options.user,
      bumpRevision: (_options$bumpRevision = options === null || options === void 0 ? void 0 : options.bumpRevision) !== null && _options$bumpRevision !== void 0 ? _options$bumpRevision : true,
      force: options === null || options === void 0 ? void 0 : options.force
    });
    return {
      id: newSo.id,
      version: newSo.version,
      ...newSo.attributes
    };
  }

  async bulkCreate(soClient, esClient, packagePolicies, agentPolicyId, options) {
    var _options$bumpRevision2;

    const isoDate = new Date().toISOString(); // eslint-disable-next-line @typescript-eslint/naming-convention

    const {
      saved_objects
    } = await soClient.bulkCreate(packagePolicies.map(packagePolicy => {
      var _options$user$usernam3, _options$user3, _options$user$usernam4, _options$user4;

      const packagePolicyId = _uuid.default.v4();

      const inputs = packagePolicy.inputs.map(input => assignStreamIdToInput(packagePolicyId, input));
      return {
        type: SAVED_OBJECT_TYPE,
        id: packagePolicyId,
        attributes: { ...packagePolicy,
          inputs,
          policy_id: agentPolicyId,
          revision: 1,
          created_at: isoDate,
          created_by: (_options$user$usernam3 = options === null || options === void 0 ? void 0 : (_options$user3 = options.user) === null || _options$user3 === void 0 ? void 0 : _options$user3.username) !== null && _options$user$usernam3 !== void 0 ? _options$user$usernam3 : 'system',
          updated_at: isoDate,
          updated_by: (_options$user$usernam4 = options === null || options === void 0 ? void 0 : (_options$user4 = options.user) === null || _options$user4 === void 0 ? void 0 : _options$user4.username) !== null && _options$user$usernam4 !== void 0 ? _options$user$usernam4 : 'system'
        }
      };
    })); // Filter out invalid SOs

    const newSos = saved_objects.filter(so => !so.error && so.attributes); // Assign it to the given agent policy

    await _agent_policy.agentPolicyService.assignPackagePolicies(soClient, esClient, agentPolicyId, newSos.map(newSo => newSo.id), {
      user: options === null || options === void 0 ? void 0 : options.user,
      bumpRevision: (_options$bumpRevision2 = options === null || options === void 0 ? void 0 : options.bumpRevision) !== null && _options$bumpRevision2 !== void 0 ? _options$bumpRevision2 : true
    });
    return newSos.map(newSo => ({
      id: newSo.id,
      version: newSo.version,
      ...newSo.attributes
    }));
  }

  async get(soClient, id) {
    const packagePolicySO = await soClient.get(SAVED_OBJECT_TYPE, id);

    if (!packagePolicySO) {
      return null;
    }

    if (packagePolicySO.error) {
      throw new Error(packagePolicySO.error.message);
    }

    return {
      id: packagePolicySO.id,
      version: packagePolicySO.version,
      ...packagePolicySO.attributes
    };
  }

  async getByIDs(soClient, ids) {
    const packagePolicySO = await soClient.bulkGet(ids.map(id => ({
      id,
      type: SAVED_OBJECT_TYPE
    })));

    if (!packagePolicySO) {
      return null;
    }

    return packagePolicySO.saved_objects.map(so => ({
      id: so.id,
      version: so.version,
      ...so.attributes
    }));
  }

  async list(soClient, options) {
    const {
      page = 1,
      perPage = 20,
      sortField = 'updated_at',
      sortOrder = 'desc',
      kuery
    } = options;
    const packagePolicies = await soClient.find({
      type: SAVED_OBJECT_TYPE,
      sortField,
      sortOrder,
      page,
      perPage,
      filter: kuery ? (0, _saved_object.normalizeKuery)(SAVED_OBJECT_TYPE, kuery) : undefined
    });
    return {
      items: packagePolicies === null || packagePolicies === void 0 ? void 0 : packagePolicies.saved_objects.map(packagePolicySO => ({
        id: packagePolicySO.id,
        version: packagePolicySO.version,
        ...packagePolicySO.attributes
      })),
      total: packagePolicies === null || packagePolicies === void 0 ? void 0 : packagePolicies.total,
      page,
      perPage
    };
  }

  async listIds(soClient, options) {
    const {
      page = 1,
      perPage = 20,
      sortField = 'updated_at',
      sortOrder = 'desc',
      kuery
    } = options;
    const packagePolicies = await soClient.find({
      type: SAVED_OBJECT_TYPE,
      sortField,
      sortOrder,
      page,
      perPage,
      fields: [],
      filter: kuery ? (0, _saved_object.normalizeKuery)(SAVED_OBJECT_TYPE, kuery) : undefined
    });
    return {
      items: packagePolicies.saved_objects.map(packagePolicySO => packagePolicySO.id),
      total: packagePolicies.total,
      page,
      perPage
    };
  }

  async update(soClient, esClient, id, packagePolicyUpdate, options, currentVersion) {
    var _packagePolicy$packag2, _options$user$usernam5, _options$user5;

    const packagePolicy = { ...packagePolicyUpdate,
      name: packagePolicyUpdate.name.trim()
    };
    const oldPackagePolicy = await this.get(soClient, id);
    const {
      version,
      ...restOfPackagePolicy
    } = packagePolicy;

    if (!oldPackagePolicy) {
      throw new Error('Package policy not found');
    } // Check that the name does not exist already but exclude the current package policy


    const existingPoliciesWithName = await this.list(soClient, {
      perPage: _common.SO_SEARCH_LIMIT,
      kuery: `${_constants2.PACKAGE_POLICY_SAVED_OBJECT_TYPE}.name:"${packagePolicy.name}"`
    });
    const filtered = ((existingPoliciesWithName === null || existingPoliciesWithName === void 0 ? void 0 : existingPoliciesWithName.items) || []).filter(p => p.id !== id);

    if (filtered.length > 0) {
      throw new _errors.IngestManagerError(`An integration policy with the name ${packagePolicy.name} already exists. Please rename it or choose a different name.`);
    }

    let inputs = restOfPackagePolicy.inputs.map(input => assignStreamIdToInput(oldPackagePolicy.id, input));
    inputs = enforceFrozenInputs(oldPackagePolicy.inputs, inputs);
    let elasticsearch;

    if ((_packagePolicy$packag2 = packagePolicy.package) !== null && _packagePolicy$packag2 !== void 0 && _packagePolicy$packag2.name) {
      var _getArchivePackage2;

      const pkgInfo = await (0, _packages.getPackageInfo)({
        savedObjectsClient: soClient,
        pkgName: packagePolicy.package.name,
        pkgVersion: packagePolicy.package.version
      });
      validatePackagePolicyOrThrow(packagePolicy, pkgInfo);
      let installablePackage = (_getArchivePackage2 = (0, _archive.getArchivePackage)(pkgInfo)) === null || _getArchivePackage2 === void 0 ? void 0 : _getArchivePackage2.packageInfo;

      if (!installablePackage) {
        installablePackage = await Registry.fetchInfo(pkgInfo.name, pkgInfo.version);
      }

      inputs = await this._compilePackagePolicyInputs(installablePackage, pkgInfo, packagePolicy.vars || {}, inputs);
      elasticsearch = installablePackage.elasticsearch;
    }

    await soClient.update(SAVED_OBJECT_TYPE, id, { ...restOfPackagePolicy,
      inputs,
      elasticsearch,
      revision: oldPackagePolicy.revision + 1,
      updated_at: new Date().toISOString(),
      updated_by: (_options$user$usernam5 = options === null || options === void 0 ? void 0 : (_options$user5 = options.user) === null || _options$user5 === void 0 ? void 0 : _options$user5.username) !== null && _options$user$usernam5 !== void 0 ? _options$user$usernam5 : 'system'
    }, {
      version
    }); // Bump revision of associated agent policy

    await _agent_policy.agentPolicyService.bumpRevision(soClient, esClient, packagePolicy.policy_id, {
      user: options === null || options === void 0 ? void 0 : options.user
    });
    const newPolicy = await this.get(soClient, id);

    if (packagePolicy.package) {
      await (0, _cleanup.removeOldAssets)({
        soClient,
        pkgName: packagePolicy.package.name,
        currentVersion: packagePolicy.package.version
      });

      if (packagePolicy.package.version !== currentVersion) {
        const upgradeTelemetry = {
          packageName: packagePolicy.package.name,
          currentVersion: currentVersion || 'unknown',
          newVersion: packagePolicy.package.version,
          status: 'success',
          eventType: 'package-policy-upgrade'
        };
        (0, _upgrade_sender.sendTelemetryEvents)(_.appContextService.getLogger(), _.appContextService.getTelemetryEventsSender(), upgradeTelemetry);

        _.appContextService.getLogger().info(`Package policy upgraded successfully`);

        _.appContextService.getLogger().debug(JSON.stringify(upgradeTelemetry));
      }
    }

    return newPolicy;
  }

  async delete(soClient, esClient, ids, options) {
    const result = [];

    for (const id of ids) {
      try {
        var _packagePolicy$packag3, _packagePolicy$packag4, _packagePolicy$packag5;

        const packagePolicy = await this.get(soClient, id);

        if (!packagePolicy) {
          throw new Error('Package policy not found');
        }

        if (!(options !== null && options !== void 0 && options.skipUnassignFromAgentPolicies)) {
          await _agent_policy.agentPolicyService.unassignPackagePolicies(soClient, esClient, packagePolicy.policy_id, [packagePolicy.id], {
            user: options === null || options === void 0 ? void 0 : options.user,
            force: options === null || options === void 0 ? void 0 : options.force
          });
        }

        await soClient.delete(SAVED_OBJECT_TYPE, id);
        result.push({
          id,
          name: packagePolicy.name,
          success: true,
          package: {
            name: ((_packagePolicy$packag3 = packagePolicy.package) === null || _packagePolicy$packag3 === void 0 ? void 0 : _packagePolicy$packag3.name) || '',
            title: ((_packagePolicy$packag4 = packagePolicy.package) === null || _packagePolicy$packag4 === void 0 ? void 0 : _packagePolicy$packag4.title) || '',
            version: ((_packagePolicy$packag5 = packagePolicy.package) === null || _packagePolicy$packag5 === void 0 ? void 0 : _packagePolicy$packag5.version) || ''
          },
          policy_id: packagePolicy.policy_id
        });
      } catch (error) {
        result.push({
          id,
          success: false,
          ...(0, _errors.ingestErrorToResponseOptions)(error)
        });
      }
    }

    return result;
  }

  async getUpgradePackagePolicyInfo(soClient, id) {
    var _packagePolicy$packag6, _installedPackage$ver, _packageInfo$version;

    const packagePolicy = await this.get(soClient, id);

    if (!packagePolicy) {
      throw new _errors.IngestManagerError(_i18n.i18n.translate('xpack.fleet.packagePolicy.policyNotFoundError', {
        defaultMessage: 'Package policy with id {id} not found',
        values: {
          id
        }
      }));
    }

    if (!((_packagePolicy$packag6 = packagePolicy.package) !== null && _packagePolicy$packag6 !== void 0 && _packagePolicy$packag6.name)) {
      throw new _errors.IngestManagerError(_i18n.i18n.translate('xpack.fleet.packagePolicy.packageNotFoundError', {
        defaultMessage: 'Package policy with id {id} has no named package',
        values: {
          id
        }
      }));
    }

    const installedPackage = await (0, _packages.getInstallation)({
      savedObjectsClient: soClient,
      pkgName: packagePolicy.package.name
    });

    if (!installedPackage) {
      throw new _errors.IngestManagerError(_i18n.i18n.translate('xpack.fleet.packagePolicy.packageNotInstalledError', {
        defaultMessage: 'Package {name} is not installed',
        values: {
          name: packagePolicy.package.name
        }
      }));
    }

    const packageInfo = await (0, _packages.getPackageInfo)({
      savedObjectsClient: soClient,
      pkgName: packagePolicy.package.name,
      pkgVersion: (_installedPackage$ver = installedPackage === null || installedPackage === void 0 ? void 0 : installedPackage.version) !== null && _installedPackage$ver !== void 0 ? _installedPackage$ver : ''
    });
    const isInstalledVersionLessThanPolicyVersion = (0, _lt.default)((_packageInfo$version = packageInfo === null || packageInfo === void 0 ? void 0 : packageInfo.version) !== null && _packageInfo$version !== void 0 ? _packageInfo$version : '', packagePolicy.package.version);

    if (isInstalledVersionLessThanPolicyVersion) {
      throw new _errors.PackagePolicyIneligibleForUpgradeError(_i18n.i18n.translate('xpack.fleet.packagePolicy.ineligibleForUpgradeError', {
        defaultMessage: "Package policy {id}'s package version {version} of package {name} is newer than the installed package version. Please install the latest version of {name}.",
        values: {
          id: packagePolicy.id,
          name: packagePolicy.package.name,
          version: packagePolicy.package.version
        }
      }));
    }

    return {
      packagePolicy: packagePolicy,
      packageInfo
    };
  }

  async upgrade(soClient, esClient, ids, options) {
    const result = [];

    for (const id of ids) {
      try {
        const {
          packagePolicy,
          packageInfo
        } = await this.getUpgradePackagePolicyInfo(soClient, id);
        const updatePackagePolicy = updatePackageInputs({ ...(0, _lodash.omit)(packagePolicy, 'id'),
          inputs: packagePolicy.inputs,
          package: { ...packagePolicy.package,
            version: packageInfo.version
          }
        }, packageInfo, (0, _common.packageToPackagePolicyInputs)(packageInfo));
        const registryPkgInfo = await Registry.fetchInfo(packageInfo.name, packageInfo.version);
        updatePackagePolicy.inputs = await this._compilePackagePolicyInputs(registryPkgInfo, packageInfo, updatePackagePolicy.vars || {}, updatePackagePolicy.inputs);
        updatePackagePolicy.elasticsearch = registryPkgInfo.elasticsearch;
        await this.update(soClient, esClient, id, updatePackagePolicy, options, packagePolicy.package.version);
        result.push({
          id,
          name: packagePolicy.name,
          success: true
        });
      } catch (error) {
        result.push({
          id,
          success: false,
          ...(0, _errors.ingestErrorToResponseOptions)(error)
        });
      }
    }

    return result;
  }

  async getUpgradeDryRunDiff(soClient, id) {
    try {
      const {
        packagePolicy,
        packageInfo
      } = await this.getUpgradePackagePolicyInfo(soClient, id);
      const updatedPackagePolicy = updatePackageInputs({ ...(0, _lodash.omit)(packagePolicy, 'id'),
        inputs: packagePolicy.inputs,
        package: { ...packagePolicy.package,
          version: packageInfo.version
        }
      }, packageInfo, (0, _common.packageToPackagePolicyInputs)(packageInfo), true);
      const registryPkgInfo = await Registry.fetchInfo(packageInfo.name, packageInfo.version);
      updatedPackagePolicy.inputs = await this._compilePackagePolicyInputs(registryPkgInfo, packageInfo, updatedPackagePolicy.vars || {}, updatedPackagePolicy.inputs);
      updatedPackagePolicy.elasticsearch = registryPkgInfo.elasticsearch;
      const hasErrors = ('errors' in updatedPackagePolicy);

      if (packagePolicy.package.version !== packageInfo.version) {
        const upgradeTelemetry = {
          packageName: packageInfo.name,
          currentVersion: packagePolicy.package.version,
          newVersion: packageInfo.version,
          status: hasErrors ? 'failure' : 'success',
          error: hasErrors ? updatedPackagePolicy.errors : undefined,
          dryRun: true,
          eventType: 'package-policy-upgrade'
        };
        (0, _upgrade_sender.sendTelemetryEvents)(_.appContextService.getLogger(), _.appContextService.getTelemetryEventsSender(), upgradeTelemetry);

        _.appContextService.getLogger().info(`Package policy upgrade dry run ${hasErrors ? 'resulted in errors' : 'ran successfully'}`);

        _.appContextService.getLogger().debug(JSON.stringify(upgradeTelemetry));
      }

      return {
        name: updatedPackagePolicy.name,
        diff: [packagePolicy, updatedPackagePolicy],
        // TODO: Currently only returns the agent inputs for current package policy, not the upgraded one
        // as we only show this version in the UI
        agent_diff: [(0, _agent_policies.storedPackagePolicyToAgentInputs)(packagePolicy, packageInfo)],
        hasErrors
      };
    } catch (error) {
      return {
        hasErrors: true,
        ...(0, _errors.ingestErrorToResponseOptions)(error)
      };
    }
  }

  async enrichPolicyWithDefaultsFromPackage(soClient, newPolicy) {
    let newPackagePolicy = newPolicy;

    if (newPolicy.package) {
      const newPP = await this.buildPackagePolicyFromPackageWithVersion(soClient, newPolicy.package.name, newPolicy.package.version);

      if (newPP) {
        var _newPolicy$namespace, _newPolicy$descriptio, _newPolicy$enabled, _newPolicy$policy_id, _newPolicy$output_id, _newPolicy$inputs$;

        const inputs = newPolicy.inputs.map(input => {
          var _defaultInput$streams;

          const defaultInput = newPP.inputs.find(i => i.type === input.type && (!input.policy_template || input.policy_template === i.policy_template));
          return { ...defaultInput,
            enabled: input.enabled,
            type: input.type,
            // to propagate "enabled: false" to streams
            streams: defaultInput === null || defaultInput === void 0 ? void 0 : (_defaultInput$streams = defaultInput.streams) === null || _defaultInput$streams === void 0 ? void 0 : _defaultInput$streams.map(stream => ({ ...stream,
              enabled: input.enabled
            }))
          };
        });
        let agentPolicyId; // fallback to first agent policy id in case no policy_id is specified, BWC with 8.0

        if (!newPolicy.policy_id) {
          const {
            items: agentPolicies
          } = await _agent_policy.agentPolicyService.list(soClient, {
            perPage: 1
          });

          if (agentPolicies.length > 0) {
            agentPolicyId = agentPolicies[0].id;
          }
        }

        newPackagePolicy = { ...newPP,
          name: newPolicy.name,
          namespace: (_newPolicy$namespace = newPolicy.namespace) !== null && _newPolicy$namespace !== void 0 ? _newPolicy$namespace : 'default',
          description: (_newPolicy$descriptio = newPolicy.description) !== null && _newPolicy$descriptio !== void 0 ? _newPolicy$descriptio : '',
          enabled: (_newPolicy$enabled = newPolicy.enabled) !== null && _newPolicy$enabled !== void 0 ? _newPolicy$enabled : true,
          policy_id: (_newPolicy$policy_id = newPolicy.policy_id) !== null && _newPolicy$policy_id !== void 0 ? _newPolicy$policy_id : agentPolicyId,
          output_id: (_newPolicy$output_id = newPolicy.output_id) !== null && _newPolicy$output_id !== void 0 ? _newPolicy$output_id : '',
          inputs: (_newPolicy$inputs$ = newPolicy.inputs[0]) !== null && _newPolicy$inputs$ !== void 0 && _newPolicy$inputs$.streams ? newPolicy.inputs : inputs,
          vars: newPolicy.vars || newPP.vars
        };
      }
    }

    return newPackagePolicy;
  }

  async buildPackagePolicyFromPackageWithVersion(soClient, pkgName, pkgVersion) {
    const packageInfo = await (0, _packages.getPackageInfo)({
      savedObjectsClient: soClient,
      pkgName,
      pkgVersion
    });

    if (packageInfo) {
      return (0, _common.packageToPackagePolicy)(packageInfo, '', '');
    }
  }

  async buildPackagePolicyFromPackage(soClient, pkgName) {
    const pkgInstall = await (0, _packages.getInstallation)({
      savedObjectsClient: soClient,
      pkgName
    });

    if (pkgInstall) {
      const [packageInfo, defaultOutputId] = await Promise.all([(0, _packages.getPackageInfo)({
        savedObjectsClient: soClient,
        pkgName: pkgInstall.name,
        pkgVersion: pkgInstall.version
      }), _output.outputService.getDefaultDataOutputId(soClient)]);

      if (packageInfo) {
        if (!defaultOutputId) {
          throw new Error('Default output is not set');
        }

        return (0, _common.packageToPackagePolicy)(packageInfo, '', defaultOutputId);
      }
    }
  }

  async _compilePackagePolicyInputs(installablePackage, pkgInfo, vars, inputs) {
    const inputsPromises = inputs.map(async input => {
      const compiledInput = await _compilePackagePolicyInput(pkgInfo, vars, input);
      const compiledStreams = await _compilePackageStreams(installablePackage, pkgInfo, vars, input);
      return { ...input,
        compiled_input: compiledInput,
        streams: compiledStreams
      };
    });
    return Promise.all(inputsPromises);
  }

  async runExternalCallbacks(externalCallbackType, packagePolicy, context, request) {
    if (externalCallbackType === 'postPackagePolicyDelete') {
      return await this.runDeleteExternalCallbacks(packagePolicy);
    } else {
      if (!Array.isArray(packagePolicy)) {
        let newData = packagePolicy;

        const externalCallbacks = _.appContextService.getExternalCallbacks(externalCallbackType);

        if (externalCallbacks && externalCallbacks.size > 0) {
          let updatedNewData = newData;

          for (const callback of externalCallbacks) {
            const result = await callback(updatedNewData, context, request);

            if (externalCallbackType === 'packagePolicyCreate') {
              updatedNewData = _types.NewPackagePolicySchema.validate(result);
            } else if (externalCallbackType === 'packagePolicyUpdate') {
              updatedNewData = _types.UpdatePackagePolicySchema.validate(result);
            }
          }

          newData = updatedNewData;
        }

        return newData;
      }
    }
  }

  async runDeleteExternalCallbacks(deletedPackagePolicies) {
    const externalCallbacks = _.appContextService.getExternalCallbacks('postPackagePolicyDelete');

    const errorsThrown = [];

    if (externalCallbacks && externalCallbacks.size > 0) {
      for (const callback of externalCallbacks) {
        // Failures from an external callback should not prevent other external callbacks from being
        // executed. Errors (if any) will be collected and `throw`n after processing the entire set
        try {
          await callback(deletedPackagePolicies);
        } catch (error) {
          errorsThrown.push(error);
        }
      }

      if (errorsThrown.length > 0) {
        throw new _errors.IngestManagerError(`${errorsThrown.length} encountered while executing package delete external callbacks`, errorsThrown);
      }
    }
  }

}

function validatePackagePolicyOrThrow(packagePolicy, pkgInfo) {
  const validationResults = (0, _common.validatePackagePolicy)(packagePolicy, pkgInfo, _jsYaml.safeLoad);

  if ((0, _common.validationHasErrors)(validationResults)) {
    const responseFormattedValidationErrors = Object.entries((0, _std.getFlattenedObject)(validationResults)).map(([key, value]) => ({
      key,
      message: value
    })).filter(({
      message
    }) => !!message);

    if (responseFormattedValidationErrors.length) {
      throw new _errors.PackagePolicyValidationError(_i18n.i18n.translate('xpack.fleet.packagePolicyInvalidError', {
        defaultMessage: 'Package policy is invalid: {errors}',
        values: {
          errors: responseFormattedValidationErrors.map(({
            key,
            message
          }) => `${key}: ${message}`).join('\n')
        }
      }));
    }
  }
}

function assignStreamIdToInput(packagePolicyId, input) {
  return { ...input,
    streams: input.streams.map(stream => {
      return { ...stream,
        id: `${input.type}-${stream.data_stream.dataset}-${packagePolicyId}`
      };
    })
  };
}

async function _compilePackagePolicyInput(pkgInfo, vars, input) {
  var _pkgInfo$policy_templ, _pkgInfo$policy_templ2, _packagePolicyTemplat;

  const packagePolicyTemplate = input.policy_template ? (_pkgInfo$policy_templ = pkgInfo.policy_templates) === null || _pkgInfo$policy_templ === void 0 ? void 0 : _pkgInfo$policy_templ.find(policyTemplate => policyTemplate.name === input.policy_template) : (_pkgInfo$policy_templ2 = pkgInfo.policy_templates) === null || _pkgInfo$policy_templ2 === void 0 ? void 0 : _pkgInfo$policy_templ2[0];

  if (!input.enabled || !packagePolicyTemplate || !((_packagePolicyTemplat = packagePolicyTemplate.inputs) !== null && _packagePolicyTemplat !== void 0 && _packagePolicyTemplat.length)) {
    return undefined;
  }

  const packageInputs = packagePolicyTemplate.inputs;
  const packageInput = packageInputs.find(pkgInput => pkgInput.type === input.type);

  if (!packageInput) {
    throw new Error(`Input template not found, unable to find input type ${input.type}`);
  }

  if (!packageInput.template_path) {
    return undefined;
  }

  const [pkgInputTemplate] = await (0, _assets.getAssetsData)(pkgInfo, path => path.endsWith(`/agent/input/${packageInput.template_path}`));

  if (!pkgInputTemplate || !pkgInputTemplate.buffer) {
    throw new Error(`Unable to load input template at /agent/input/${packageInput.template_path}`);
  }

  return (0, _agent.compileTemplate)( // Populate template variables from package- and input-level vars
  Object.assign({}, vars, input.vars), pkgInputTemplate.buffer.toString());
}

async function _compilePackageStreams(installablePackage, pkgInfo, vars, input) {
  const streamsPromises = input.streams.map(stream => _compilePackageStream(pkgInfo, vars, input, stream));
  return await Promise.all(streamsPromises);
} // temporary export to enable testing pending refactor https://github.com/elastic/kibana/issues/112386


function _applyIndexPrivileges(packageDataStream, stream) {
  var _packageDataStream$el, _packageDataStream$el2;

  const streamOut = { ...stream
  };
  const indexPrivileges = packageDataStream === null || packageDataStream === void 0 ? void 0 : (_packageDataStream$el = packageDataStream.elasticsearch) === null || _packageDataStream$el === void 0 ? void 0 : (_packageDataStream$el2 = _packageDataStream$el.privileges) === null || _packageDataStream$el2 === void 0 ? void 0 : _packageDataStream$el2.indices;

  if (!(indexPrivileges !== null && indexPrivileges !== void 0 && indexPrivileges.length)) {
    return streamOut;
  }

  const [valid, invalid] = (0, _lodash.partition)(indexPrivileges, permission => DATA_STREAM_ALLOWED_INDEX_PRIVILEGES.has(permission));

  if (invalid.length) {
    _.appContextService.getLogger().warn(`Ignoring invalid or forbidden index privilege(s) in "${stream.id}" data stream: ${invalid}`);
  }

  if (valid.length) {
    stream.data_stream.elasticsearch = {
      privileges: {
        indices: valid
      }
    };
  }

  return streamOut;
}

async function _compilePackageStream(pkgInfo, vars, input, streamIn) {
  let stream = streamIn;

  if (!stream.enabled) {
    return { ...stream,
      compiled_stream: undefined
    };
  }

  const packageDataStreams = pkgInfo.data_streams;

  if (!packageDataStreams) {
    throw new Error('Stream template not found, no data streams');
  }

  const packageDataStream = packageDataStreams.find(pkgDataStream => pkgDataStream.dataset === stream.data_stream.dataset);

  if (!packageDataStream) {
    throw new Error(`Stream template not found, unable to find dataset ${stream.data_stream.dataset}`);
  }

  stream = _applyIndexPrivileges(packageDataStream, streamIn);
  const streamFromPkg = (packageDataStream.streams || []).find(pkgStream => pkgStream.input === input.type);

  if (!streamFromPkg) {
    throw new Error(`Stream template not found, unable to find stream for input ${input.type}`);
  }

  if (!streamFromPkg.template_path) {
    throw new Error(`Stream template path not found for dataset ${stream.data_stream.dataset}`);
  }

  const datasetPath = packageDataStream.path;
  const [pkgStreamTemplate] = await (0, _assets.getAssetsData)(pkgInfo, path => path.endsWith(streamFromPkg.template_path), datasetPath);

  if (!pkgStreamTemplate || !pkgStreamTemplate.buffer) {
    throw new Error(`Unable to load stream template ${streamFromPkg.template_path} for dataset ${stream.data_stream.dataset}`);
  }

  const yaml = (0, _agent.compileTemplate)( // Populate template variables from package-, input-, and stream-level vars
  Object.assign({}, vars, input.vars, stream.vars), pkgStreamTemplate.buffer.toString());
  stream.compiled_stream = yaml;
  return { ...stream
  };
}

function enforceFrozenInputs(oldInputs, newInputs) {
  const resultInputs = [...newInputs];

  for (const input of resultInputs) {
    const oldInput = oldInputs.find(i => i.type === input.type);
    if (oldInput !== null && oldInput !== void 0 && oldInput.keep_enabled) input.enabled = oldInput.enabled;

    if (input.vars && oldInput !== null && oldInput !== void 0 && oldInput.vars) {
      input.vars = _enforceFrozenVars(oldInput.vars, input.vars);
    }

    if (input.streams && oldInput !== null && oldInput !== void 0 && oldInput.streams) {
      for (const stream of input.streams) {
        const oldStream = oldInput.streams.find(s => s.id === stream.id);
        if (oldStream !== null && oldStream !== void 0 && oldStream.keep_enabled) stream.enabled = oldStream.enabled;

        if (stream.vars && oldStream !== null && oldStream !== void 0 && oldStream.vars) {
          stream.vars = _enforceFrozenVars(oldStream.vars, stream.vars);
        }
      }
    }
  }

  return resultInputs;
}

function _enforceFrozenVars(oldVars, newVars) {
  const resultVars = {};

  for (const [key, val] of Object.entries(newVars)) {
    var _oldVars$key;

    if ((_oldVars$key = oldVars[key]) !== null && _oldVars$key !== void 0 && _oldVars$key.frozen) {
      resultVars[key] = oldVars[key];
    } else {
      resultVars[key] = val;
    }
  }

  for (const [key, val] of Object.entries(oldVars)) {
    if (!newVars[key] && val.frozen) {
      resultVars[key] = val;
    }
  }

  return resultVars;
}

const packagePolicyService = new PackagePolicyService();
exports.packagePolicyService = packagePolicyService;

function updatePackageInputs(basePackagePolicy, packageInfo, inputsUpdated, dryRun) {
  var _packageInfo$policy_t;

  if (!inputsUpdated) return basePackagePolicy;
  const availablePolicyTemplates = (_packageInfo$policy_t = packageInfo.policy_templates) !== null && _packageInfo$policy_t !== void 0 ? _packageInfo$policy_t : [];
  const inputs = [...basePackagePolicy.inputs.filter(input => {
    var _policyTemplate$input, _policyTemplate$input2;

    if (!input.policy_template) {
      return true;
    }

    const policyTemplate = availablePolicyTemplates.find(({
      name
    }) => name === input.policy_template); // Ignore any policy templates removed in the new package version

    if (!policyTemplate) {
      return false;
    } // Ignore any inputs removed from this policy template in the new package version


    const policyTemplateStillIncludesInput = (_policyTemplate$input = (_policyTemplate$input2 = policyTemplate.inputs) === null || _policyTemplate$input2 === void 0 ? void 0 : _policyTemplate$input2.some(policyTemplateInput => policyTemplateInput.type === input.type)) !== null && _policyTemplate$input !== void 0 ? _policyTemplate$input : false;
    return policyTemplateStillIncludesInput;
  })];

  for (const update of inputsUpdated) {
    let originalInput;

    if (update.policy_template) {
      // If the updated value defines a policy template, try to find an original input
      // with the same policy template value
      const matchingInput = inputs.find(i => i.type === update.type && i.policy_template === update.policy_template); // If we didn't find an input with the same policy template, try to look for one
      // with the same type, but with an undefined policy template. This ensures we catch
      // cases where we're upgrading an older policy from before policy template was
      // reliably define on package policy inputs.

      originalInput = matchingInput || inputs.find(i => i.type === update.type && !i.policy_template);
    } else {
      // For inputs that don't specify a policy template, just grab the first input
      // that matches its `type`
      originalInput = inputs.find(i => i.type === update.type);
    } // If there's no corresponding input on the original package policy, just
    // take the override value from the new package as-is. This case typically
    // occurs when inputs or package policy templates are added/removed between versions.


    if (originalInput === undefined) {
      inputs.push(update);
      continue;
    } // For flags like this, we only want to override the original value if it was set
    // as `undefined` in the original object. An explicit true/false value should be
    // persisted from the original object to the result after the override process is complete.


    if (originalInput.enabled === undefined && update.enabled !== undefined) {
      originalInput.enabled = update.enabled;
    }

    if (originalInput.keep_enabled === undefined && update.keep_enabled !== undefined) {
      originalInput.keep_enabled = update.keep_enabled;
    } // `policy_template` should always be defined, so if we have an older policy here we need
    // to ensure we set it


    if (originalInput.policy_template === undefined && update.policy_template !== undefined) {
      originalInput.policy_template = update.policy_template;
    }

    if (update.vars) {
      const indexOfInput = inputs.indexOf(originalInput);
      inputs[indexOfInput] = deepMergeVars(originalInput, update, true);
      originalInput = inputs[indexOfInput];
    }

    if (update.streams) {
      for (const stream of update.streams) {
        var _originalInput, _originalStream;

        let originalStream = (_originalInput = originalInput) === null || _originalInput === void 0 ? void 0 : _originalInput.streams.find(s => s.data_stream.dataset === stream.data_stream.dataset);

        if (originalStream === undefined) {
          originalInput.streams.push(stream);
          continue;
        }

        if (((_originalStream = originalStream) === null || _originalStream === void 0 ? void 0 : _originalStream.enabled) === undefined) {
          originalStream.enabled = stream.enabled;
        }

        if (stream.vars) {
          const indexOfStream = originalInput.streams.indexOf(originalStream);
          originalInput.streams[indexOfStream] = deepMergeVars(originalStream, stream, true);
          originalStream = originalInput.streams[indexOfStream];
        }
      }
    } // Filter all stream that have been removed from the input


    originalInput.streams = originalInput.streams.filter(originalStream => {
      var _update$streams$some, _update$streams;

      return (_update$streams$some = (_update$streams = update.streams) === null || _update$streams === void 0 ? void 0 : _update$streams.some(s => s.data_stream.dataset === originalStream.data_stream.dataset)) !== null && _update$streams$some !== void 0 ? _update$streams$some : false;
    });
  }

  const resultingPackagePolicy = { ...basePackagePolicy,
    inputs
  };
  const validationResults = (0, _common.validatePackagePolicy)(resultingPackagePolicy, packageInfo, _jsYaml.safeLoad);

  if ((0, _common.validationHasErrors)(validationResults)) {
    const responseFormattedValidationErrors = Object.entries((0, _std.getFlattenedObject)(validationResults)).map(([key, value]) => ({
      key,
      message: value
    })).filter(({
      message
    }) => !!message);

    if (responseFormattedValidationErrors.length) {
      if (dryRun) {
        return { ...resultingPackagePolicy,
          errors: responseFormattedValidationErrors
        };
      }

      throw new _errors.PackagePolicyValidationError(_i18n.i18n.translate('xpack.fleet.packagePolicyInvalidError', {
        defaultMessage: 'Package policy is invalid: {errors}',
        values: {
          errors: responseFormattedValidationErrors.map(({
            key,
            message
          }) => `${key}: ${message}`).join('\n')
        }
      }));
    }
  }

  return resultingPackagePolicy;
}

function preconfigurePackageInputs(basePackagePolicy, packageInfo, preconfiguredInputs) {
  if (!preconfiguredInputs) return basePackagePolicy;
  const inputs = [...basePackagePolicy.inputs];

  for (const preconfiguredInput of preconfiguredInputs) {
    // Preconfiguration does not currently support multiple policy templates, so overrides will have an undefined
    // policy template, so we only match on `type` in that case.
    let originalInput = preconfiguredInput.policy_template ? inputs.find(i => i.type === preconfiguredInput.type && i.policy_template === preconfiguredInput.policy_template) : inputs.find(i => i.type === preconfiguredInput.type); // If the input do not exist skip

    if (originalInput === undefined) {
      continue;
    }

    if (preconfiguredInput.enabled !== undefined) {
      originalInput.enabled = preconfiguredInput.enabled;
    }

    if (preconfiguredInput.keep_enabled !== undefined) {
      originalInput.keep_enabled = preconfiguredInput.keep_enabled;
    }

    if (preconfiguredInput.vars) {
      const indexOfInput = inputs.indexOf(originalInput);
      inputs[indexOfInput] = deepMergeVars(originalInput, preconfiguredInput);
      originalInput = inputs[indexOfInput];
    }

    if (preconfiguredInput.streams) {
      for (const stream of preconfiguredInput.streams) {
        var _originalInput2;

        let originalStream = (_originalInput2 = originalInput) === null || _originalInput2 === void 0 ? void 0 : _originalInput2.streams.find(s => s.data_stream.dataset === stream.data_stream.dataset);

        if (originalStream === undefined) {
          continue;
        }

        if (stream.enabled !== undefined) {
          originalStream.enabled = stream.enabled;
        }

        if (stream.vars) {
          const indexOfStream = originalInput.streams.indexOf(originalStream);
          originalInput.streams[indexOfStream] = deepMergeVars(originalStream, stream);
          originalStream = originalInput.streams[indexOfStream];
        }
      }
    }
  }

  const resultingPackagePolicy = { ...basePackagePolicy,
    inputs
  };
  validatePackagePolicyOrThrow(resultingPackagePolicy, packageInfo);
  return resultingPackagePolicy;
}

function deepMergeVars(original, override, keepOriginalValue = false) {
  if (!original.vars) {
    original.vars = { ...override.vars
    };
  }

  const result = { ...original
  };
  const overrideVars = Array.isArray(override.vars) ? override.vars : Object.entries(override.vars).map(([key, rest]) => ({
    name: key,
    ...rest
  }));

  for (const {
    name,
    ...overrideVal
  } of overrideVars) {
    const originalVar = original.vars[name];
    result.vars[name] = { ...originalVar,
      ...overrideVal
    }; // Ensure that any value from the original object is persisted on the newly merged resulting object,
    // even if we merge other data about the given variable

    if (keepOriginalValue && (originalVar === null || originalVar === void 0 ? void 0 : originalVar.value) !== undefined) {
      result.vars[name].value = originalVar.value;
    }
  }

  return result;
}