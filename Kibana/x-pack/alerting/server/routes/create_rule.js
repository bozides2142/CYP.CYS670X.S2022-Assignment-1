"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRuleRoute = exports.bodySchema = void 0;

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


const bodySchema = _configSchema.schema.object({
  name: _configSchema.schema.string(),
  rule_type_id: _configSchema.schema.string(),
  enabled: _configSchema.schema.boolean({
    defaultValue: true
  }),
  consumer: _configSchema.schema.string(),
  tags: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
    defaultValue: []
  }),
  throttle: _configSchema.schema.nullable(_configSchema.schema.string({
    validate: _lib.validateDurationSchema
  })),
  params: _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.any(), {
    defaultValue: {}
  }),
  schedule: _configSchema.schema.object({
    interval: _configSchema.schema.string({
      validate: _lib.validateDurationSchema
    })
  }),
  actions: _configSchema.schema.arrayOf(_configSchema.schema.object({
    group: _configSchema.schema.string(),
    id: _configSchema.schema.string(),
    params: _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.any(), {
      defaultValue: {}
    })
  }), {
    defaultValue: []
  }),
  notify_when: _configSchema.schema.string({
    validate: _types.validateNotifyWhenType
  })
});

exports.bodySchema = bodySchema;

const rewriteBodyReq = ({
  rule_type_id: alertTypeId,
  notify_when: notifyWhen,
  ...rest
}) => ({ ...rest,
  alertTypeId,
  notifyWhen
});

const rewriteBodyRes = ({
  actions,
  alertTypeId,
  scheduledTaskId,
  createdBy,
  updatedBy,
  createdAt,
  updatedAt,
  apiKeyOwner,
  notifyWhen,
  muteAll,
  mutedInstanceIds,
  executionStatus: {
    lastExecutionDate,
    lastDuration,
    ...executionStatus
  },
  ...rest
}) => ({ ...rest,
  rule_type_id: alertTypeId,
  scheduled_task_id: scheduledTaskId,
  created_by: createdBy,
  updated_by: updatedBy,
  created_at: createdAt,
  updated_at: updatedAt,
  api_key_owner: apiKeyOwner,
  notify_when: notifyWhen,
  mute_all: muteAll,
  muted_alert_ids: mutedInstanceIds,
  execution_status: { ...executionStatus,
    last_execution_date: lastExecutionDate,
    last_duration: lastDuration
  },
  actions: actions.map(({
    group,
    id,
    actionTypeId,
    params
  }) => ({
    group,
    id,
    params,
    connector_type_id: actionTypeId
  }))
});

const createRuleRoute = ({
  router,
  licenseState,
  usageCounter
}) => {
  router.post({
    path: `${_types.BASE_ALERTING_API_PATH}/rule/{id?}`,
    validate: {
      params: _configSchema.schema.maybe(_configSchema.schema.object({
        id: _configSchema.schema.maybe(_configSchema.schema.string())
      })),
      body: bodySchema
    }
  }, (0, _lib2.handleDisabledApiKeysError)(router.handleLegacyErrors((0, _lib2.verifyAccessAndContext)(licenseState, async function (context, req, res) {
    const rulesClient = context.alerting.getRulesClient();
    const rule = req.body;
    const params = req.params;
    (0, _lib2.countUsageOfPredefinedIds)({
      predefinedId: params === null || params === void 0 ? void 0 : params.id,
      spaceId: rulesClient.getSpaceId(),
      usageCounter
    });

    try {
      const createdRule = await rulesClient.create({
        data: rewriteBodyReq({ ...rule,
          notify_when: rule.notify_when
        }),
        options: {
          id: params === null || params === void 0 ? void 0 : params.id
        }
      });
      return res.ok({
        body: rewriteBodyRes(createdRule)
      });
    } catch (e) {
      if (e instanceof _lib.AlertTypeDisabledError) {
        return e.sendResponse(res);
      }

      throw e;
    }
  }))));
};

exports.createRuleRoute = createRuleRoute;