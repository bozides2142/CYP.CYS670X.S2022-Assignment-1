"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiSplitPanel = exports._EuiSplitPanelOuter = exports._EuiSplitPanelInner = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _panel = require("../panel");

var _hooks = require("../../../services/hooks");

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Consumed via `EuiSplitPanel.Inner`.
 * Extends most `EuiPanelProps`.
 */
var _EuiSplitPanelInner = function _EuiSplitPanelInner(_ref) {
  var children = _ref.children,
      className = _ref.className,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["children", "className"]);
  var classes = (0, _classnames.default)('euiSplitPanel__inner', className);
  var panelProps = {
    hasShadow: false,
    color: 'transparent',
    borderRadius: 'none',
    hasBorder: false
  };
  return (0, _react2.jsx)(_panel.EuiPanel, (0, _extends2.default)({
    element: "div",
    className: classes
  }, panelProps, rest), children);
};

exports._EuiSplitPanelInner = _EuiSplitPanelInner;

/**
 * Consumed via `EuiSplitPanel.Outer`.
 * Extends most `EuiPanelProps`.
 */
var _EuiSplitPanelOuter = function _EuiSplitPanelOuter(_ref2) {
  var children = _ref2.children,
      className = _ref2.className,
      _ref2$direction = _ref2.direction,
      direction = _ref2$direction === void 0 ? 'column' : _ref2$direction,
      _ref2$responsive = _ref2.responsive,
      responsive = _ref2$responsive === void 0 ? ['xs', 's'] : _ref2$responsive,
      rest = (0, _objectWithoutProperties2.default)(_ref2, ["children", "className", "direction", "responsive"]);
  var isResponsive = (0, _hooks.useIsWithinBreakpoints)(responsive, !!responsive);
  var classes = (0, _classnames.default)('euiSplitPanel', {
    'euiSplitPanel--row': direction === 'row',
    'euiSplitPanel-isResponsive': isResponsive
  }, className);
  return (0, _react2.jsx)(_panel.EuiPanel, (0, _extends2.default)({
    paddingSize: "none",
    grow: false,
    className: classes
  }, rest), children);
};

exports._EuiSplitPanelOuter = _EuiSplitPanelOuter;
var EuiSplitPanel = {
  Outer: _EuiSplitPanelOuter,
  Inner: _EuiSplitPanelInner
};
exports.EuiSplitPanel = EuiSplitPanel;