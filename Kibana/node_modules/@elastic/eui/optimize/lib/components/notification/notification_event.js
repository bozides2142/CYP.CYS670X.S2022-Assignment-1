"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiNotificationEvent = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _notification_event_meta = require("./notification_event_meta");

var _notification_event_messages = require("./notification_event_messages");

var _notification_event_read_button = require("./notification_event_read_button");

var _button = require("../button");

var _link = require("../link");

var _services = require("../../services");

var _notification_event_read_icon = require("./notification_event_read_icon");

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var EuiNotificationEvent = function EuiNotificationEvent(_ref) {
  var id = _ref.id,
      type = _ref.type,
      severity = _ref.severity,
      badgeColor = _ref.badgeColor,
      iconType = _ref.iconType,
      iconAriaLabel = _ref.iconAriaLabel,
      time = _ref.time,
      title = _ref.title,
      isRead = _ref.isRead,
      primaryAction = _ref.primaryAction,
      primaryActionProps = _ref.primaryActionProps,
      messages = _ref.messages,
      onRead = _ref.onRead,
      onOpenContextMenu = _ref.onOpenContextMenu,
      onClickTitle = _ref.onClickTitle,
      onClickPrimaryAction = _ref.onClickPrimaryAction,
      _ref$headingLevel = _ref.headingLevel,
      headingLevel = _ref$headingLevel === void 0 ? 'h2' : _ref$headingLevel;
  var classes = (0, _classnames.default)('euiNotificationEvent', {
    'euiNotificationEvent--withReadState': typeof isRead === 'boolean'
  });
  var classesTitle = (0, _classnames.default)('euiNotificationEvent__title', {
    'euiNotificationEvent__title--isRead': isRead
  });
  var randomHeadingId = (0, _services.useGeneratedHtmlId)();
  var titleProps = {
    id: randomHeadingId,
    className: classesTitle,
    'data-test-subj': "".concat(id, "-notificationEventTitle")
  };
  return (0, _react2.jsx)("article", {
    "aria-labelledby": randomHeadingId,
    className: classes,
    key: id
  }, typeof isRead === 'boolean' && (0, _react2.jsx)("div", {
    className: "euiNotificationEvent__readButton"
  }, !!onRead ? (0, _react2.jsx)(_notification_event_read_button.EuiNotificationEventReadButton, {
    isRead: isRead,
    onClick: function onClick() {
      return onRead(id, isRead);
    },
    eventName: title,
    id: id
  }) : (0, _react2.jsx)(_notification_event_read_icon.EuiNotificationEventReadIcon, {
    id: id,
    isRead: isRead,
    eventName: title
  })), (0, _react2.jsx)("div", {
    className: "euiNotificationEvent__content"
  }, (0, _react2.jsx)(_notification_event_meta.EuiNotificationEventMeta, {
    id: id,
    type: type,
    severity: severity,
    badgeColor: badgeColor,
    iconType: iconType,
    iconAriaLabel: iconAriaLabel,
    time: time,
    onOpenContextMenu: onOpenContextMenu ? function () {
      return onOpenContextMenu(id);
    } : undefined,
    eventName: title
  }), onClickTitle ? (0, _react2.jsx)(_link.EuiLink, (0, _extends2.default)({
    onClick: function onClick() {
      return onClickTitle(id);
    }
  }, titleProps), /*#__PURE__*/(0, _react.createElement)(headingLevel, null, title)) : /*#__PURE__*/(0, _react.createElement)(headingLevel, titleProps, title), (0, _react2.jsx)(_notification_event_messages.EuiNotificationEventMessages, {
    messages: messages,
    eventName: title
  }), onClickPrimaryAction && primaryAction && (0, _react2.jsx)("div", {
    className: "euiNotificationEvent__primaryAction"
  }, (0, _react2.jsx)(_button.EuiButtonEmpty, (0, _extends2.default)({
    flush: "left",
    size: "s"
  }, primaryActionProps, {
    onClick: function onClick() {
      return onClickPrimaryAction === null || onClickPrimaryAction === void 0 ? void 0 : onClickPrimaryAction(id);
    },
    "data-test-subj": "".concat(id, "-notificationEventPrimaryAction")
  }), primaryAction))));
};

exports.EuiNotificationEvent = EuiNotificationEvent;