"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiCommentTimeline = exports.TYPES = void 0;

var _react = _interopRequireDefault(require("react"));

var _common = require("../common");

var _classnames = _interopRequireDefault(require("classnames"));

var _icon = require("../icon");

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var typeToClassNameMap = {
  regular: 'euiCommentTimeline__icon--regular',
  update: 'euiCommentTimeline__icon--update'
};
var TYPES = (0, _common.keysOf)(typeToClassNameMap);
exports.TYPES = TYPES;

var EuiCommentTimeline = function EuiCommentTimeline(_ref) {
  var className = _ref.className,
      timelineIcon = _ref.timelineIcon,
      _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'regular' : _ref$type;
  var classes = (0, _classnames.default)('euiCommentTimeline', className);
  var iconClasses = (0, _classnames.default)({
    'euiCommentTimeline__icon--default': !timelineIcon || typeof timelineIcon === 'string'
  }, typeToClassNameMap[type]);
  var iconRender;

  if (typeof timelineIcon === 'string') {
    iconRender = (0, _react2.jsx)(_icon.EuiIcon, {
      size: type === 'update' ? 'm' : 'l',
      type: timelineIcon
    });
  } else if (timelineIcon) {
    iconRender = timelineIcon;
  } else {
    iconRender = (0, _react2.jsx)(_icon.EuiIcon, {
      type: type === 'update' ? 'dot' : 'user',
      size: type === 'update' ? 's' : 'l'
    });
  }

  return (0, _react2.jsx)("div", {
    className: classes
  }, (0, _react2.jsx)("div", {
    className: "euiCommentTimeline__content"
  }, (0, _react2.jsx)("div", {
    className: iconClasses
  }, iconRender)));
};

exports.EuiCommentTimeline = EuiCommentTimeline;