"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isUserActionType = exports.isTitleUserAction = exports.isTagsUserAction = exports.isStatusUserAction = exports.isPushedUserAction = exports.isDescriptionUserAction = exports.isCreateCaseUserAction = exports.isConnectorUserAction = exports.isCommentUserAction = void 0;

var _api = require("../api");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const isConnectorUserAction = userAction => {
  var _payload;

  return (userAction === null || userAction === void 0 ? void 0 : userAction.type) === _api.ActionTypes.connector && (userAction === null || userAction === void 0 ? void 0 : (_payload = userAction.payload) === null || _payload === void 0 ? void 0 : _payload.connector) != null;
};

exports.isConnectorUserAction = isConnectorUserAction;

const isPushedUserAction = userAction => {
  var _payload2;

  return (userAction === null || userAction === void 0 ? void 0 : userAction.type) === _api.ActionTypes.pushed && (userAction === null || userAction === void 0 ? void 0 : (_payload2 = userAction.payload) === null || _payload2 === void 0 ? void 0 : _payload2.externalService) != null;
};

exports.isPushedUserAction = isPushedUserAction;

const isTitleUserAction = userAction => {
  var _payload3;

  return (userAction === null || userAction === void 0 ? void 0 : userAction.type) === _api.ActionTypes.title && (userAction === null || userAction === void 0 ? void 0 : (_payload3 = userAction.payload) === null || _payload3 === void 0 ? void 0 : _payload3.title) != null;
};

exports.isTitleUserAction = isTitleUserAction;

const isStatusUserAction = userAction => {
  var _payload4;

  return (userAction === null || userAction === void 0 ? void 0 : userAction.type) === _api.ActionTypes.status && (userAction === null || userAction === void 0 ? void 0 : (_payload4 = userAction.payload) === null || _payload4 === void 0 ? void 0 : _payload4.status) != null;
};

exports.isStatusUserAction = isStatusUserAction;

const isTagsUserAction = userAction => {
  var _payload5;

  return (userAction === null || userAction === void 0 ? void 0 : userAction.type) === _api.ActionTypes.tags && (userAction === null || userAction === void 0 ? void 0 : (_payload5 = userAction.payload) === null || _payload5 === void 0 ? void 0 : _payload5.tags) != null;
};

exports.isTagsUserAction = isTagsUserAction;

const isCommentUserAction = userAction => {
  var _payload6;

  return (userAction === null || userAction === void 0 ? void 0 : userAction.type) === _api.ActionTypes.comment && (userAction === null || userAction === void 0 ? void 0 : (_payload6 = userAction.payload) === null || _payload6 === void 0 ? void 0 : _payload6.comment) != null;
};

exports.isCommentUserAction = isCommentUserAction;

const isDescriptionUserAction = userAction => {
  var _payload7;

  return (userAction === null || userAction === void 0 ? void 0 : userAction.type) === _api.ActionTypes.description && (userAction === null || userAction === void 0 ? void 0 : (_payload7 = userAction.payload) === null || _payload7 === void 0 ? void 0 : _payload7.description) != null;
};

exports.isDescriptionUserAction = isDescriptionUserAction;

const isCreateCaseUserAction = userAction => {
  var _payload8;

  return (userAction === null || userAction === void 0 ? void 0 : userAction.type) === _api.ActionTypes.create_case &&
  /**
   * Connector is needed in various places across the application where
   * the isCreateCaseUserAction is being used.
   * Migrations should add the connector payload if it is
   * missing.
   */
  (userAction === null || userAction === void 0 ? void 0 : (_payload8 = userAction.payload) === null || _payload8 === void 0 ? void 0 : _payload8.connector) != null;
};

exports.isCreateCaseUserAction = isCreateCaseUserAction;

const isUserActionType = field => _api.ActionTypes[field] != null;

exports.isUserActionType = isUserActionType;