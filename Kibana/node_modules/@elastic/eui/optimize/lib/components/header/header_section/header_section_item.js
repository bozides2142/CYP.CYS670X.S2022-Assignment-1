"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiHeaderSectionItem = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var borderToClassNameMap = {
  left: 'euiHeaderSectionItem--borderLeft',
  right: 'euiHeaderSectionItem--borderRight',
  none: undefined
};

var EuiHeaderSectionItem = function EuiHeaderSectionItem(_ref) {
  var _ref$border = _ref.border,
      border = _ref$border === void 0 ? 'left' : _ref$border,
      children = _ref.children,
      className = _ref.className,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["border", "children", "className"]);
  var classes = (0, _classnames.default)('euiHeaderSectionItem', borderToClassNameMap[border], className);
  return (0, _react2.jsx)("div", (0, _extends2.default)({
    className: classes
  }, rest), children);
};

exports.EuiHeaderSectionItem = EuiHeaderSectionItem;