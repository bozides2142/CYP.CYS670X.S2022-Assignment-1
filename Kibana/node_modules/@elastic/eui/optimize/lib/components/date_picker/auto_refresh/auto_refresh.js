"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiAutoRefreshButton = exports.EuiAutoRefresh = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _form = require("../../form");

var _button_empty = require("../../button/button_empty/button_empty");

var _popover = require("../../popover");

var _i18n = require("../../i18n");

var _pretty_interval = require("../super_date_picker/pretty_interval");

var _refresh_interval = require("./refresh_interval");

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var EuiAutoRefresh = function EuiAutoRefresh(_ref) {
  var className = _ref.className,
      onRefreshChange = _ref.onRefreshChange,
      isDisabled = _ref.isDisabled,
      _ref$isPaused = _ref.isPaused,
      isPaused = _ref$isPaused === void 0 ? true : _ref$isPaused,
      _ref$refreshInterval = _ref.refreshInterval,
      refreshInterval = _ref$refreshInterval === void 0 ? 1000 : _ref$refreshInterval,
      _ref$readOnly = _ref.readOnly,
      readOnly = _ref$readOnly === void 0 ? true : _ref$readOnly,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["className", "onRefreshChange", "isDisabled", "isPaused", "refreshInterval", "readOnly"]);
  var classes = (0, _classnames.default)('euiAutoRefresh', className);

  var _useState = (0, _react.useState)(false),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      isPopoverOpen = _useState2[0],
      setIsPopoverOpen = _useState2[1];

  var autoRefeshLabel = (0, _i18n.useEuiI18n)('euiAutoRefresh.autoRefreshLabel', 'Auto refresh');
  return (0, _react2.jsx)(_popover.EuiInputPopover, {
    className: classes,
    fullWidth: rest.fullWidth,
    input: (0, _react2.jsx)(_form.EuiFieldText, (0, _extends2.default)({
      "aria-label": autoRefeshLabel,
      onClick: function onClick() {
        return setIsPopoverOpen(function (isOpen) {
          return !isOpen;
        });
      },
      prepend: (0, _react2.jsx)(_button_empty.EuiButtonEmpty, {
        className: "euiFormControlLayout__prepend",
        onClick: function onClick() {
          return setIsPopoverOpen(function (isOpen) {
            return !isOpen;
          });
        },
        size: "s",
        color: "text",
        iconType: "timeRefresh",
        isDisabled: isDisabled
      }, (0, _react2.jsx)("strong", null, (0, _react2.jsx)("small", null, autoRefeshLabel))),
      readOnly: readOnly,
      disabled: isDisabled,
      value: (0, _pretty_interval.prettyInterval)(Boolean(isPaused), refreshInterval)
    }, rest)),
    isOpen: isPopoverOpen,
    closePopover: function closePopover() {
      setIsPopoverOpen(false);
    }
  }, (0, _react2.jsx)(_refresh_interval.EuiRefreshInterval, {
    onRefreshChange: onRefreshChange,
    isPaused: isPaused,
    refreshInterval: refreshInterval
  }));
};

exports.EuiAutoRefresh = EuiAutoRefresh;

var EuiAutoRefreshButton = function EuiAutoRefreshButton(_ref2) {
  var className = _ref2.className,
      onRefreshChange = _ref2.onRefreshChange,
      isDisabled = _ref2.isDisabled,
      _ref2$isPaused = _ref2.isPaused,
      isPaused = _ref2$isPaused === void 0 ? true : _ref2$isPaused,
      _ref2$refreshInterval = _ref2.refreshInterval,
      refreshInterval = _ref2$refreshInterval === void 0 ? 1000 : _ref2$refreshInterval,
      _ref2$shortHand = _ref2.shortHand,
      shortHand = _ref2$shortHand === void 0 ? false : _ref2$shortHand,
      _ref2$size = _ref2.size,
      size = _ref2$size === void 0 ? 's' : _ref2$size,
      _ref2$color = _ref2.color,
      color = _ref2$color === void 0 ? 'text' : _ref2$color,
      rest = (0, _objectWithoutProperties2.default)(_ref2, ["className", "onRefreshChange", "isDisabled", "isPaused", "refreshInterval", "shortHand", "size", "color"]);

  var _useState3 = (0, _react.useState)(false),
      _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
      isPopoverOpen = _useState4[0],
      setIsPopoverOpen = _useState4[1];

  var classes = (0, _classnames.default)('euiAutoRefreshButton', className);
  var autoRefeshLabelOff = (0, _i18n.useEuiI18n)('euiAutoRefresh.buttonLabelOff', 'Auto refresh is off');
  var autoRefeshLabelOn = (0, _i18n.useEuiI18n)('euiAutoRefresh.buttonLabelOn', 'Auto refresh is on and set to {prettyInterval}', {
    prettyInterval: (0, _pretty_interval.prettyInterval)(Boolean(isPaused), refreshInterval)
  });
  return (0, _react2.jsx)(_popover.EuiPopover, {
    button: (0, _react2.jsx)(_button_empty.EuiButtonEmpty, (0, _extends2.default)({
      onClick: function onClick() {
        return setIsPopoverOpen(function (isOpen) {
          return !isOpen;
        });
      },
      className: classes,
      size: size,
      color: color,
      iconType: "timeRefresh",
      title: isPaused ? autoRefeshLabelOff : autoRefeshLabelOn,
      isDisabled: isDisabled
    }, rest), (0, _pretty_interval.prettyInterval)(Boolean(isPaused), refreshInterval, shortHand)),
    isOpen: isPopoverOpen,
    closePopover: function closePopover() {
      setIsPopoverOpen(false);
    }
  }, (0, _react2.jsx)(_refresh_interval.EuiRefreshInterval, {
    onRefreshChange: onRefreshChange,
    isPaused: isPaused,
    refreshInterval: refreshInterval
  }));
};

exports.EuiAutoRefreshButton = EuiAutoRefreshButton;