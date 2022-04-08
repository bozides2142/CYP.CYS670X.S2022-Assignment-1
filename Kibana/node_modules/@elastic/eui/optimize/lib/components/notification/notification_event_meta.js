"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiNotificationEventMeta = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _icon = require("../icon");

var _badge = require("../badge");

var _popover = require("../popover");

var _button = require("../button");

var _context_menu = require("../context_menu");

var _i18n = require("../i18n");

var _services = require("../../services");

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var EuiNotificationEventMeta = function EuiNotificationEventMeta(_ref) {
  var id = _ref.id,
      iconType = _ref.iconType,
      type = _ref.type,
      time = _ref.time,
      _ref$badgeColor = _ref.badgeColor,
      badgeColor = _ref$badgeColor === void 0 ? 'hollow' : _ref$badgeColor,
      severity = _ref.severity,
      eventName = _ref.eventName,
      iconAriaLabel = _ref.iconAriaLabel,
      onOpenContextMenu = _ref.onOpenContextMenu;

  var _useState = (0, _react.useState)(false),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      isPopoverOpen = _useState2[0],
      setIsPopoverOpen = _useState2[1];

  var classes = (0, _classnames.default)('euiNotificationEventMeta', {
    'euiNotificationEventMeta--hasContextMenu': onOpenContextMenu
  });

  var _useState3 = (0, _react.useState)([]),
      _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
      contextMenuItems = _useState4[0],
      setContextMenuItems = _useState4[1];

  var randomPopoverId = (0, _services.useGeneratedHtmlId)();
  var ariaAttribute = iconAriaLabel ? {
    'aria-label': iconAriaLabel
  } : {
    'aria-hidden': true
  };

  var onOpenPopover = function onOpenPopover() {
    setIsPopoverOpen(!isPopoverOpen);

    if (onOpenContextMenu) {
      setContextMenuItems(onOpenContextMenu());
    }
  };

  return (0, _react2.jsx)("div", {
    className: classes
  }, (0, _react2.jsx)("div", {
    className: "euiNotificationEventMeta__section"
  }, iconType && (0, _react2.jsx)(_icon.EuiIcon, (0, _extends2.default)({
    className: "euiNotificationEventMeta__icon",
    type: iconType
  }, ariaAttribute)), type && (0, _react2.jsx)(_badge.EuiBadge, {
    className: "euiNotificationEventMeta__badge",
    color: badgeColor
  }, severity ? "".concat(type, ": ").concat(severity) : type)), (0, _react2.jsx)("div", {
    className: "euiNotificationEventMeta__section"
  }, (0, _react2.jsx)("span", {
    className: "euiNotificationEventMeta__time"
  }, time)), onOpenContextMenu && (0, _react2.jsx)("div", {
    className: "euiNotificationEventMeta__contextMenuWrapper"
  }, (0, _react2.jsx)(_popover.EuiPopover, {
    id: randomPopoverId,
    ownFocus: true,
    repositionOnScroll: true,
    isOpen: isPopoverOpen,
    panelPaddingSize: "none",
    anchorPosition: "leftUp",
    button: (0, _react2.jsx)(_i18n.EuiI18n, {
      token: "euiNotificationEventMeta.contextMenuButton",
      default: "Menu for {eventName}",
      values: {
        eventName: eventName
      }
    }, function (contextMenuButton) {
      return (0, _react2.jsx)(_button.EuiButtonIcon, {
        "aria-label": contextMenuButton,
        "aria-controls": randomPopoverId,
        "aria-expanded": isPopoverOpen,
        "aria-haspopup": "true",
        iconType: "boxesVertical",
        color: "text",
        onClick: onOpenPopover,
        "data-test-subj": "".concat(id, "-notificationEventMetaButton")
      });
    }),
    closePopover: function closePopover() {
      return setIsPopoverOpen(false);
    }
  }, (0, _react2.jsx)("div", {
    onClick: function onClick() {
      return setIsPopoverOpen(false);
    }
  }, (0, _react2.jsx)(_context_menu.EuiContextMenuPanel, {
    items: contextMenuItems
  })))));
};

exports.EuiNotificationEventMeta = EuiNotificationEventMeta;