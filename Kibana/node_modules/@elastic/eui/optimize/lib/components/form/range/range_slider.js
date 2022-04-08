"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiRangeSlider = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var EuiRangeSlider = /*#__PURE__*/(0, _react.forwardRef)(function (_ref, ref) {
  var className = _ref.className,
      disabled = _ref.disabled,
      id = _ref.id,
      max = _ref.max,
      min = _ref.min,
      name = _ref.name,
      step = _ref.step,
      onChange = _ref.onChange,
      tabIndex = _ref.tabIndex,
      value = _ref.value,
      style = _ref.style,
      showTicks = _ref.showTicks,
      showRange = _ref.showRange,
      hasFocus = _ref.hasFocus,
      compressed = _ref.compressed,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["className", "disabled", "id", "max", "min", "name", "step", "onChange", "tabIndex", "value", "style", "showTicks", "showRange", "hasFocus", "compressed"]);
  var classes = (0, _classnames.default)('euiRangeSlider', {
    'euiRangeSlider--hasTicks': showTicks,
    'euiRangeSlider--hasFocus': hasFocus,
    'euiRangeSlider--hasRange': showRange,
    'euiRangeSlider--compressed': compressed
  }, className);
  return (0, _react2.jsx)("input", (0, _extends2.default)({
    ref: ref,
    type: "range",
    id: id,
    name: name,
    className: classes,
    min: min,
    max: max,
    step: step,
    value: value,
    disabled: disabled,
    onChange: onChange,
    style: style,
    tabIndex: tabIndex
  }, rest));
});
exports.EuiRangeSlider = EuiRangeSlider;
EuiRangeSlider.displayName = 'EuiRangeSlider';