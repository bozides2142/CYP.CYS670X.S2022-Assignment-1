"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExpressionRendererRegistry = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _expression_renderer = require("./expression_renderer");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class ExpressionRendererRegistry {
  constructor() {
    (0, _defineProperty2.default)(this, "renderers", new Map());
  }

  register(definition) {
    if (typeof definition === 'function') definition = definition();
    const renderer = new _expression_renderer.ExpressionRenderer(definition);
    this.renderers.set(renderer.name, renderer);
  }

  get(id) {
    return this.renderers.get(id) || null;
  }

  toJS() {
    return this.toArray().reduce((acc, renderer) => ({ ...acc,
      [renderer.name]: renderer
    }), {});
  }

  toArray() {
    return [...this.renderers.values()];
  }

}

exports.ExpressionRendererRegistry = ExpressionRendererRegistry;