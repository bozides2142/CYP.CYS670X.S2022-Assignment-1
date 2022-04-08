"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CanvasAppLocatorDefinition = exports.CANVAS_APP_LOCATOR = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _constants = require("./lib/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const CANVAS_APP_LOCATOR = 'CANVAS_APP_LOCATOR';
exports.CANVAS_APP_LOCATOR = CANVAS_APP_LOCATOR;

class CanvasAppLocatorDefinition {
  constructor() {
    (0, _defineProperty2.default)(this, "id", CANVAS_APP_LOCATOR);
  }

  async getLocation(params) {
    const app = _constants.CANVAS_APP;

    if (params.view === 'workpadPDF') {
      const {
        id,
        page
      } = params;
      return {
        app,
        path: `#/export/workpad/pdf/${id}/page/${page}`,
        state: {}
      };
    }

    return {
      app,
      path: '#/',
      state: {}
    };
  }

}

exports.CanvasAppLocatorDefinition = CanvasAppLocatorDefinition;