"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addPackageToAgentPolicy = addPackageToAgentPolicy;
exports.agentPolicyService = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = require("lodash");

var _v = _interopRequireDefault(require("uuid/v4"));

var _v2 = _interopRequireDefault(require("uuid/v5"));

var _jsYaml = require("js-yaml");

var _pMap = _interopRequireDefault(require("p-map"));

var _constants = require("../constants");

var _common = require("../../common");

var _errors = require("../errors");

var _agent_cm_to_yaml = require("../../common/services/agent_cm_to_yaml");

var _elastic_agent_manifest = require("./elastic_agent_manifest");

var _packages = require("./epm/packages");

var _agents = require("./agents");

var _package_policy = require("./package_policy");

var _package_policies = require("./package_policies");

var _output = require("./output");

var _agent_policy_update = require("./agent_policy_update");

var _saved_object = require("./saved_object");

var _app_context = require("./app_context");

var _agent_policies = require("./agent_policies");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const SAVED_OBJECT_TYPE = _constants.AGENT_POLICY_SAVED_OBJECT_TYPE;

class AgentPolicyService {
  constructor() {
    (0, _defineProperty2.default)(this, "triggerAgentPolicyUpdatedEvent", async (soClient, esClient, action, agentPolicyId) => {
      return (0, _agent_policy_update.agentPolicyUpdateEventHandler)(soClient, esClient, action, agentPolicyId);
    });
  }

  async _update(soClient, esClient, id, agentPolicy, user, options = {
    bumpRevision: true
  }) {
    const oldAgentPolicy = await this.get(soClient, id, false);

    if (!oldAgentPolicy) {
      throw new Error('Agent policy not found');
    }

    if (oldAgentPolicy.status === _common.agentPolicyStatuses.Inactive && agentPolicy.status !== _common.agentPolicyStatuses.Active) {
      throw new Error(`Agent policy ${id} cannot be updated because it is ${oldAgentPolicy.status}`);
    }

    await soClient.update(SAVED_OBJECT_TYPE, id, { ...agentPolicy,
      ...(options.bumpRevision ? {
        revision: oldAgentPolicy.revision + 1
      } : {}),
      updated_at: new Date().toISOString(),
      updated_by: user ? user.username : 'system'
    });

    if (options.bumpRevision) {
      await this.triggerAgentPolicyUpdatedEvent(soClient, esClient, 'updated', id);
    }

    return await this.get(soClient, id);
  }

  async ensurePreconfiguredAgentPolicy(soClient, esClient, config) {
    const {
      id,
      ...preconfiguredAgentPolicy
    } = (0, _lodash.omit)(config, 'package_policies');
    const newAgentPolicyDefaults = {
      namespace: 'default',
      monitoring_enabled: ['logs', 'metrics']
    };
    const newAgentPolicy = { ...newAgentPolicyDefaults,
      ...preconfiguredAgentPolicy,
      is_preconfigured: true
    };
    if (!id) throw new Error('Missing ID');
    return await this.ensureAgentPolicy(soClient, esClient, newAgentPolicy, id);
  }

  async ensureAgentPolicy(soClient, esClient, newAgentPolicy, id) {
    // For preconfigured policies with a specified ID
    const agentPolicy = await this.get(soClient, id, false).catch(() => null);

    if (!agentPolicy) {
      return {
        created: true,
        policy: await this.create(soClient, esClient, newAgentPolicy, {
          id
        })
      };
    }

    return {
      created: false,
      policy: agentPolicy
    };
  }

  async create(soClient, esClient, agentPolicy, options) {
    var _agentPolicy$is_manag, _options$user;

    await this.requireUniqueName(soClient, agentPolicy);
    const newSo = await soClient.create(SAVED_OBJECT_TYPE, { ...agentPolicy,
      status: 'active',
      is_managed: (_agentPolicy$is_manag = agentPolicy.is_managed) !== null && _agentPolicy$is_manag !== void 0 ? _agentPolicy$is_manag : false,
      revision: 1,
      updated_at: new Date().toISOString(),
      updated_by: (options === null || options === void 0 ? void 0 : (_options$user = options.user) === null || _options$user === void 0 ? void 0 : _options$user.username) || 'system'
    }, options);
    await this.triggerAgentPolicyUpdatedEvent(soClient, esClient, 'created', newSo.id);
    return {
      id: newSo.id,
      ...newSo.attributes
    };
  }

