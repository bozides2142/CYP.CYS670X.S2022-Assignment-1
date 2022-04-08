"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiTableHeaderButton = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _inner_text = require("../inner_text");

var _icon = require("../icon");

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var EuiTableHeaderButton = function EuiTableHeaderButton(_ref) {
  var children = _ref.children,
      className = _ref.className,
      iconType = _ref.iconType,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["children", "className", "iconType"]);
  var classes = (0, _classnames.default)('euiTableHeaderButton', className); // Add an icon to the button if one exists.

  var buttonIcon;

  if (iconType) {
    buttonIcon = (0, _react2.jsx)(_icon.EuiIcon, {
      className: "euiTableHeaderButton__icon",
      type: iconType,
      size: "m",
      "aria-hidden": "true"
    });
  }

  return (0, _react2.jsx)("button", (0, _extends2.default)({
    type: "button",
    className: classes
  }, rest), (0, _react2.jsx)(_inner_text.EuiInnerText, null, function (ref, innerText) {
    return (0, _react2.jsx)("span", {
      title: innerText,
      ref: ref
    }, children);
  }), buttonIcon);
};

exports.EuiTableHeaderButton = EuiTableHeaderButton;