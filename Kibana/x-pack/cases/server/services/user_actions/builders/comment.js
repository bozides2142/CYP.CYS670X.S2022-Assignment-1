"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CommentUserActionBuilder = void 0;

var _api = require("../../../../common/api");

var _abstract_builder = require("../abstract_builder");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class CommentUserActionBuilder extends _abstract_builder.UserActionBuilder {
  build(args) {
    var _args$action;

    return this.buildCommonUserAction({ ...args,
      action: (_args$action = args.action) !== null && _args$action !== void 0 ? _args$action : _api.Actions.update,
      valueKey: 'comment',
      value: args.payload.attachment,
      type: _api.ActionTypes.comment
    });
  }

}

exports.CommentUserActionBuilder = CommentUserActionBuilder;