  async requireUniqueName(soClient, givenPolicy) {
    const results = await soClient.find({
      type: SAVED_OBJECT_TYPE,
      searchFields: ['name'],
      search: (0, _saved_object.escapeSearchQueryPhrase)(givenPolicy.name)
    });
    const idsWithName = results.total && results.saved_objects.map(({
      id
    }) => id);

    if (Array.isArray(idsWithName)) {
      const isEditingSelf = givenPolicy.id && idsWithName.includes(givenPolicy.id);

      if (!givenPolicy.id || !isEditingSelf) {
        const isSinglePolicy = idsWithName.length === 1;
        const existClause = isSinglePolicy ? `Agent Policy '${idsWithName[0]}' already exists` : `Agent Policies '${idsWithName.join(',')}' already exist`;
        throw new _errors.AgentPolicyNameExistsError(`${existClause} with name '${givenPolicy.name}'`);
      }
    }
  }

  async get(soClient, id, withPackagePolicies = true) {
    const agentPolicySO = await soClient.get(SAVED_OBJECT_TYPE, id);

    if (!agentPolicySO) {
      return null;
    }

    if (agentPolicySO.error) {
      throw new Error(agentPolicySO.error.message);
    }

    const agentPolicy = {
      id: agentPolicySO.id,
      ...agentPolicySO.attributes
    };

    if (withPackagePolicies) {
      agentPolicy.package_policies = (await _package_policy.packagePolicyService.getByIDs(soClient, agentPolicySO.attributes.package_policies || [])) || [];
    }

    return agentPolicy;
  }

