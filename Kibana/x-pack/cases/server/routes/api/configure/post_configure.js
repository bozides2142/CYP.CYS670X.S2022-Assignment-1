"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initPostCaseConfigure = initPostCaseConfigure;

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


function initPostCaseConfigure({
  router,
  logger
}) {
  router.post({
    path: _constants.CASE_CONFIGURE_URL,
    validate: {
      body: _utils.escapeHatch
    }
  }, async (context, request, response) => {
    try {
      const query = (0, _pipeable.pipe)(_api.CasesConfigureRequestRt.decode(request.body), (0, _Either.fold)((0, _api.throwErrors)(_boom.default.badRequest), _function.identity));
      const client = await context.cases.getCasesClient();
      return response.ok({
        body: await client.configure.create(query)
      });
    } catch (error) {
      logger.error(`Failed to post case configure in route: ${error}`);
      return response.customError((0, _utils.wrapError)(error));
    }
  });
}