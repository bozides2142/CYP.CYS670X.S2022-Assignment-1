"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPackRoute = void 0;

var _momentTimezone = _interopRequireDefault(require("moment-timezone"));

var _lodash = require("lodash");

var _configSchema = require("@kbn/config-schema");

var _immer = require("immer");

var _common = require("../../../../fleet/common");

var _common2 = require("../../../common");

var _types = require("../../../common/types");

var _utils = require("./utils");

var _collector = require("../../usage/collector");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createPackRoute = (router, osqueryContext) => {
  router.post({
    path: '/internal/osquery/packs',
    validate: {
      body: _configSchema.schema.object({
        name: _configSchema.schema.string(),
        description: _configSchema.schema.maybe(_configSchema.schema.string()),
        enabled: _configSchema.schema.maybe(_configSchema.schema.boolean()),
        policy_ids: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
        queries: _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.object({
          query: _configSchema.schema.string(),
          interval: _configSchema.schema.maybe(_configSchema.schema.number()),
          platform: _configSchema.schema.maybe(_configSchema.schema.string()),
          version: _configSchema.schema.maybe(_configSchema.schema.string()),
          ecs_mapping: _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.object({
            field: _configSchema.schema.maybe(_configSchema.schema.string()),
            value: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.arrayOf(_configSchema.schema.string())]))
          })))
        }))
      }, {
        unknowns: 'allow'
      })
    },
    options: {
      tags: [`access:${_common2.PLUGIN_ID}-writePacks`]
    }
  }, async (context, request, response) => {
    var _osqueryContext$secur, _await$packagePolicyS;

    const esClient = context.core.elasticsearch.client.asCurrentUser;
    const savedObjectsClient = context.core.savedObjects.client;
    const internalSavedObjectsClient = await (0, _collector.getInternalSavedObjectsClient)(osqueryContext.getStartServices);
    const agentPolicyService = osqueryContext.service.getAgentPolicyService();
    const packagePolicyService = osqueryContext.service.getPackagePolicyService();
    const currentUser = await ((_osqueryContext$secur = osqueryContext.security.authc.getCurrentUser(request)) === null || _osqueryContext$secur === void 0 ? void 0 : _osqueryContext$secur.username); // eslint-disable-next-line @typescript-eslint/naming-convention

    const {
      name,
      description,
      queries,
      enabled,
      policy_ids
    } = request.body;
    const conflictingEntries = await savedObjectsClient.find({
      type: _types.packSavedObjectType,
      filter: `${_types.packSavedObjectType}.attributes.name: "${name}"`
    });

    if (conflictingEntries.saved_objects.length) {
      return response.conflict({
        body: `Pack with name "${name}" already exists.`
      });
    }

    const {
      items: packagePolicies
    } = (_await$packagePolicyS = await (packagePolicyService === null || packagePolicyService === void 0 ? void 0 : packagePolicyService.list(internalSavedObjectsClient, {
      kuery: `${_common.PACKAGE_POLICY_SAVED_OBJECT_TYPE}.package.name:${_common2.OSQUERY_INTEGRATION_NAME}`,
      perPage: 1000,
      page: 1
    }))) !== null && _await$packagePolicyS !== void 0 ? _await$packagePolicyS : {
      items: []
    };
    const agentPolicies = policy_ids ? (0, _lodash.mapKeys)(await (agentPolicyService === null || agentPolicyService === void 0 ? void 0 : agentPolicyService.getByIds(internalSavedObjectsClient, policy_ids)), 'id') : {};
    const references = policy_ids ? policy_ids.map(policyId => ({
      id: policyId,
      name: agentPolicies[policyId].name,
      type: _common.AGENT_POLICY_SAVED_OBJECT_TYPE
    })) : [];
    const packSO = await savedObjectsClient.create(_types.packSavedObjectType, {
      name,
      description,
      queries: (0, _utils.convertPackQueriesToSO)(queries),
      enabled,
      created_at: (0, _momentTimezone.default)().toISOString(),
      created_by: currentUser,
      updated_at: (0, _momentTimezone.default)().toISOString(),
      updated_by: currentUser
    }, {
      references,
      refresh: 'wait_for'
    });

    if (enabled && policy_ids !== null && policy_ids !== void 0 && policy_ids.length) {
      await Promise.all(policy_ids.map(agentPolicyId => {
        const packagePolicy = (0, _lodash.find)(packagePolicies, ['policy_id', agentPolicyId]);

        if (packagePolicy) {
          return packagePolicyService === null || packagePolicyService === void 0 ? void 0 : packagePolicyService.update(internalSavedObjectsClient, esClient, packagePolicy.id, (0, _immer.produce)(packagePolicy, draft => {
            (0, _lodash.unset)(draft, 'id');

            if (!(0, _lodash.has)(draft, 'inputs[0].streams')) {
              (0, _lodash.set)(draft, 'inputs[0].streams', []);
            }

            (0, _lodash.set)(draft, `inputs[0].config.osquery.value.packs.${packSO.attributes.name}`, {
              queries
            });
            return draft;
          }));
        }
      }));
    } // @ts-expect-error update types


    packSO.attributes.queries = queries;
    return response.ok({
      body: packSO
    });
  });
};

exports.createPackRoute = createPackRoute;