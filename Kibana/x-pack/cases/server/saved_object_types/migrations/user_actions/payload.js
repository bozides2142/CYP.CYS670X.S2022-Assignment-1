"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserActionType = exports.getPayload = void 0;
exports.payloadMigration = payloadMigration;
exports.removeOldReferences = void 0;

var _lodash = require("lodash");

var _api = require("../../../../common/api");

var _constants = require("./constants");

var _utils = require("../../../common/utils");

var _utils2 = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable @typescript-eslint/naming-convention */


function payloadMigration(doc, context) {
  var _doc$references;

  const originalDocWithReferences = { ...doc,
    references: (_doc$references = doc.references) !== null && _doc$references !== void 0 ? _doc$references : []
  };
  const owner = originalDocWithReferences.attributes.owner;
  const {
    new_value,
    old_value,
    action_field,
    action_at,
    action_by,
    action,
    ...restAttributes
  } = originalDocWithReferences.attributes;
  const newAction = action === 'push-to-service' ? _api.Actions.push_to_service : action;
  const type = getUserActionType(action_field, action);

  try {
    const payload = getPayload(type, action_field, new_value, old_value, owner);
    const references = removeOldReferences(doc.references);
    return { ...originalDocWithReferences,
      attributes: { ...restAttributes,
        action: newAction,
        created_at: action_at,
        created_by: action_by,
        payload,
        type
      },
      references
    };
  } catch (error) {
    var _doc$references2;

    (0, _utils2.logError)({
      id: doc.id,
      context,
      error,
      docType: 'user action',
      docKey: 'userAction'
    });
    return { ...originalDocWithReferences,
      attributes: { ...restAttributes,
        action: newAction,
        created_at: action_at,
        created_by: action_by,
        payload: {},
        type
      },
      references: (_doc$references2 = doc.references) !== null && _doc$references2 !== void 0 ? _doc$references2 : []
    };
  }
}

const getUserActionType = (fields, action) => {
  var _ActionTypes$field;

  if (fields.length > 1 && action === _api.Actions.create) {
    return _api.ActionTypes.create_case;
  }

  if (fields.length > 1 && action === _api.Actions.delete) {
    return _api.ActionTypes.delete_case;
  }

  const field = fields[0];
  return (_ActionTypes$field = _api.ActionTypes[field]) !== null && _ActionTypes$field !== void 0 ? _ActionTypes$field : '';
};

exports.getUserActionType = getUserActionType;

const getPayload = (type, action_field, new_value, old_value, owner) => {
  var _ref;

  const payload = convertPayload(action_field, (_ref = new_value !== null && new_value !== void 0 ? new_value : old_value) !== null && _ref !== void 0 ? _ref : null, owner);
  /**
   * From 7.10+ the cases saved object has the connector attribute
   * Create case user actions did not get migrated to have the
   * connector attribute included.
   *
   * We are taking care of it in this migration by adding the none
   * connector as a default. The same applies to the status field.
   *
   * If a create_case user action does not have the
   * owner field we default to the owner of the of the
   * user action. It is impossible to create a user action
   * with different owner from the original case.
   */

  const {
    id,
    ...noneConnector
  } = (0, _utils.getNoneCaseConnector)();
  return { ...payload,
    ...(payload.connector == null && (type === _api.ActionTypes.create_case || type === _api.ActionTypes.connector) && {
      connector: noneConnector
    }),
    ...((0, _lodash.isEmpty)(payload.status) && type === _api.ActionTypes.create_case && {
      status: _api.CaseStatuses.open
    }),
    ...(type === _api.ActionTypes.create_case && (0, _lodash.isEmpty)(payload.owner) && {
      owner
    }),
    ...(type === _api.ActionTypes.create_case && (0, _lodash.isEmpty)(payload.settings) && {
      settings: {
        syncAlerts: true
      }
    })
  };
};

exports.getPayload = getPayload;

const convertPayload = (fields, value, owner) => {
  if (value == null) {
    return {};
  }

  const unsafeDecodedValue = decodeValue(value);
  return fields.reduce((payload, field) => {
    var _unsafeDecodedValue$f;

    return { ...payload,
      ...getSingleFieldPayload(field, (_unsafeDecodedValue$f = unsafeDecodedValue[field]) !== null && _unsafeDecodedValue$f !== void 0 ? _unsafeDecodedValue$f : unsafeDecodedValue, owner)
    };
  }, {});
};

const decodeValue = value => {
  try {
    return (0, _lodash.isString)(value) ? JSON.parse(value) : value !== null && value !== void 0 ? value : {};
  } catch {
    return value;
  }
};

const getSingleFieldPayload = (field, value, owner) => {
  switch (field) {
    case 'title':
    case 'status':
    case 'description':
      return {
        [field]: (0, _lodash.isString)(value) ? value : ''
      };

    case 'owner':
      return {
        [field]: (0, _lodash.isString)(value) ? value : owner
      };

    case 'settings':
    case 'connector':
      return {
        [field]: (0, _lodash.isPlainObject)(value) ? value : {}
      };

    case 'pushed':
      return {
        externalService: (0, _lodash.isPlainObject)(value) ? value : {}
      };

    case 'tags':
      return {
        tags: (0, _lodash.isString)(value) ? value.split(',').map(item => item.trim()) : Array.isArray(value) ? value : []
      };

    case 'comment':
      /**
       * Until 7.10 the new_value of the comment user action
       * was a string. In 7.11+ more fields were introduced to the comment's
       * saved object and the new_value of the user actions changes to an
       * stringify object. At that point of time no migrations were made to
       * the user actions to accommodate the new formatting.
       *
       * We are taking care of it in this migration.
       * If there response of the decodeValue function is not an object
       * then we assume that the value is a string coming for a 7.10
       * user action saved object.
       *
       * Also if the comment does not have an owner we default to the owner
       * of the user action. It is impossible to create a user action
       * with a different owner from the original case.
       */
      return {
        comment: (0, _lodash.isPlainObject)(value) ? { ...value,
          ...(value.owner == null && {
            owner
          })
        } : {
          comment: (0, _lodash.isString)(value) ? value : '',
          type: _api.CommentType.user,
          owner
        }
      };

    default:
      return {};
  }
};

const removeOldReferences = references => (references !== null && references !== void 0 ? references : []).filter(ref => ref.name !== _constants.USER_ACTION_OLD_ID_REF_NAME && ref.name !== _constants.USER_ACTION_OLD_PUSH_ID_REF_NAME);

exports.removeOldReferences = removeOldReferences;