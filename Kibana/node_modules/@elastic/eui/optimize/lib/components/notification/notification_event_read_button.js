"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiNotificationEventReadButton = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _button = require("../button");

var _i18n = require("../i18n");

var _classnames = _interopRequireDefault(require("classnames"));

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var EuiNotificationEventReadButton = function EuiNotificationEventReadButton(_ref) {
  var id = _ref.id,
      isRead = _ref.isRead,
      onClick = _ref.onClick,
      eventName = _ref.eventName,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["id", "isRead", "onClick", "eventName"]);
  var classesReadState = (0, _classnames.default)('euiNotificationEventReadButton', {
    'euiNotificationEventReadButton--isRead': isRead
  });
  var markAsReadAria = (0, _i18n.useEuiI18n)('euiNotificationEventReadButton.markAsReadAria', 'Mark {eventName} as read', {
    eventName: eventName
  });
  var markAsUnreadAria = (0, _i18n.useEuiI18n)('euiNotificationEventReadButton.markAsUnreadAria', 'Mark {eventName} as unread', {
    eventName: eventName
  });
  var markAsRead = (0, _i18n.useEuiI18n)('euiNotificationEventReadButton.markAsRead', 'Mark as read');
  var markAsUnread = (0, _i18n.useEuiI18n)('euiNotificationEventReadButton.markAsUnread', 'Mark as unread');
  var buttonAriaLabel = isRead ? markAsUnreadAria : markAsReadAria;
  var buttonTitle = isRead ? markAsUnread : markAsRead;
  return (0, _react2.jsx)(_button.EuiButtonIcon, (0, _extends2.default)({
    iconType: "dot",
    "aria-label": buttonAriaLabel,
    title: buttonTitle,
    className: classesReadState,
    onClick: onClick,
    "data-test-subj": "".concat(id, "-notificationEventReadButton")
  }, rest));
};

exports.EuiNotificationEventReadButton = EuiNotificationEventReadButton;