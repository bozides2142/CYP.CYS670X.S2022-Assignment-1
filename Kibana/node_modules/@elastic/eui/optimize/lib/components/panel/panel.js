"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiPanel = exports.COLORS = exports.BORDER_RADII = exports.SIZES = exports.panelPaddingValues = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _common = require("../common");

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var panelPaddingValues = {
  none: 0,
  s: 8,
  m: 16,
  l: 24
};
exports.panelPaddingValues = panelPaddingValues;
var paddingSizeToClassNameMap = {
  none: null,
  s: 'euiPanel--paddingSmall',
  m: 'euiPanel--paddingMedium',
  l: 'euiPanel--paddingLarge'
};
var SIZES = (0, _common.keysOf)(paddingSizeToClassNameMap);
exports.SIZES = SIZES;
var borderRadiusToClassNameMap = {
  none: 'euiPanel--borderRadiusNone',
  m: 'euiPanel--borderRadiusMedium'
};
var BORDER_RADII = (0, _common.keysOf)(borderRadiusToClassNameMap);
exports.BORDER_RADII = BORDER_RADII;
var COLORS = ['transparent', 'plain', 'subdued', 'accent', 'primary', 'success', 'warning', 'danger'];
exports.COLORS = COLORS;

var EuiPanel = function EuiPanel(_ref) {
  var children = _ref.children,
      className = _ref.className,
      _ref$paddingSize = _ref.paddingSize,
      paddingSize = _ref$paddingSize === void 0 ? 'm' : _ref$paddingSize,
      _ref$borderRadius = _ref.borderRadius,
      borderRadius = _ref$borderRadius === void 0 ? 'm' : _ref$borderRadius,
      _ref$color = _ref.color,
      color = _ref$color === void 0 ? 'plain' : _ref$color,
      _ref$hasShadow = _ref.hasShadow,
      hasShadow = _ref$hasShadow === void 0 ? true : _ref$hasShadow,
      hasBorder = _ref.hasBorder,
      _ref$grow = _ref.grow,
      grow = _ref$grow === void 0 ? true : _ref$grow,
      panelRef = _ref.panelRef,
      element = _ref.element,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["children", "className", "paddingSize", "borderRadius", "color", "hasShadow", "hasBorder", "grow", "panelRef", "element"]);
  // Shadows are only allowed when there's a white background (plain)
  var canHaveShadow = color === 'plain';
  var canHaveBorder = color === 'plain' || color === 'transparent';
  var classes = (0, _classnames.default)('euiPanel', paddingSizeToClassNameMap[paddingSize], borderRadiusToClassNameMap[borderRadius], "euiPanel--".concat(color), {
    // The `no` classes turn off the option for default theme
    // While the `has` classes turn it on for Amsterdam
    'euiPanel--hasShadow': canHaveShadow && hasShadow === true,
    'euiPanel--noShadow': !canHaveShadow || hasShadow === false,
    'euiPanel--hasBorder': canHaveBorder && hasBorder === true,
    'euiPanel--noBorder': !canHaveBorder || hasBorder === false,
    'euiPanel--flexGrowZero': !grow,
    'euiPanel--isClickable': rest.onClick
  }, className);

  if (rest.onClick && element !== 'div') {
    return (0, _react2.jsx)("button", (0, _extends2.default)({
      ref: panelRef,
      className: classes
    }, rest), children);
  }

  return (0, _react2.jsx)("div", (0, _extends2.default)({
    ref: panelRef,
    className: classes
  }, rest), children);
};

exports.EuiPanel = EuiPanel;