"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateCaseUserActionBuilder = void 0;

var _api = require("../../../../common/api");

var _abstract_builder = require("../abstract_builder");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class CreateCaseUserActionBuilder extends _abstract_builder.UserActionBuilder {
  build(args) {
    const {
      payload,
      caseId,
      owner,
      user
    } = args;
    const connectorWithoutId = this.extractConnectorId(payload.connector);
    return {
      attributes: { ...this.getCommonUserActionAttributes({
          user,
          owner
        }),
        action: _api.Actions.create,
        payload: { ...payload,
          connector: connectorWithoutId,
          status: _api.CaseStatuses.open
        },
        type: _api.ActionTypes.create_case
      },
      references: [...this.createCaseReferences(caseId), ...this.createConnectorReference(payload.connector.id)]
    };
  }

}

exports.CreateCaseUserActionBuilder = CreateCaseUserActionBuilder;