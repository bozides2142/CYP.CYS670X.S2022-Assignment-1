"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseAgentSelection = void 0;

var _lodash = require("lodash");

var _common = require("../../../fleet/common");

var _common2 = require("../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const PER_PAGE = 9000;

const aggregateResults = async generator => {
  const {
    results,
    total
  } = await generator(1, PER_PAGE);
  const totalPages = Math.ceil(total / PER_PAGE);
  let currPage = 2;

  while (currPage <= totalPages) {
    const {
      results: additionalResults
    } = await generator(currPage++, PER_PAGE);
    results.push(...additionalResults);
  }

  return (0, _lodash.uniq)(results);
};

const parseAgentSelection = async (soClient, context, agentSelection) => {
  var _context$service$getA;

  const selectedAgents = new Set();
  const addAgent = selectedAgents.add.bind(selectedAgents);
  const {
    allAgentsSelected,
    platformsSelected,
    policiesSelected,
    agents
  } = agentSelection;
  const agentService = (_context$service$getA = context.service.getAgentService()) === null || _context$service$getA === void 0 ? void 0 : _context$service$getA.asInternalUser;
  const packagePolicyService = context.service.getPackagePolicyService();
  const kueryFragments = [];

  if (agentService && packagePolicyService) {
    const osqueryPolicies = await aggregateResults(async (page, perPage) => {
      const {
        items,
        total
      } = await packagePolicyService.list(soClient, {
        kuery: `${_common.PACKAGE_POLICY_SAVED_OBJECT_TYPE}.package.name:${_common2.OSQUERY_INTEGRATION_NAME}`,
        perPage,
        page
      });
      return {
        results: items.map(it => it.policy_id),
        total
      };
    });
    kueryFragments.push(`policy_id:(${(0, _lodash.uniq)(osqueryPolicies).join(' or ')})`);

    if (allAgentsSelected) {
      const kuery = kueryFragments.join(' and ');
      const fetchedAgents = await aggregateResults(async (page, perPage) => {
        const res = await agentService.listAgents({
          perPage,
          page,
          kuery,
          showInactive: false
        });
        return {
          results: res.agents.map(agent => agent.id),
          total: res.total
        };
      });
      fetchedAgents.forEach(addAgent);
    } else {
      if (platformsSelected.length > 0 || policiesSelected.length > 0) {
        const groupFragments = [];

        if (platformsSelected.length) {
          groupFragments.push(`local_metadata.os.platform:(${platformsSelected.join(' or ')})`);
        }

        if (policiesSelected.length) {
          groupFragments.push(`policy_id:(${policiesSelected.join(' or ')})`);
        }

        kueryFragments.push(`(${groupFragments.join(' or ')})`);
        const kuery = kueryFragments.join(' and ');
        const fetchedAgents = await aggregateResults(async (page, perPage) => {
          const res = await agentService.listAgents({
            perPage,
            page,
            kuery,
            showInactive: false
          });
          return {
            results: res.agents.map(agent => agent.id),
            total: res.total
          };
        });
        fetchedAgents.forEach(addAgent);
      }
    }
  }

  agents.forEach(addAgent);
  return Array.from(selectedAgents);
};

exports.parseAgentSelection = parseAgentSelection;