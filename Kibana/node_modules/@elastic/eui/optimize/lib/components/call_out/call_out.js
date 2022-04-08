"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiCallOut = exports.HEADINGS = exports.COLORS = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _common = require("../common");

var _icon = require("../icon");

var _text = require("../text");

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var colorToClassNameMap = {
  primary: 'euiCallOut--primary',
  success: 'euiCallOut--success',
  warning: 'euiCallOut--warning',
  danger: 'euiCallOut--danger'
};
var COLORS = (0, _common.keysOf)(colorToClassNameMap);
exports.COLORS = COLORS;
var HEADINGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'];
exports.HEADINGS = HEADINGS;
var sizeToClassNameMap = {
  s: 'euiCallOut--small',
  m: ''
};
var EuiCallOut = /*#__PURE__*/(0, _react.forwardRef)(function (_ref, ref) {
  var title = _ref.title,
      _ref$color = _ref.color,
      color = _ref$color === void 0 ? 'primary' : _ref$color,
      _ref$size = _ref.size,
      size = _ref$size === void 0 ? 'm' : _ref$size,
      iconType = _ref.iconType,
      children = _ref.children,
      className = _ref.className,
      heading = _ref.heading,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["title", "color", "size", "iconType", "children", "className", "heading"]);
  var classes = (0, _classnames.default)('euiCallOut', colorToClassNameMap[color], sizeToClassNameMap[size], className);
  var headerIcon;

  if (iconType) {
    headerIcon = (0, _react2.jsx)(_icon.EuiIcon, {
      className: "euiCallOutHeader__icon",
      type: iconType,
      size: "m",
      "aria-hidden": "true",
      color: "inherit" // forces the icon to inherit its parent color

    });
  }

  var optionalChildren;

  if (children && size === 's') {
    optionalChildren = (0, _react2.jsx)(_text.EuiText, {
      size: "xs",
      color: "default"
    }, children);
  } else if (children) {
    optionalChildren = (0, _react2.jsx)(_text.EuiText, {
      size: "s",
      color: "default"
    }, children);
  }

  var H = heading ? "".concat(heading) : 'span';
  var header;

  if (title) {
    header = (0, _react2.jsx)("div", {
      className: "euiCallOutHeader"
    }, headerIcon, (0, _react2.jsx)(H, {
      className: "euiCallOutHeader__title"
    }, title));
  }

  return (0, _react2.jsx)("div", (0, _extends2.default)({
    className: classes,
    ref: ref
  }, rest), header, optionalChildren);
});
exports.EuiCallOut = EuiCallOut;
EuiCallOut.displayName = 'EuiCallOut';