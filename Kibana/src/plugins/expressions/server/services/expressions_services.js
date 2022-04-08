"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExpressionsService = void 0;

var _common = require("../../common");

var _expression_functions = require("../expression_functions");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class ExpressionsService extends _common.ExpressionsService {
  setup({
    getStartServices
  }) {
    this.registerFunction((0, _expression_functions.getUiSettingFn)({
      getStartServices
    }));
    return super.setup();
  }

}

exports.ExpressionsService = ExpressionsService;