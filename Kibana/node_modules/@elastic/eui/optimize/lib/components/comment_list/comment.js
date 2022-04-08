"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiComment = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _comment_event = require("./comment_event");

var _comment_timeline = require("./comment_timeline");

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var typeToClassNameMap = {
  regular: '',
  update: 'euiComment--update'
};

var EuiComment = function EuiComment(_ref) {
  var children = _ref.children,
      className = _ref.className,
      username = _ref.username,
      event = _ref.event,
      actions = _ref.actions,
      timelineIcon = _ref.timelineIcon,
      _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'regular' : _ref$type,
      timestamp = _ref.timestamp,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["children", "className", "username", "event", "actions", "timelineIcon", "type", "timestamp"]);
  var classes = (0, _classnames.default)('euiComment', typeToClassNameMap[type], {
    'euiComment--hasBody': children
  }, className);
  return (0, _react2.jsx)("div", (0, _extends2.default)({
    className: classes
  }, rest), (0, _react2.jsx)(_comment_timeline.EuiCommentTimeline, {
    type: type,
    timelineIcon: timelineIcon
  }), (0, _react2.jsx)(_comment_event.EuiCommentEvent, {
    username: username,
    actions: actions,
    event: event,
    timestamp: timestamp,
    type: type
  }, children));
};

exports.EuiComment = EuiComment;