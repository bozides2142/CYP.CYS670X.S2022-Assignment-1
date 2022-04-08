"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createActionEventLogRecordObject = createActionEventLogRecordObject;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function createActionEventLogRecordObject(params) {
  const {
    action,
    message,
    task,
    namespace,
    executionId
  } = params;
  const event = { ...(params.timestamp ? {
      '@timestamp': params.timestamp
    } : {}),
    event: {
      action,
      kind: 'action'
    },
    kibana: { ...(executionId ? {
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
        ...(namespace ? {
          namespace
        } : {})
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
    } : {})
  };
  return event;
}