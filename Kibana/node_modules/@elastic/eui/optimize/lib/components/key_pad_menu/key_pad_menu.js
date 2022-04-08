"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiKeyPadMenu = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _form_label = require("../form/form_label/form_label");

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var EuiKeyPadMenu = function EuiKeyPadMenu(_ref) {
  var children = _ref.children,
      className = _ref.className,
      checkable = _ref.checkable,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["children", "className", "checkable"]);
  var classes = (0, _classnames.default)('euiKeyPadMenu', className);
  var legend = (0, _typeof2.default)(checkable) === 'object' && checkable.legend ? (0, _react2.jsx)(_form_label.EuiFormLabel, (0, _extends2.default)({}, checkable.legendProps, {
    type: "legend"
  }), checkable.legend) : undefined;
  return checkable ? (0, _react2.jsx)("fieldset", (0, _extends2.default)({
    className: classes,
    "aria-label": (0, _typeof2.default)(checkable) === 'object' ? checkable.ariaLegend : undefined
  }, rest), legend, children) : (0, _react2.jsx)("ul", (0, _extends2.default)({
    className: classes
  }, rest), _react.default.Children.map(children, function (child) {
    return (0, _react2.jsx)("li", null, child);
  }));
};

exports.EuiKeyPadMenu = EuiKeyPadMenu;