"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAgentPoliciesRoute = void 0;

var _pMap = _interopRequireDefault(require("p-map"));

var _configSchema = require("@kbn/config-schema");

var _lodash = require("lodash");

var _semver = require("semver");

var _common = require("../../../../fleet/common");

var _common2 = require("../../../common");

var _collector = require("../../usage/collector");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getAgentPoliciesRoute = (router, osqueryContext) => {
  router.get({
    path: '/internal/osquery/fleet_wrapper/agent_policies',
    validate: {
      params: _configSchema.schema.object({}, {
        unknowns: 'allow'
      }),
      query: _configSchema.schema.object({}, {
        unknowns: 'allow'
      })
    },
    options: {
      tags: [`access:${_common2.PLUGIN_ID}-read`]
    }
  }, async (context, request, response) => {
    var _await$packagePolicyS;

    const internalSavedObjectsClient = await (0, _collector.getInternalSavedObjectsClient)(osqueryContext.getStartServices);
    const agentService = osqueryContext.service.getAgentService();
    const agentPolicyService = osqueryContext.service.getAgentPolicyService();
    const packagePolicyService = osqueryContext.service.getPackagePolicyService();
    const {
      items: packagePolicies
    } = (_await$packagePolicyS = await (packagePolicyService === null || packagePolicyService === void 0 ? void 0 : packagePolicyService.list(internalSavedObjectsClient, {
      kuery: `${_common.PACKAGE_POLICY_SAVED_OBJECT_TYPE}.package.name:${_common2.OSQUERY_INTEGRATION_NAME}`,
      perPage: 1000,
      page: 1
    }))) !== null && _await$packagePolicyS !== void 0 ? _await$packagePolicyS : {
      items: []
    };
    const supportedPackagePolicyIds = (0, _lodash.filter)(packagePolicies, packagePolicy => {
      var _packagePolicy$packag, _packagePolicy$packag2;

      return (0, _semver.satisfies)((_packagePolicy$packag = (_packagePolicy$packag2 = packagePolicy.package) === null || _packagePolicy$packag2 === void 0 ? void 0 : _packagePolicy$packag2.version) !== null && _packagePolicy$packag !== void 0 ? _packagePolicy$packag : '', '>=0.6.0');
    });
    const agentPolicyIds = (0, _lodash.uniq)((0, _lodash.map)(supportedPackagePolicyIds, 'policy_id'));
    const agentPolicies = await (agentPolicyService === null || agentPolicyService === void 0 ? void 0 : agentPolicyService.getByIds(internalSavedObjectsClient, agentPolicyIds));

    if (agentPolicies !== null && agentPolicies !== void 0 && agentPolicies.length) {
      await (0, _pMap.default)(agentPolicies, agentPolicy => agentService === null || agentService === void 0 ? void 0 : agentService.asInternalUser.getAgentStatusForAgentPolicy(agentPolicy.id).then(({
        total: agentTotal
      }) => agentPolicy.agents = agentTotal), {
        concurrency: 10
      });
    }

    return response.ok({
      body: agentPolicies
    });
  });
};

exports.getAgentPoliciesRoute = getAgentPoliciesRoute;