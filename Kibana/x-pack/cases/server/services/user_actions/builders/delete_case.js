"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeleteCaseUserActionBuilder = void 0;

var _api = require("../../../../common/api");

var _abstract_builder = require("../abstract_builder");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class DeleteCaseUserActionBuilder extends _abstract_builder.UserActionBuilder {
  build(args) {
    const {
      caseId,
      owner,
      user,
      connectorId
    } = args;
    return {
      attributes: { ...this.getCommonUserActionAttributes({
          user,
          owner
        }),
        action: _api.Actions.delete,
        payload: {},
        type: _api.ActionTypes.delete_case
      },
      references: [...this.createCaseReferences(caseId), ...this.createConnectorReference(connectorId !== null && connectorId !== void 0 ? connectorId : null)]
    };
  }

}

exports.DeleteCaseUserActionBuilder = DeleteCaseUserActionBuilder;