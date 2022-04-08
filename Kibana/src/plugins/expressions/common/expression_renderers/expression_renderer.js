"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExpressionRenderer = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class ExpressionRenderer {
  constructor(config) {
    (0, _defineProperty2.default)(this, "name", void 0);
    (0, _defineProperty2.default)(this, "displayName", void 0);
    (0, _defineProperty2.default)(this, "help", void 0);
    (0, _defineProperty2.default)(this, "validate", void 0);
    (0, _defineProperty2.default)(this, "reuseDomNode", void 0);
    (0, _defineProperty2.default)(this, "render", void 0);
    const {
      name,
      displayName,
      help,
      validate,
      reuseDomNode,
      render
    } = config;
    this.name = name;
    this.displayName = displayName || name;
    this.help = help || '';

    this.validate = validate || (() => {});

    this.reuseDomNode = Boolean(reuseDomNode);
    this.render = render;
  }

}

exports.ExpressionRenderer = ExpressionRenderer;