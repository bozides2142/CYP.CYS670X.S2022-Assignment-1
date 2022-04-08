"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resetPreconfiguredAgentPolicies = resetPreconfiguredAgentPolicies;

var _pMap = _interopRequireDefault(require("p-map"));

var _app_context = require("../app_context");

var _setup = require("../setup");

var _constants = require("../../constants");

var _agent_policy = require("../agent_policy");

var _package_policy = require("../package_policy");

var _agents = require("../agents");

var _api_keys = require("../api_keys");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function resetPreconfiguredAgentPolicies(soClient, esClient, agentPolicyId) {
  const logger = _app_context.appContextService.getLogger();

  logger.warn('Reseting Fleet preconfigured agent policies');
  await _deleteExistingData(soClient, esClient, logger, agentPolicyId);
  await _deleteGhostPackagePolicies(soClient, esClient, logger);
  await _deletePreconfigurationDeleteRecord(soClient, logger, agentPolicyId);
  await (0, _setup.setupFleet)(soClient, esClient);
}
/**
 * Delete all package policies that are not used in any agent policies
 */


async function _deleteGhostPackagePolicies(soClient, esClient, logger) {
  const {
    items: packagePolicies
  } = await _package_policy.packagePolicyService.list(soClient, {
    perPage: _constants.SO_SEARCH_LIMIT
  });
  const policyIds = Array.from(packagePolicies.reduce((acc, packagePolicy) => {
    acc.add(packagePolicy.policy_id);
    return acc;
  }, new Set()));
  const objects = policyIds.map(id => ({
    id,
    type: _constants.AGENT_POLICY_SAVED_OBJECT_TYPE
  }));
  const agentPolicyExistsMap = (await soClient.bulkGet(objects)).saved_objects.reduce((acc, so) => {
    if (so.error && so.error.statusCode === 404) {
      acc.set(so.id, false);
    } else {
      acc.set(so.id, true);
    }

    return acc;
  }, new Map());
  await (0, _pMap.default)(packagePolicies, packagePolicy => {
    if (agentPolicyExistsMap.get(packagePolicy.policy_id) === false) {
      logger.info(`Deleting ghost package policy ${packagePolicy.name} (${packagePolicy.id})`);
      return soClient.delete(_constants.PACKAGE_POLICY_SAVED_OBJECT_TYPE, packagePolicy.id);
    }
  }, {
    concurrency: 20
  });
}

async function _deletePreconfigurationDeleteRecord(soClient, logger, agentPolicyId) {
  const existingDeletionRecord = await soClient.find({
    type: _constants.PRECONFIGURATION_DELETION_RECORD_SAVED_OBJECT_TYPE,
    perPage: _constants.SO_SEARCH_LIMIT
  });
  const deletionRecordSavedObjects = agentPolicyId ? existingDeletionRecord.saved_objects.filter(so => so.attributes.id === agentPolicyId) : existingDeletionRecord.saved_objects;

  if (deletionRecordSavedObjects.length > 0) {
    await (0, _pMap.default)(deletionRecordSavedObjects, savedObject => soClient.delete(_constants.PRECONFIGURATION_DELETION_RECORD_SAVED_OBJECT_TYPE, savedObject.id).catch(err => {
      if (soClient.errors.isNotFoundError(err)) {
        return undefined;
      }

      throw err;
    }), {
      concurrency: 20
    });
  }
}

async function _deleteExistingData(soClient, esClient, logger, agentPolicyId) {
  let existingPolicies = [];

  if (agentPolicyId) {
    const policy = await _agent_policy.agentPolicyService.get(soClient, agentPolicyId).catch(err => {
      var _err$output;

      if (((_err$output = err.output) === null || _err$output === void 0 ? void 0 : _err$output.statusCode) === 404) {
        return undefined;
      }

      throw err;
    });

    if (policy && !policy.is_preconfigured) {
      throw new Error('Invalid policy');
    }

    if (policy) {
      existingPolicies = [policy];
    }
  } else {
    existingPolicies = (await _agent_policy.agentPolicyService.list(soClient, {
      perPage: _constants.SO_SEARCH_LIMIT,
      kuery: `${_constants.AGENT_POLICY_SAVED_OBJECT_TYPE}.is_preconfigured:true`
    })).items;
  } // unenroll all the agents enroled in this policies


  const {
    agents
  } = await (0, _agents.getAgentsByKuery)(esClient, {
    showInactive: false,
    perPage: _constants.SO_SEARCH_LIMIT,
    kuery: existingPolicies.map(policy => `policy_id:"${policy.id}"`).join(' or ')
  }); // Delete

  if (agents.length > 0) {
    logger.info(`Force unenrolling ${agents.length} agents`);
    await (0, _pMap.default)(agents, agent => (0, _agents.forceUnenrollAgent)(soClient, esClient, agent.id), {
      concurrency: 20
    });
  }

  const {
    items: enrollmentApiKeys
  } = await (0, _api_keys.listEnrollmentApiKeys)(esClient, {
    perPage: _constants.SO_SEARCH_LIMIT,
    showInactive: true,
    kuery: existingPolicies.map(policy => `policy_id:"${policy.id}"`).join(' or ')
  });

  if (enrollmentApiKeys.length > 0) {
    logger.info(`Deleting ${enrollmentApiKeys.length} enrollment api keys`);
    await (0, _pMap.default)(enrollmentApiKeys, enrollmentKey => (0, _api_keys.deleteEnrollmentApiKey)(esClient, enrollmentKey.id, true), {
      concurrency: 20
    });
  }

  if (existingPolicies.length > 0) {
    logger.info(`Deleting ${existingPolicies.length} agent policies`);
    await (0, _pMap.default)(existingPolicies, policy => _agent_policy.agentPolicyService.delete(soClient, esClient, policy.id, {
      force: true,
      removeFleetServerDocuments: true
    }), {
      concurrency: 20
    });
  }
}