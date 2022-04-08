"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserActionCommonAttributesRt = exports.CaseUserActionSavedObjectIdsRt = exports.ActionsRt = exports.Actions = exports.ActionTypesRt = exports.ActionTypes = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

var _user = require("../../user");

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ActionTypes = {
  comment: 'comment',
  connector: 'connector',
  description: 'description',
  pushed: 'pushed',
  tags: 'tags',
  title: 'title',
  status: 'status',
  settings: 'settings',
  create_case: 'create_case',
  delete_case: 'delete_case'
};
exports.ActionTypes = ActionTypes;
const Actions = {
  add: 'add',
  create: 'create',
  delete: 'delete',
  update: 'update',
  push_to_service: 'push_to_service'
};
/* To the next developer, if you add/removed fields here
 * make sure to check this file (x-pack/plugins/cases/server/services/user_actions/helpers.ts) too
 */

exports.Actions = Actions;
const ActionTypesRt = rt.keyof(ActionTypes);
exports.ActionTypesRt = ActionTypesRt;
const ActionsRt = rt.keyof(Actions);
exports.ActionsRt = ActionsRt;
const UserActionCommonAttributesRt = rt.type({
  created_at: rt.string,
  created_by: _user.UserRT,
  owner: rt.string,
  action: ActionsRt
});
exports.UserActionCommonAttributesRt = UserActionCommonAttributesRt;
const CaseUserActionSavedObjectIdsRt = rt.type({
  action_id: rt.string,
  case_id: rt.string,
  comment_id: rt.union([rt.string, rt.null])
});
exports.CaseUserActionSavedObjectIdsRt = CaseUserActionSavedObjectIdsRt;