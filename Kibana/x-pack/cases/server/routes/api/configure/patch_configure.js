"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initPatchCaseConfigure = initPatchCaseConfigure;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _pipeable = require("fp-ts/lib/pipeable");

var _Either = require("fp-ts/lib/Either");

var _function = require("fp-ts/lib/function");

var _api = require("../../../../common/api");

var _constants = require("../../../../common/constants");

var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function initPatchCaseConfigure({
  router,
  logger
}) {
  router.patch({
    path: _constants.CASE_CONFIGURE_DETAILS_URL,
    validate: {
      params: _utils.escapeHatch,
      body: _utils.escapeHatch
    }
  }, async (context, request, response) => {
    try {
      const params = (0, _pipeable.pipe)((0, _api.excess)(_api.CaseConfigureRequestParamsRt).decode(request.params), (0, _Either.fold)((0, _api.throwErrors)(_boom.default.badRequest), _function.identity));
      const client = await context.cases.getCasesClient();
      const configuration = request.body;
      return response.ok({
        body: await client.configure.update(params.configuration_id, configuration)
      });
    } catch (error) {
      logger.error(`Failed to get patch configure in route: ${error}`);
      return response.customError((0, _utils.wrapError)(error));
    }
  });
}