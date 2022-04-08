"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PushedUserActionBuilder = void 0;

var _api = require("../../../../common/api");

var _abstract_builder = require("../abstract_builder");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class PushedUserActionBuilder extends _abstract_builder.UserActionBuilder {
  build(args) {
    return this.buildCommonUserAction({ ...args,
      action: _api.Actions.push_to_service,
      valueKey: 'externalService',
      value: this.extractConnectorIdFromExternalService(args.payload.externalService),
      type: _api.ActionTypes.pushed,
      connectorId: args.payload.externalService.connector_id
    });
  }

}

exports.PushedUserActionBuilder = PushedUserActionBuilder;