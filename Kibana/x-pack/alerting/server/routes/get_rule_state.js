"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRuleStateRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _lib = require("./lib");

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

const rewriteBodyRes = ({
  alertTypeState,
  alertInstances,
  previousStartedAt,
  ...rest
}) => ({ ...rest,
  rule_type_state: alertTypeState,
  alerts: alertInstances,
  previous_started_at: previousStartedAt
});

const getRuleStateRoute = (router, licenseState) => {
  router.get({
    path: `${_types.INTERNAL_BASE_ALERTING_API_PATH}/rule/{id}/state`,
    validate: {
      params: paramSchema
    }
  }, router.handleLegacyErrors((0, _lib.verifyAccessAndContext)(licenseState, async function (context, req, res) {
    const rulesClient = context.alerting.getRulesClient();
    const {
      id
    } = req.params;
    const state = await rulesClient.getAlertState({
      id
    });
    return state ? res.ok({
      body: rewriteBodyRes(state)
    }) : res.noContent();
  })));
};

exports.getRuleStateRoute = getRuleStateRoute;