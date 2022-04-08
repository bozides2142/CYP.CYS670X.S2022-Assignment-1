"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiCommentEvent = exports.TYPES = void 0;

var _react = _interopRequireDefault(require("react"));

var _common = require("../common");

var _classnames = _interopRequireDefault(require("classnames"));

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var typeToClassNameMap = {
  regular: 'euiCommentEvent--regular',
  update: 'euiCommentEvent--update'
};
var TYPES = (0, _common.keysOf)(typeToClassNameMap);
exports.TYPES = TYPES;

var EuiCommentEvent = function EuiCommentEvent(_ref) {
  var children = _ref.children,
      className = _ref.className,
      username = _ref.username,
      timestamp = _ref.timestamp,
      _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'regular' : _ref$type,
      event = _ref.event,
      actions = _ref.actions;
  var classes = (0, _classnames.default)('euiCommentEvent', typeToClassNameMap[type], className);
  var isFigure = type === 'regular' || type === 'update' && typeof children !== 'undefined';
  var Element = isFigure ? 'figure' : 'div';
  var HeaderElement = isFigure ? 'figcaption' : 'div';
  return (0, _react2.jsx)(Element, {
    className: classes
  }, (0, _react2.jsx)(HeaderElement, {
    className: "euiCommentEvent__header"
  }, (0, _react2.jsx)("div", {
    className: "euiCommentEvent__headerData"
  }, (0, _react2.jsx)("div", {
    className: "euiCommentEvent__headerUsername"
  }, username), (0, _react2.jsx)("div", {
    className: "euiCommentEvent__headerEvent"
  }, event), timestamp ? (0, _react2.jsx)("div", {
    className: "euiCommentEvent__headerTimestamp"
  }, (0, _react2.jsx)("time", null, timestamp)) : undefined), actions ? (0, _react2.jsx)("div", {
    className: "euiCommentEvent__headerActions"
  }, actions) : undefined), children ? (0, _react2.jsx)("div", {
    className: "euiCommentEvent__body"
  }, children) : undefined);
};

exports.EuiCommentEvent = EuiCommentEvent;