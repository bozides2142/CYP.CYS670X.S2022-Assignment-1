"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRuleAlertSummaryRoute = void 0;

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

const querySchema = _configSchema.schema.object({
  date_start: _configSchema.schema.maybe(_configSchema.schema.string()),
  number_of_executions: _configSchema.schema.maybe(_configSchema.schema.number())
});

const rewriteReq = ({
  date_start: dateStart,
  number_of_executions: numberOfExecutions,
  ...rest
}) => ({ ...rest,
  numberOfExecutions,
  dateStart
});

const rewriteBodyRes = ({
  ruleTypeId,
  muteAll,
  statusStartDate,
  statusEndDate,
  errorMessages,
  lastRun,
  executionDuration: {
    valuesWithTimestamp,
    ...executionDuration
  },
  ...rest
}) => ({ ...rest,
  rule_type_id: ruleTypeId,
  mute_all: muteAll,
  status_start_date: statusStartDate,
  status_end_date: statusEndDate,
  error_messages: errorMessages,
  last_run: lastRun,
  execution_duration: { ...executionDuration,
    values_with_timestamp: valuesWithTimestamp
  }
});

const getRuleAlertSummaryRoute = (router, licenseState) => {
  router.get({
    path: `${_types.INTERNAL_BASE_ALERTING_API_PATH}/rule/{id}/_alert_summary`,
    validate: {
      params: paramSchema,
      query: querySchema
    }
  }, router.handleLegacyErrors((0, _lib.verifyAccessAndContext)(licenseState, async function (context, req, res) {
    const rulesClient = context.alerting.getRulesClient();
    const {
      id
    } = req.params;
    const summary = await rulesClient.getAlertSummary(rewriteReq({
      id,
      ...req.query
    }));
    return res.ok({
      body: rewriteBodyRes(summary)
    });
  })));
};

exports.getRuleAlertSummaryRoute = getRuleAlertSummaryRoute;