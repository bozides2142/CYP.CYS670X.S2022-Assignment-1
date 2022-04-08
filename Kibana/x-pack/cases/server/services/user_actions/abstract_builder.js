"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserActionBuilder = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _constants = require("../../../common/constants");

var _constants2 = require("../../common/constants");

var _api = require("../../../common/api");

var _server = require("../../../../actions/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class UserActionBuilder {
  constructor() {
    (0, _defineProperty2.default)(this, "buildCommonUserAction", ({
      action,
      user,
      owner,
      value,
      valueKey,
      caseId,
      attachmentId,
      connectorId,
      type
    }) => {
      return {
        attributes: { ...this.getCommonUserActionAttributes({
            user,
            owner
          }),
          action,
          payload: {
            [valueKey]: value
          },
          type
        },
        references: [...this.createCaseReferences(caseId), ...this.createCommentReferences(attachmentId !== null && attachmentId !== void 0 ? attachmentId : null), ...(type === _api.ActionTypes.connector ? this.createConnectorReference(connectorId !== null && connectorId !== void 0 ? connectorId : null) : []), ...(type === _api.ActionTypes.pushed ? this.createConnectorPushReference(connectorId !== null && connectorId !== void 0 ? connectorId : null) : [])]
      };
    });
  }

  getCommonUserActionAttributes({
    user,
    owner
  }) {
    return {
      created_at: new Date().toISOString(),
      created_by: user,
      owner
    };
  }

  extractConnectorId(connector) {
    const {
      id,
      ...restConnector
    } = connector;
    return restConnector;
  }

  createCaseReferences(caseId) {
    return [{
      type: _constants.CASE_SAVED_OBJECT,
      name: _constants2.CASE_REF_NAME,
      id: caseId
    }];
  }

  createActionReference(id, name) {
    return id != null && id !== _api.NONE_CONNECTOR_ID ? [{
      id,
      type: _server.ACTION_SAVED_OBJECT_TYPE,
      name
    }] : [];
  }

  createCommentReferences(id) {
    return id != null ? [{
      type: _constants.CASE_COMMENT_SAVED_OBJECT,
      name: _constants2.COMMENT_REF_NAME,
      id
    }] : [];
  }

  createConnectorReference(id) {
    return this.createActionReference(id, _constants2.CONNECTOR_ID_REFERENCE_NAME);
  }

  createConnectorPushReference(id) {
    return this.createActionReference(id, _constants2.PUSH_CONNECTOR_ID_REFERENCE_NAME);
  }

  extractConnectorIdFromExternalService(externalService) {
    const {
      connector_id: connectorId,
      ...restExternalService
    } = externalService;
    return restExternalService;
  }

}

exports.UserActionBuilder = UserActionBuilder;