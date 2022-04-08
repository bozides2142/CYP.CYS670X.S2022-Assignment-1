"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllActionRoute = void 0;

var _common = require("../../common");

var _verify_access_and_context = require("./verify_access_and_context");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const rewriteBodyRes = results => {
  return results.map(({
    actionTypeId,
    isPreconfigured,
    referencedByCount,
    isMissingSecrets,
    ...res
  }) => ({ ...res,
    connector_type_id: actionTypeId,
    is_preconfigured: isPreconfigured,
    referenced_by_count: referencedByCount,
    is_missing_secrets: isMissingSecrets
  }));
};

const getAllActionRoute = (router, licenseState) => {
  router.get({
    path: `${_common.BASE_ACTION_API_PATH}/connectors`,
    validate: {}
  }, router.handleLegacyErrors((0, _verify_access_and_context.verifyAccessAndContext)(licenseState, async function (context, req, res) {
    const actionsClient = context.actions.getActionsClient();
    const result = await actionsClient.getAll();
    return res.ok({
      body: rewriteBodyRes(result)
    });
  })));
};

exports.getAllActionRoute = getAllActionRoute;