"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiPageContent = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _panel = require("../../panel/panel");

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var verticalPositionToClassNameMap = {
  center: 'euiPageContent--verticalCenter'
};
var horizontalPositionToClassNameMap = {
  center: 'euiPageContent--horizontalCenter'
};

var EuiPageContent = function EuiPageContent(_ref) {
  var verticalPosition = _ref.verticalPosition,
      horizontalPosition = _ref.horizontalPosition,
      _ref$paddingSize = _ref.paddingSize,
      paddingSize = _ref$paddingSize === void 0 ? 'l' : _ref$paddingSize,
      borderRadius = _ref.borderRadius,
      children = _ref.children,
      className = _ref.className,
      _ref$role = _ref.role,
      _role = _ref$role === void 0 ? 'main' : _ref$role,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["verticalPosition", "horizontalPosition", "paddingSize", "borderRadius", "children", "className", "role"]);

  var role = _role === null ? undefined : _role;
  var borderRadiusClass = borderRadius === 'none' ? 'euiPageContent--borderRadiusNone' : '';
  var classes = (0, _classnames.default)('euiPageContent', borderRadiusClass, verticalPosition ? verticalPositionToClassNameMap[verticalPosition] : null, horizontalPosition ? horizontalPositionToClassNameMap[horizontalPosition] : null, className);
  return (0, _react2.jsx)(_panel.EuiPanel, (0, _extends2.default)({
    className: classes,
    paddingSize: paddingSize,
    borderRadius: borderRadius,
    role: role
  }, rest), children);
};

exports.EuiPageContent = EuiPageContent;