"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiToast = exports.COLORS = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _common = require("../common");

var _accessibility = require("../accessibility");

var _i18n = require("../i18n");

var _icon = require("../icon");

var _text = require("../text");

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var colorToClassNameMap = {
  primary: 'euiToast--primary',
  success: 'euiToast--success',
  warning: 'euiToast--warning',
  danger: 'euiToast--danger'
};
var COLORS = (0, _common.keysOf)(colorToClassNameMap);
exports.COLORS = COLORS;

var EuiToast = function EuiToast(_ref) {
  var title = _ref.title,
      color = _ref.color,
      iconType = _ref.iconType,
      onClose = _ref.onClose,
      children = _ref.children,
      className = _ref.className,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["title", "color", "iconType", "onClose", "children", "className"]);
  var classes = (0, _classnames.default)('euiToast', color ? colorToClassNameMap[color] : null, className);
  var headerClasses = (0, _classnames.default)('euiToastHeader', {
    'euiToastHeader--withBody': children
  });
  var headerIcon;

  if (iconType) {
    headerIcon = (0, _react2.jsx)(_icon.EuiIcon, {
      className: "euiToastHeader__icon",
      type: iconType,
      size: "m",
      "aria-hidden": "true"
    });
  }

  var closeButton;

  if (onClose) {
    closeButton = (0, _react2.jsx)(_i18n.EuiI18n, {
      token: "euiToast.dismissToast",
      default: "Dismiss toast"
    }, function (dismissToast) {
      return (0, _react2.jsx)("button", {
        type: "button",
        className: "euiToast__closeButton",
        "aria-label": dismissToast,
        onClick: onClose,
        "data-test-subj": "toastCloseButton"
      }, (0, _react2.jsx)(_icon.EuiIcon, {
        type: "cross",
        size: "m",
        "aria-hidden": "true"
      }));
    });
  }

  var optionalBody;

  if (children) {
    optionalBody = (0, _react2.jsx)(_text.EuiText, {
      size: "s",
      className: "euiToastBody"
    }, children);
  }

  return (0, _react2.jsx)("div", (0, _extends2.default)({
    className: classes
  }, rest), (0, _react2.jsx)(_accessibility.EuiScreenReaderOnly, null, (0, _react2.jsx)("p", null, (0, _react2.jsx)(_i18n.EuiI18n, {
    token: "euiToast.newNotification",
    default: "A new notification appears"
  }))), (0, _react2.jsx)(_i18n.EuiI18n, {
    token: "euiToast.notification",
    default: "Notification"
  }, function (notification) {
    return (0, _react2.jsx)("div", {
      className: headerClasses,
      "aria-label": notification,
      "data-test-subj": "euiToastHeader"
    }, headerIcon, (0, _react2.jsx)("span", {
      className: "euiToastHeader__title"
    }, title));
  }), closeButton, optionalBody);
};

exports.EuiToast = EuiToast;