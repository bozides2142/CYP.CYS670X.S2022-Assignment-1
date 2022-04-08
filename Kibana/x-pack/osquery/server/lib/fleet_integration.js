"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPackagePolicyDeleteCallback = void 0;

var _lodash = require("lodash");

var _types = require("../../common/types");

var _common = require("../../../fleet/common");

var _common2 = require("../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getPackagePolicyDeleteCallback = packsClient => async deletedPackagePolicy => {
  const deletedOsqueryManagerPolicies = (0, _lodash.filter)(deletedPackagePolicy, ['package.name', _common2.OSQUERY_INTEGRATION_NAME]);
  await Promise.all((0, _lodash.map)(deletedOsqueryManagerPolicies, async deletedOsqueryManagerPolicy => {
    if (deletedOsqueryManagerPolicy.policy_id) {
      const foundPacks = await packsClient.find({
        type: _types.packSavedObjectType,
        hasReference: {
          type: _common.AGENT_POLICY_SAVED_OBJECT_TYPE,
          id: deletedOsqueryManagerPolicy.policy_id
        },
        perPage: 1000
      });
      await Promise.all((0, _lodash.map)(foundPacks.saved_objects, pack => packsClient.update(_types.packSavedObjectType, pack.id, {}, {
        references: (0, _lodash.filter)(pack.references, reference => reference.id !== deletedOsqueryManagerPolicy.policy_id)
      })));
    }
  }));
};

exports.getPackagePolicyDeleteCallback = getPackagePolicyDeleteCallback;