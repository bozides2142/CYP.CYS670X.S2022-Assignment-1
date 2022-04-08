"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  DATABASE_CATEGORY: true,
  ECS_OUTCOMES: true,
  isWriteOperation: true,
  Operations: true
};
exports.Operations = exports.ECS_OUTCOMES = exports.DATABASE_CATEGORY = void 0;
exports.isWriteOperation = isWriteOperation;

var _constants = require("../../common/constants");

var _types = require("./types");

Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});

var _authorization = require("./authorization");

Object.keys(_authorization).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _authorization[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _authorization[key];
    }
  });
});

var _audit_logger = require("./audit_logger");

Object.keys(_audit_logger).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _audit_logger[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _audit_logger[key];
    }
  });
});
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createVerbs = {
  present: 'create',
  progressive: 'creating',
  past: 'created'
};
const accessVerbs = {
  present: 'access',
  progressive: 'accessing',
  past: 'accessed'
};
const updateVerbs = {
  present: 'update',
  progressive: 'updating',
  past: 'updated'
};
const deleteVerbs = {
  present: 'delete',
  progressive: 'deleting',
  past: 'deleted'
};
const EVENT_TYPES = {
  creation: 'creation',
  deletion: 'deletion',
  change: 'change',
  access: 'access'
};
/**
 * These values need to match the respective values in this file: x-pack/plugins/security/server/authorization/privileges/feature_privilege_builder/cases.ts
 * These are shared between find, get, get all, and delete/delete all
 * There currently isn't a use case for a user to delete one comment but not all or differentiating between get, get all,
 * and find operations from a privilege stand point.
 */

const DELETE_COMMENT_OPERATION = 'deleteComment';
const ACCESS_COMMENT_OPERATION = 'getComment';
const ACCESS_CASE_OPERATION = 'getCase';
const ACCESS_USER_ACTION_OPERATION = 'getUserActions';
/**
 * Database constant for ECS category for use for audit logging.
 */

const DATABASE_CATEGORY = ['database'];
/**
 * ECS Outcomes for audit logging.
 */

exports.DATABASE_CATEGORY = DATABASE_CATEGORY;
const ECS_OUTCOMES = {
  failure: 'failure',
  success: 'success',
  unknown: 'unknown'
};
/**
 * Determines if the passed in operation was a write operation.
 *
 * @param operation an OperationDetails object describing the operation that occurred
 * @returns true if the passed in operation was a write operation
 */

exports.ECS_OUTCOMES = ECS_OUTCOMES;

function isWriteOperation(operation) {
  return Object.values(_types.WriteOperations).includes(operation.name);
}

