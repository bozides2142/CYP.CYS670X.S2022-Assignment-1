"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unmuteAllRuleRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _lib = require("../lib");

var _lib2 = require("./lib");

var _types = require("../types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const paramSchema = _configSchema.schema.object({
  id: _configSchema.schema.string()
});

const unmuteAllRuleRoute = (router, licenseState) => {
  router.post({
    path: `${_types.BASE_ALERTING_API_PATH}/rule/{id}/_unmute_all`,
    validate: {
      params: paramSchema
    }
  }, router.handleLegacyErrors((0, _lib2.verifyAccessAndContext)(licenseState, async function (context, req, res) {
    const rulesClient = context.alerting.getRulesClient();
    const {
      id
    } = req.params;

    try {
      await rulesClient.unmuteAll({
        id
      });
      return res.noContent();
    } catch (e) {
      if (e instanceof _lib.AlertTypeDisabledError) {
        return e.sendResponse(res);
      }

      throw e;
    }
  })));
};

exports.unmuteAllRuleRoute = unmuteAllRuleRoute;