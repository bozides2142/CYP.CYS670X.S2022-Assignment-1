"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiFormControlLayoutCustomIcon = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _icon = require("../../icon");

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var EuiFormControlLayoutCustomIcon = function EuiFormControlLayoutCustomIcon(_ref) {
  var className = _ref.className,
      onClick = _ref.onClick,
      type = _ref.type,
      iconRef = _ref.iconRef,
      size = _ref.size,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["className", "onClick", "type", "iconRef", "size"]);
  var classes = (0, _classnames.default)('euiFormControlLayoutCustomIcon', className, {
    'euiFormControlLayoutCustomIcon--clickable': onClick
  });

  if (onClick) {
    return (0, _react2.jsx)("button", (0, _extends2.default)({
      type: "button",
      onClick: onClick,
      className: classes,
      ref: iconRef
    }, rest), (0, _react2.jsx)(_icon.EuiIcon, {
      className: "euiFormControlLayoutCustomIcon__icon",
      "aria-hidden": "true",
      size: size,
      type: type
    }));
  }

  return (0, _react2.jsx)("span", (0, _extends2.default)({
    className: classes,
    ref: iconRef
  }, rest), (0, _react2.jsx)(_icon.EuiIcon, {
    className: "euiFormControlLayoutCustomIcon__icon",
    "aria-hidden": "true",
    size: size,
    type: type
  }));
};

exports.EuiFormControlLayoutCustomIcon = EuiFormControlLayoutCustomIcon;