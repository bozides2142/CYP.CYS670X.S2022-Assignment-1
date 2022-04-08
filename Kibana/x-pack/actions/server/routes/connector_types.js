"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connectorTypesRoute = void 0;

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
    enabledInConfig,
    enabledInLicense,
    minimumLicenseRequired,
    ...res
  }) => ({ ...res,
    enabled_in_config: enabledInConfig,
    enabled_in_license: enabledInLicense,
    minimum_license_required: minimumLicenseRequired
  }));
};

const connectorTypesRoute = (router, licenseState) => {
  router.get({
    path: `${_common.BASE_ACTION_API_PATH}/connector_types`,
    validate: {}
  }, router.handleLegacyErrors((0, _verify_access_and_context.verifyAccessAndContext)(licenseState, async function (context, req, res) {
    const actionsClient = context.actions.getActionsClient();
    return res.ok({
      body: rewriteBodyRes(await actionsClient.listTypes())
    });
  })));
};

exports.connectorTypesRoute = connectorTypesRoute;