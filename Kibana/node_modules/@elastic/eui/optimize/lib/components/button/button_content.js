"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiButtonContent = exports.ICON_SIDES = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _common = require("../common");

var _loading = require("../loading");

var _icon = require("../icon");

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var iconSideToClassNameMap = {
  left: null,
  right: 'euiButtonContent--iconRight'
};
var ICON_SIDES = (0, _common.keysOf)(iconSideToClassNameMap);
exports.ICON_SIDES = ICON_SIDES;

var EuiButtonContent = function EuiButtonContent(_ref) {
  var children = _ref.children,
      textProps = _ref.textProps,
      _ref$isLoading = _ref.isLoading,
      isLoading = _ref$isLoading === void 0 ? false : _ref$isLoading,
      iconType = _ref.iconType,
      _ref$iconSize = _ref.iconSize,
      iconSize = _ref$iconSize === void 0 ? 'm' : _ref$iconSize,
      _ref$iconSide = _ref.iconSide,
      iconSide = _ref$iconSide === void 0 ? 'left' : _ref$iconSide,
      contentProps = (0, _objectWithoutProperties2.default)(_ref, ["children", "textProps", "isLoading", "iconType", "iconSize", "iconSide"]);
  // Add an icon to the button if one exists.
  var buttonIcon;

  if (isLoading) {
    buttonIcon = (0, _react2.jsx)(_loading.EuiLoadingSpinner, {
      className: "euiButtonContent__spinner",
      size: iconSize
    });
  } else if (iconType) {
    buttonIcon = (0, _react2.jsx)(_icon.EuiIcon, {
      className: "euiButtonContent__icon",
      type: iconType,
      size: iconSize,
      color: "inherit" // forces the icon to inherit its parent color

    });
  }

  var contentClassNames = (0, _classnames.default)('euiButtonContent', iconSide ? iconSideToClassNameMap[iconSide] : null, contentProps && contentProps.className);
  return (0, _react2.jsx)("span", (0, _extends2.default)({}, contentProps, {
    className: contentClassNames
  }), buttonIcon, (0, _react2.jsx)("span", textProps, children));
};

exports.EuiButtonContent = EuiButtonContent;