  async getByIDs(soClient, ids, options = {}) {
    const objects = ids.map(id => ({ ...options,
      id,
      type: SAVED_OBJECT_TYPE
    }));
    const agentPolicySO = await soClient.bulkGet(objects);
    return agentPolicySO.saved_objects.map(so => ({
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
      kuery,
      withPackagePolicies = false
    } = options;
    const baseFindParams = {
      type: SAVED_OBJECT_TYPE,
      sortField,
      sortOrder,
      page,
      perPage
    };
    const filter = kuery ? (0, _saved_object.normalizeKuery)(SAVED_OBJECT_TYPE, kuery) : undefined;
    let agentPoliciesSO;

    try {
      agentPoliciesSO = await soClient.find({ ...baseFindParams,
        filter
      });
    } catch (e) {
      var _e$output, _e$message;

      const isBadRequest = ((_e$output = e.output) === null || _e$output === void 0 ? void 0 : _e$output.statusCode) === 400;
      const isKQLSyntaxError = (_e$message = e.message) === null || _e$message === void 0 ? void 0 : _e$message.startsWith('KQLSyntaxError');

      if (isBadRequest && !isKQLSyntaxError) {
        // fall back to simple search if the kuery is just a search term i.e not KQL
        agentPoliciesSO = await soClient.find({ ...baseFindParams,
          search: kuery
        });
      } else {
        throw e;
      }
    }

    const agentPolicies = await Promise.all(agentPoliciesSO.saved_objects.map(async agentPolicySO => {
      const agentPolicy = {
        id: agentPolicySO.id,
        ...agentPolicySO.attributes
      };

      if (withPackagePolicies) {
        const agentPolicyWithPackagePolicies = await this.get(soClient, agentPolicySO.id, withPackagePolicies);

        if (agentPolicyWithPackagePolicies) {
          agentPolicy.package_policies = agentPolicyWithPackagePolicies.package_policies;
        }
      }

      return agentPolicy;
    }));
    return {
      items: agentPolicies,
      total: agentPoliciesSO.total,
      page,
      perPage
    };
  }

  async update(soClient, esClient, id, agentPolicy, options) {
    if (agentPolicy.name) {
      await this.requireUniqueName(soClient, {
        id,
        name: agentPolicy.name
      });
    }

    return this._update(soClient, esClient, id, agentPolicy, options === null || options === void 0 ? void 0 : options.user);
  }

  async copy(soClient, esClient, id, newAgentPolicyProps, options) {
    // Copy base agent policy
    const baseAgentPolicy = await this.get(soClient, id, true);

    if (!baseAgentPolicy) {
      throw new Error('Agent policy not found');
    } // eslint-disable-next-line @typescript-eslint/naming-convention


    const {
      namespace,
      monitoring_enabled
    } = baseAgentPolicy;
    const newAgentPolicy = await this.create(soClient, esClient, {
      namespace,
      monitoring_enabled,
      ...newAgentPolicyProps
    }, options); // Copy all package policies and append (copy n) to their names

    if (baseAgentPolicy.package_policies.length) {
      const newPackagePolicies = await (0, _pMap.default)(baseAgentPolicy.package_policies, async packagePolicy => {
        const {
          id: packagePolicyId,
          version,
          ...newPackagePolicy
        } = packagePolicy;
        const updatedPackagePolicy = { ...newPackagePolicy,
          name: await (0, _package_policies.incrementPackagePolicyCopyName)(soClient, packagePolicy.name)
        };
        return updatedPackagePolicy;
      });
      await _package_policy.packagePolicyService.bulkCreate(soClient, esClient, newPackagePolicies, newAgentPolicy.id, { ...options,
        bumpRevision: false
      });
    } // Get updated agent policy


    const updatedAgentPolicy = await this.get(soClient, newAgentPolicy.id, true);

    if (!updatedAgentPolicy) {
      throw new Error('Copied agent policy not found');
    }

    await this.deployPolicy(soClient, newAgentPolicy.id);
    return updatedAgentPolicy;
  }

  async bumpRevision(soClient, esClient, id, options) {
    const res = await this._update(soClient, esClient, id, {}, options === null || options === void 0 ? void 0 : options.user);
    return res;
  }

  async bumpAllAgentPoliciesForOutput(soClient, esClient, outputId, options) {
    const currentPolicies = await soClient.find({
      type: SAVED_OBJECT_TYPE,
      fields: ['revision', 'data_output_id', 'monitoring_output_id'],
      searchFields: ['data_output_id', 'monitoring_output_id'],
      search: (0, _saved_object.escapeSearchQueryPhrase)(outputId),
      perPage: _constants.SO_SEARCH_LIMIT
    });
    const bumpedPolicies = currentPolicies.saved_objects.map(policy => {
      policy.attributes = { ...policy.attributes,
        revision: policy.attributes.revision + 1,
        updated_at: new Date().toISOString(),
        updated_by: options !== null && options !== void 0 && options.user ? options.user.username : 'system'
      };
      return policy;
    });
    const res = await soClient.bulkUpdate(bumpedPolicies);
    await (0, _pMap.default)(currentPolicies.saved_objects, policy => this.triggerAgentPolicyUpdatedEvent(soClient, esClient, 'updated', policy.id), {
      concurrency: 50
    });
    return res;
  }

  async bumpAllAgentPolicies(soClient, esClient, options) {
    const currentPolicies = await soClient.find({
      type: SAVED_OBJECT_TYPE,
      fields: ['revision'],
      perPage: _constants.SO_SEARCH_LIMIT
    });
    const bumpedPolicies = currentPolicies.saved_objects.map(policy => {
      policy.attributes = { ...policy.attributes,
        revision: policy.attributes.revision + 1,
        updated_at: new Date().toISOString(),
        updated_by: options !== null && options !== void 0 && options.user ? options.user.username : 'system'
      };
      return policy;
    });
    const res = await soClient.bulkUpdate(bumpedPolicies);
    await (0, _pMap.default)(currentPolicies.saved_objects, policy => this.triggerAgentPolicyUpdatedEvent(soClient, esClient, 'updated', policy.id), {
      concurrency: 50
    });
    return res;
  }

  async assignPackagePolicies(soClient, esClient, id, packagePolicyIds, options = {
    bumpRevision: true
  }) {
    const oldAgentPolicy = await this.get(soClient, id, false);

    if (!oldAgentPolicy) {
      throw new Error('Agent policy not found');
    }

    if (oldAgentPolicy.is_managed && !(options !== null && options !== void 0 && options.force)) {
      throw new _errors.HostedAgentPolicyRestrictionRelatedError(`Cannot update integrations of hosted agent policy ${id}`);
    }

    return await this._update(soClient, esClient, id, {
      package_policies: (0, _lodash.uniq)([...(oldAgentPolicy.package_policies || [])].concat(packagePolicyIds))
    }, options === null || options === void 0 ? void 0 : options.user, {
      bumpRevision: options.bumpRevision
    });
  }

  async unassignPackagePolicies(soClient, esClient, id, packagePolicyIds, options) {
    const oldAgentPolicy = await this.get(soClient, id, false);

    if (!oldAgentPolicy) {
      throw new Error('Agent policy not found');
    }

    if (oldAgentPolicy.is_managed && !(options !== null && options !== void 0 && options.force)) {
      throw new _errors.HostedAgentPolicyRestrictionRelatedError(`Cannot remove integrations of hosted agent policy ${id}`);
    }

    return await this._update(soClient, esClient, id, {
      package_policies: (0, _lodash.uniq)([...(oldAgentPolicy.package_policies || [])].filter(packagePolicyId => !packagePolicyIds.includes(packagePolicyId)))
    }, options === null || options === void 0 ? void 0 : options.user);
  }

  async delete(soClient, esClient, id, options) {
    const agentPolicy = await this.get(soClient, id, false);

    if (!agentPolicy) {
      throw new Error('Agent policy not found');
    }

    if (agentPolicy.is_managed && !(options !== null && options !== void 0 && options.force)) {
      throw new _errors.HostedAgentPolicyRestrictionRelatedError(`Cannot delete hosted agent policy ${id}`);
    }

    const {
      total
    } = await (0, _agents.getAgentsByKuery)(esClient, {
      showInactive: false,
      perPage: 0,
      page: 1,
      kuery: `${_constants.AGENTS_PREFIX}.policy_id:${id}`
    });

    if (total > 0) {
      throw new Error('Cannot delete agent policy that is assigned to agent(s)');
    }

    if (agentPolicy.package_policies && agentPolicy.package_policies.length) {
      const deletedPackagePolicies = await _package_policy.packagePolicyService.delete(soClient, esClient, agentPolicy.package_policies, {
        force: options === null || options === void 0 ? void 0 : options.force,
        skipUnassignFromAgentPolicies: true
      });

      try {
        await _package_policy.packagePolicyService.runDeleteExternalCallbacks(deletedPackagePolicies);
      } catch (error) {
        const logger = _app_context.appContextService.getLogger();

        logger.error(`An error occurred executing external callback: ${error}`);
        logger.error(error);
      }
    }

    if (agentPolicy.is_preconfigured && !(options !== null && options !== void 0 && options.force)) {
      await soClient.create(_constants.PRECONFIGURATION_DELETION_RECORD_SAVED_OBJECT_TYPE, {
        id: String(id)
      });
    }

    await soClient.delete(SAVED_OBJECT_TYPE, id);
    await this.triggerAgentPolicyUpdatedEvent(soClient, esClient, 'deleted', id);

    if (options !== null && options !== void 0 && options.removeFleetServerDocuments) {
      await this.deleteFleetServerPoliciesForPolicyId(esClient, id);
    }

    return {
      id,
      name: agentPolicy.name
    };
  }

  async deployPolicy(soClient, agentPolicyId) {
    // Use internal ES client so we have permissions to write to .fleet* indices
    const esClient = _app_context.appContextService.getInternalUserESClient();

    const defaultOutputId = await _output.outputService.getDefaultDataOutputId(soClient);

    if (!defaultOutputId) {
      return;
    }

    const policy = await agentPolicyService.get(soClient, agentPolicyId);
    const fullPolicy = await agentPolicyService.getFullAgentPolicy(soClient, agentPolicyId);

    if (!policy || !fullPolicy || !fullPolicy.revision) {
      return;
    }

    const fleetServerPolicy = {
      '@timestamp': new Date().toISOString(),
      revision_idx: fullPolicy.revision,
      coordinator_idx: 0,
      data: fullPolicy,
      policy_id: fullPolicy.id,
      default_fleet_server: policy.is_default_fleet_server === true
    };

    if (policy.unenroll_timeout) {
      fleetServerPolicy.unenroll_timeout = policy.unenroll_timeout;
    }

    await esClient.create({
      index: _common.AGENT_POLICY_INDEX,
      body: fleetServerPolicy,
      id: (0, _v.default)(),
      refresh: 'wait_for'
    });
  }

  async deleteFleetServerPoliciesForPolicyId(esClient, agentPolicyId) {
    await esClient.deleteByQuery({
      index: _common.AGENT_POLICY_INDEX,
      ignore_unavailable: true,
      body: {
        query: {
          term: {
            policy_id: agentPolicyId
          }
        }
      }
    });
  }

  async getLatestFleetPolicy(esClient, agentPolicyId) {
    const res = await esClient.search({
      index: _common.AGENT_POLICY_INDEX,
      ignore_unavailable: true,
      body: {
        query: {
          term: {
            policy_id: agentPolicyId
          }
        },
        size: 1,
        sort: [{
          revision_idx: {
            order: 'desc'
          }
        }]
      }
    }); // @ts-expect-error value is number | TotalHits

    if (res.body.hits.total.value === 0) {
      return null;
    }

    return res.body.hits.hits[0]._source;
  }

  async getFullAgentConfigMap(soClient, id, options) {
    const fullAgentPolicy = await (0, _agent_policies.getFullAgentPolicy)(soClient, id, options);

    if (fullAgentPolicy) {
      const fullAgentConfigMap = {
        apiVersion: 'v1',
        kind: 'ConfigMap',
        metadata: {
          name: 'agent-node-datastreams',
          namespace: 'kube-system',
          labels: {
            'k8s-app': 'elastic-agent'
          }
        },
        data: {
          'agent.yml': fullAgentPolicy
        }
      };
      const configMapYaml = (0, _agent_cm_to_yaml.fullAgentConfigMapToYaml)(fullAgentConfigMap, _jsYaml.safeDump);

      const updateManifestVersion = _elastic_agent_manifest.elasticAgentManifest.replace('VERSION', _app_context.appContextService.getKibanaVersion());

      const fixedAgentYML = configMapYaml.replace('agent.yml:', 'agent.yml: |-');
      return [fixedAgentYML, updateManifestVersion].join('\n');
    } else {
      return '';
    }
  }

  async getFullAgentPolicy(soClient, id, options) {
    return (0, _agent_policies.getFullAgentPolicy)(soClient, id, options);
  }

}

const agentPolicyService = new AgentPolicyService();
exports.agentPolicyService = agentPolicyService;

async function addPackageToAgentPolicy(soClient, esClient, packageToInstall, agentPolicy, defaultOutput, packagePolicyName, packagePolicyId, packagePolicyDescription, transformPackagePolicy, bumpAgentPolicyRevison = false) {
  var _agentPolicy$namespac;

  const packageInfo = await (0, _packages.getPackageInfo)({
    savedObjectsClient: soClient,
    pkgName: packageToInstall.name,
    pkgVersion: packageToInstall.version
  });
  const basePackagePolicy = (0, _common.packageToPackagePolicy)(packageInfo, agentPolicy.id, defaultOutput.id, (_agentPolicy$namespac = agentPolicy.namespace) !== null && _agentPolicy$namespac !== void 0 ? _agentPolicy$namespac : 'default', packagePolicyName, packagePolicyDescription);
  const newPackagePolicy = transformPackagePolicy ? transformPackagePolicy(basePackagePolicy) : basePackagePolicy; // If an ID is provided via preconfiguration, use that value. Otherwise fall back to
  // a UUID v5 value seeded from the agent policy's ID and the provided package policy name.

  const id = packagePolicyId ? String(packagePolicyId) : (0, _v2.default)(`${agentPolicy.id}-${packagePolicyName}`, _common.UUID_V5_NAMESPACE);
  await _package_policy.packagePolicyService.create(soClient, esClient, newPackagePolicy, {
    id,
    bumpRevision: bumpAgentPolicyRevison,
    skipEnsureInstalled: true,
    skipUniqueNameVerification: true,
    overwrite: true,
    force: true // To add package to managed policy we need the force flag

  });
}