const CaseOperations = {
  [_types.ReadOperations.GetCase]: {
    ecsType: EVENT_TYPES.access,
    name: ACCESS_CASE_OPERATION,
    action: 'case_get',
    verbs: accessVerbs,
    docType: 'case',
    savedObjectType: _constants.CASE_SAVED_OBJECT
  },
  [_types.ReadOperations.ResolveCase]: {
    ecsType: EVENT_TYPES.access,
    name: ACCESS_CASE_OPERATION,
    action: 'case_resolve',
    verbs: accessVerbs,
    docType: 'case',
    savedObjectType: _constants.CASE_SAVED_OBJECT
  },
  [_types.ReadOperations.FindCases]: {
    ecsType: EVENT_TYPES.access,
    name: ACCESS_CASE_OPERATION,
    action: 'case_find',
    verbs: accessVerbs,
    docType: 'cases',
    savedObjectType: _constants.CASE_SAVED_OBJECT
  },
  [_types.ReadOperations.GetCaseIDsByAlertID]: {
    ecsType: EVENT_TYPES.access,
    name: ACCESS_CASE_OPERATION,
    action: 'case_ids_by_alert_id_get',
    verbs: accessVerbs,
    docType: 'cases',
    savedObjectType: _constants.CASE_COMMENT_SAVED_OBJECT
  },
  [_types.ReadOperations.GetCaseMetrics]: {
    ecsType: EVENT_TYPES.access,
    name: ACCESS_CASE_OPERATION,
    action: 'case_get_metrics',
    verbs: accessVerbs,
    docType: 'case',
    savedObjectType: _constants.CASE_SAVED_OBJECT
  },
  [_types.WriteOperations.CreateCase]: {
    ecsType: EVENT_TYPES.creation,
    name: _types.WriteOperations.CreateCase,
    action: 'case_create',
    verbs: createVerbs,
    docType: 'case',
    savedObjectType: _constants.CASE_SAVED_OBJECT
  },
  [_types.WriteOperations.DeleteCase]: {
    ecsType: EVENT_TYPES.deletion,
    name: _types.WriteOperations.DeleteCase,
    action: 'case_delete',
    verbs: deleteVerbs,
    docType: 'case',
    savedObjectType: _constants.CASE_SAVED_OBJECT
  },
  [_types.WriteOperations.UpdateCase]: {
    ecsType: EVENT_TYPES.change,
    name: _types.WriteOperations.UpdateCase,
    action: 'case_update',
    verbs: updateVerbs,
    docType: 'case',
    savedObjectType: _constants.CASE_SAVED_OBJECT
  },
  [_types.WriteOperations.PushCase]: {
    ecsType: EVENT_TYPES.change,
    name: _types.WriteOperations.PushCase,
    action: 'case_push',
    verbs: updateVerbs,
    docType: 'case',
    savedObjectType: _constants.CASE_SAVED_OBJECT
  }
};
const ConfigurationOperations = {
  [_types.ReadOperations.FindConfigurations]: {
    ecsType: EVENT_TYPES.access,
    name: _types.ReadOperations.FindConfigurations,
    action: 'case_configuration_find',
    verbs: accessVerbs,
    docType: 'case configurations',
    savedObjectType: _constants.CASE_CONFIGURE_SAVED_OBJECT
  },
  [_types.WriteOperations.CreateConfiguration]: {
    ecsType: EVENT_TYPES.creation,
    name: _types.WriteOperations.CreateConfiguration,
    action: 'case_configuration_create',
    verbs: createVerbs,
    docType: 'case configuration',
    savedObjectType: _constants.CASE_CONFIGURE_SAVED_OBJECT
  },
  [_types.WriteOperations.UpdateConfiguration]: {
    ecsType: EVENT_TYPES.change,
    name: _types.WriteOperations.UpdateConfiguration,
    action: 'case_configuration_update',
    verbs: updateVerbs,
    docType: 'case configuration',
    savedObjectType: _constants.CASE_CONFIGURE_SAVED_OBJECT
  }
};
const AttachmentOperations = {
  [_types.ReadOperations.GetAttachmentMetrics]: {
    ecsType: EVENT_TYPES.access,
    name: ACCESS_COMMENT_OPERATION,
    action: 'case_comment_get_metrics',
    verbs: accessVerbs,
    docType: 'comments',
    savedObjectType: _constants.CASE_COMMENT_SAVED_OBJECT
  },
  [_types.ReadOperations.GetAlertsAttachedToCase]: {
    ecsType: EVENT_TYPES.access,
    name: ACCESS_COMMENT_OPERATION,
    action: 'case_comment_alerts_attach_to_case',
    verbs: accessVerbs,
    docType: 'comments',
    savedObjectType: _constants.CASE_COMMENT_SAVED_OBJECT
  },
  [_types.ReadOperations.GetComment]: {
    ecsType: EVENT_TYPES.access,
    name: ACCESS_COMMENT_OPERATION,
    action: 'case_comment_get',
    verbs: accessVerbs,
    docType: 'comments',
    savedObjectType: _constants.CASE_COMMENT_SAVED_OBJECT
  },
  [_types.ReadOperations.GetAllComments]: {
    ecsType: EVENT_TYPES.access,
    name: ACCESS_COMMENT_OPERATION,
    action: 'case_comment_get_all',
    verbs: accessVerbs,
    docType: 'comments',
    savedObjectType: _constants.CASE_COMMENT_SAVED_OBJECT
  },
  [_types.ReadOperations.FindComments]: {
    ecsType: EVENT_TYPES.access,
    name: ACCESS_COMMENT_OPERATION,
    action: 'case_comment_find',
    verbs: accessVerbs,
    docType: 'comments',
    savedObjectType: _constants.CASE_COMMENT_SAVED_OBJECT
  },
  [_types.WriteOperations.CreateComment]: {
    ecsType: EVENT_TYPES.creation,
    name: _types.WriteOperations.CreateComment,
    action: 'case_comment_create',
    verbs: createVerbs,
    docType: 'comments',
    savedObjectType: _constants.CASE_COMMENT_SAVED_OBJECT
  },
  [_types.WriteOperations.DeleteAllComments]: {
    ecsType: EVENT_TYPES.deletion,
    name: DELETE_COMMENT_OPERATION,
    action: 'case_comment_delete_all',
    verbs: deleteVerbs,
    docType: 'comments',
    savedObjectType: _constants.CASE_COMMENT_SAVED_OBJECT
  },
  [_types.WriteOperations.DeleteComment]: {
    ecsType: EVENT_TYPES.deletion,
    name: DELETE_COMMENT_OPERATION,
    action: 'case_comment_delete',
    verbs: deleteVerbs,
    docType: 'comments',
    savedObjectType: _constants.CASE_COMMENT_SAVED_OBJECT
  },
  [_types.WriteOperations.UpdateComment]: {
    ecsType: EVENT_TYPES.change,
    name: _types.WriteOperations.UpdateComment,
    action: 'case_comment_update',
    verbs: updateVerbs,
    docType: 'comments',
    savedObjectType: _constants.CASE_COMMENT_SAVED_OBJECT
  }
};
/**
 * Definition of all APIs within the cases backend.
 */

