"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiSkipLink = exports.POSITIONS = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _button = require("../button/button");

var _screen_reader = require("../accessibility/screen_reader");

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var POSITIONS = ['static', 'fixed', 'absolute'];
exports.POSITIONS = POSITIONS;

var EuiSkipLink = function EuiSkipLink(_ref) {
  var destinationId = _ref.destinationId,
      tabIndex = _ref.tabIndex,
      _ref$position = _ref.position,
      position = _ref$position === void 0 ? 'static' : _ref$position,
      children = _ref.children,
      className = _ref.className,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["destinationId", "tabIndex", "position", "children", "className"]);
  var classes = (0, _classnames.default)('euiSkipLink', ["euiSkipLink--".concat(position)], className); // Create the `href` from `destinationId`

  var optionalProps = {};

  if (destinationId) {
    optionalProps = {
      href: "#".concat(destinationId)
    };
  }

  return (0, _react2.jsx)(_screen_reader.EuiScreenReaderOnly, {
    showOnFocus: true
  }, (0, _react2.jsx)(_button.EuiButton, (0, _extends2.default)({
    className: classes,
    tabIndex: position === 'fixed' ? 0 : tabIndex,
    size: "s",
    fill: true
  }, optionalProps, rest), children));
};

exports.EuiSkipLink = EuiSkipLink;