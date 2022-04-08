"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DescriptionUserActionBuilder = void 0;

var _api = require("../../../../common/api");

var _abstract_builder = require("../abstract_builder");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class DescriptionUserActionBuilder extends _abstract_builder.UserActionBuilder {
  build(args) {
    return this.buildCommonUserAction({ ...args,
      action: _api.Actions.update,
      valueKey: 'description',
      type: _api.ActionTypes.description,
      value: args.payload.description
    });
  }

}

exports.DescriptionUserActionBuilder = DescriptionUserActionBuilder;