const Operations = { ...CaseOperations,
  ...ConfigurationOperations,
  ...AttachmentOperations,
  [_types.ReadOperations.GetTags]: {
    ecsType: EVENT_TYPES.access,
    name: _types.ReadOperations.GetTags,
    action: 'case_tags_get',
    verbs: accessVerbs,
    docType: 'case',
    savedObjectType: _constants.CASE_SAVED_OBJECT
  },
  [_types.ReadOperations.GetReporters]: {
    ecsType: EVENT_TYPES.access,
    name: _types.ReadOperations.GetReporters,
    action: 'case_reporters_get',
    verbs: accessVerbs,
    docType: 'case',
    savedObjectType: _constants.CASE_SAVED_OBJECT
  },
  [_types.ReadOperations.GetCaseStatuses]: {
    ecsType: EVENT_TYPES.access,
    name: ACCESS_CASE_OPERATION,
    action: 'case_find_statuses',
    verbs: accessVerbs,
    docType: 'cases',
    savedObjectType: _constants.CASE_SAVED_OBJECT
  },
  [_types.ReadOperations.GetUserActions]: {
    ecsType: EVENT_TYPES.access,
    name: ACCESS_USER_ACTION_OPERATION,
    action: 'case_user_actions_get',
    verbs: accessVerbs,
    docType: 'user actions',
    savedObjectType: _constants.CASE_USER_ACTION_SAVED_OBJECT
  },
  [_types.ReadOperations.GetUserActionMetrics]: {
    ecsType: EVENT_TYPES.access,
    name: ACCESS_USER_ACTION_OPERATION,
    action: 'case_user_action_get_metrics',
    verbs: accessVerbs,
    docType: 'user actions',
    savedObjectType: _constants.CASE_USER_ACTION_SAVED_OBJECT
  }
};
exports.Operations = Operations;