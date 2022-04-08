"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deletePackRoute = void 0;

var _lodash = require("lodash");

var _immer = require("immer");

var _configSchema = require("@kbn/config-schema");

var _common = require("../../../../fleet/common");

var _common2 = require("../../../common");

var _types = require("../../../common/types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const deletePackRoute = (router, osqueryContext) => {
  router.delete({
    path: '/internal/osquery/packs/{id}',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      })
    },
    options: {
      tags: [`access:${_common2.PLUGIN_ID}-writePacks`]
    }
  }, async (context, request, response) => {
    var _await$packagePolicyS;

    const esClient = context.core.elasticsearch.client.asCurrentUser;
    const savedObjectsClient = context.core.savedObjects.client;
    const packagePolicyService = osqueryContext.service.getPackagePolicyService();
    const currentPackSO = await savedObjectsClient.get(_types.packSavedObjectType, request.params.id);
    await savedObjectsClient.delete(_types.packSavedObjectType, request.params.id, {
      refresh: 'wait_for'
    });
    const {
      items: packagePolicies
    } = (_await$packagePolicyS = await (packagePolicyService === null || packagePolicyService === void 0 ? void 0 : packagePolicyService.list(savedObjectsClient, {
      kuery: `${_common.PACKAGE_POLICY_SAVED_OBJECT_TYPE}.package.name:${_common2.OSQUERY_INTEGRATION_NAME}`,
      perPage: 1000,
      page: 1
    }))) !== null && _await$packagePolicyS !== void 0 ? _await$packagePolicyS : {
      items: []
    };
    const currentPackagePolicies = (0, _lodash.filter)(packagePolicies, packagePolicy => (0, _lodash.has)(packagePolicy, `inputs[0].config.osquery.value.packs.${currentPackSO.attributes.name}`));
    await Promise.all(currentPackagePolicies.map(packagePolicy => packagePolicyService === null || packagePolicyService === void 0 ? void 0 : packagePolicyService.update(savedObjectsClient, esClient, packagePolicy.id, (0, _immer.produce)(packagePolicy, draft => {
      (0, _lodash.unset)(draft, 'id');
      (0, _lodash.unset)(draft, `inputs[0].config.osquery.value.packs.${[currentPackSO.attributes.name]}`);
      return draft;
    }))));
    return response.ok({
      body: {}
    });
  });
};

exports.deletePackRoute = deletePackRoute;