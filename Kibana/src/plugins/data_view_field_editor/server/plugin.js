"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IndexPatternPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _routes = require("./routes");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class IndexPatternPlugin {
  constructor({
    logger
  }) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "apiRoutes", void 0);
    this.logger = logger.get();
    this.apiRoutes = new _routes.ApiRoutes();
  }

  setup({
    http
  }) {
    this.logger.debug('index_pattern_field_editor: setup');
    const router = http.createRouter();
    this.apiRoutes.setup({
      router
    });
  }

  start() {}

  stop() {}

}

exports.IndexPatternPlugin = IndexPatternPlugin;