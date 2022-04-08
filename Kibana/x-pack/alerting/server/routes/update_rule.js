"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateRuleRoute = void 0;

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

const bodySchema = _configSchema.schema.object({
  name: _configSchema.schema.string(),
  tags: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
    defaultValue: []
  }),
  schedule: _configSchema.schema.object({
    interval: _configSchema.schema.string({
      validate: _lib.validateDurationSchema
    })
  }),
  throttle: _configSchema.schema.nullable(_configSchema.schema.string({
    validate: _lib.validateDurationSchema
  })),
  params: _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.any(), {
    defaultValue: {}
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

const rewriteBodyReq = result => {
  const {
    notify_when: notifyWhen,
    ...rest
  } = result.data;
  return { ...result,
    data: { ...rest,
      notifyWhen
    }
  };
};

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
  executionStatus,
  ...rest
}) => ({ ...rest,
  api_key_owner: apiKeyOwner,
  created_by: createdBy,
  updated_by: updatedBy,
  ...(alertTypeId ? {
    rule_type_id: alertTypeId
  } : {}),
  ...(scheduledTaskId ? {
    scheduled_task_id: scheduledTaskId
  } : {}),
  ...(createdAt ? {
    created_at: createdAt
  } : {}),
  ...(updatedAt ? {
    updated_at: updatedAt
  } : {}),
  ...(notifyWhen ? {
    notify_when: notifyWhen
  } : {}),
  ...(muteAll !== undefined ? {
    mute_all: muteAll
  } : {}),
  ...(mutedInstanceIds ? {
    muted_alert_ids: mutedInstanceIds
  } : {}),
  ...(executionStatus ? {
    execution_status: {
      status: executionStatus.status,
      last_execution_date: executionStatus.lastExecutionDate,
      last_duration: executionStatus.lastDuration
    }
  } : {}),
  ...(actions ? {
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
  } : {})
});

const updateRuleRoute = (router, licenseState) => {
  router.put({
    path: `${_types.BASE_ALERTING_API_PATH}/rule/{id}`,
    validate: {
      body: bodySchema,
      params: paramSchema
    }
  }, (0, _lib2.handleDisabledApiKeysError)(router.handleLegacyErrors((0, _lib2.verifyAccessAndContext)(licenseState, async function (context, req, res) {
    const rulesClient = context.alerting.getRulesClient();
    const {
      id
    } = req.params;
    const rule = req.body;

    try {
      const alertRes = await rulesClient.update(rewriteBodyReq({
        id,
        data: { ...rule,
          notify_when: rule.notify_when
        }
      }));
      return res.ok({
        body: rewriteBodyRes(alertRes)
      });
    } catch (e) {
      if (e instanceof _lib.AlertTypeDisabledError) {
        return e.sendResponse(res);
      }

      throw e;
    }
  }))));
};

exports.updateRuleRoute = updateRuleRoute;