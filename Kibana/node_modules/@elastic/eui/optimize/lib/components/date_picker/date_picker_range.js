"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiDatePickerRange = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _text = require("../text");

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var EuiDatePickerRange = function EuiDatePickerRange(_ref) {
  var children = _ref.children,
      className = _ref.className,
      startDateControl = _ref.startDateControl,
      endDateControl = _ref.endDateControl,
      _ref$iconType = _ref.iconType,
      iconType = _ref$iconType === void 0 ? true : _ref$iconType,
      fullWidth = _ref.fullWidth,
      isCustom = _ref.isCustom,
      readOnly = _ref.readOnly,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["children", "className", "startDateControl", "endDateControl", "iconType", "fullWidth", "isCustom", "readOnly"]);
  var classes = (0, _classnames.default)('euiDatePickerRange', {
    'euiDatePickerRange--fullWidth': fullWidth,
    'euiDatePickerRange--readOnly': readOnly
  }, className);
  var startControl = startDateControl;
  var endControl = endDateControl;

  if (!isCustom) {
    startControl = /*#__PURE__*/(0, _react.cloneElement)(startDateControl, {
      fullWidth: fullWidth,
      readOnly: readOnly,
      iconType: typeof iconType === 'boolean' ? undefined : iconType,
      showIcon: !!iconType,
      className: (0, _classnames.default)('euiDatePickerRange__start', startDateControl.props.className)
    });
    endControl = /*#__PURE__*/(0, _react.cloneElement)(endDateControl, {
      showIcon: false,
      fullWidth: fullWidth,
      readOnly: readOnly,
      popoverPlacement: 'bottom-end',
      className: (0, _classnames.default)('euiDatePickerRange__end', endDateControl.props.className)
    });
  }

  return (0, _react2.jsx)("div", (0, _extends2.default)({
    className: classes
  }, rest), children ? children : (0, _react2.jsx)(_react.Fragment, null, startControl, (0, _react2.jsx)(_text.EuiText, {
    className: "euiDatePickerRange__delimeter",
    size: "s",
    color: "subdued"
  }, "\u2192"), endControl));
};

exports.EuiDatePickerRange = EuiDatePickerRange;