"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parameters = exports.decorators = void 0;

var _react = _interopRequireDefault(require("react"));

var _blocks = require("@storybook/addon-docs/blocks");

var _decorator = require("./decorator");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const decorators = [(0, _decorator.getCustomIntegrationsContextDecorator)()];
exports.decorators = decorators;
const parameters = {
  docs: {
    page: () => /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_blocks.Title, null), /*#__PURE__*/_react.default.createElement(_blocks.Subtitle, null), /*#__PURE__*/_react.default.createElement(_blocks.Description, null), /*#__PURE__*/_react.default.createElement(_blocks.Primary, null), /*#__PURE__*/_react.default.createElement(_blocks.Stories, null))
  }
};
exports.parameters = parameters;