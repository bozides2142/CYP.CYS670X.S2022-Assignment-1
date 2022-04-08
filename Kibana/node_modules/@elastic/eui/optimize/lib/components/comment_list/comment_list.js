"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiCommentList = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _comment = require("./comment");

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var EuiCommentList = function EuiCommentList(_ref) {
  var children = _ref.children,
      className = _ref.className,
      comments = _ref.comments,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["children", "className", "comments"]);
  var classes = (0, _classnames.default)('euiCommentList', className);
  var commentElements = null;

  if (comments) {
    commentElements = comments.map(function (item, index) {
      return (0, _react2.jsx)(_comment.EuiComment, (0, _extends2.default)({
        key: index
      }, item));
    });
  }

  return (0, _react2.jsx)("div", (0, _extends2.default)({
    className: classes
  }, rest), commentElements, children);
};

exports.EuiCommentList = EuiCommentList;