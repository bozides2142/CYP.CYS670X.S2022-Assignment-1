"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAlertEventLogRecordObject = createAlertEventLogRecordObject;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function createAlertEventLogRecordObject(params) {
  const {
    executionId,
    ruleType,
    action,
    state,
    message,
    task,
    ruleId,
    group,
    subgroup,
    namespace
  } = params;
  const alerting = params.instanceId || group || subgroup ? {
    alerting: { ...(params.instanceId ? {
        instance_id: params.instanceId
      } : {}),
      ...(group ? {
        action_group_id: group
      } : {}),
      ...(subgroup ? {
        action_subgroup: subgroup
      } : {})
    }
  } : undefined;
  const event = { ...(params.timestamp ? {
      '@timestamp': params.timestamp
    } : {}),
    event: {
      action,
      kind: 'alert',
      category: [ruleType.producer],
      ...(state !== null && state !== void 0 && state.start ? {
        start: state.start
      } : {}),
      ...(state !== null && state !== void 0 && state.end ? {
        end: state.end
      } : {}),
      ...((state === null || state === void 0 ? void 0 : state.duration) !== undefined ? {
        duration: state.duration
      } : {})
    },
    kibana: { ...(alerting ? alerting : {}),
      ...(executionId ? {
        alert: {
          rule: {
            execution: {
              uuid: executionId
            }
          }
        }
      } : {}),
      saved_objects: params.savedObjects.map(so => ({ ...(so.relation ? {
          rel: so.relation
        } : {}),
        type: so.type,
        id: so.id,
        type_id: so.typeId,
        namespace
      })),
      ...(task ? {
        task: {
          scheduled: task.scheduled,
          schedule_delay: task.scheduleDelay
        }
      } : {})
    },
    ...(message ? {
      message
    } : {}),
    rule: {
      id: ruleId,
      license: ruleType.minimumLicenseRequired,
      category: ruleType.id,
      ruleset: ruleType.producer,
      ...(params.ruleName ? {
        name: params.ruleName
      } : {})
    }
  };
  return event;
}