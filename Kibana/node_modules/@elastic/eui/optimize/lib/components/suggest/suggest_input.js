"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiSuggestInput = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _form = require("../form");

var _tool_tip = require("../tool_tip");

var _icon = require("../icon");

var _popover = require("../popover");

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
var statusMap = {
  unsaved: {
    icon: 'dot',
    color: 'accent',
    tooltip: 'Changes have not been saved.'
  },
  saved: {
    icon: 'checkInCircleFilled',
    color: 'success',
    tooltip: 'Saved.'
  },
  unchanged: {
    icon: '',
    color: 'success'
  },
  loading: {}
};

var EuiSuggestInput = function EuiSuggestInput(props) {
  var _useState = (0, _react.useState)(''),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      value = _useState2[0],
      setValue = _useState2[1];

  var _useState3 = (0, _react.useState)(false),
      _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
      isPopoverOpen = _useState4[0],
      setIsPopoverOpen = _useState4[1];

  var className = props.className,
      _props$status = props.status,
      status = _props$status === void 0 ? 'unchanged' : _props$status,
      append = props.append,
      tooltipContent = props.tooltipContent,
      suggestions = props.suggestions,
      sendValue = props.sendValue,
      rest = (0, _objectWithoutProperties2.default)(props, ["className", "status", "append", "tooltipContent", "suggestions", "sendValue"]);

  var onFieldChange = function onFieldChange(e) {
    setValue(e.target.value);
    setIsPopoverOpen(e.target.value !== '' ? true : false);
    if (sendValue) sendValue(e.target.value);
  };

  var closePopover = function closePopover() {
    setIsPopoverOpen(false);
  };

  var icon = '';
  var color = '';

  if (statusMap[status]) {
    icon = statusMap[status].icon || '';
    color = statusMap[status].color || '';
  }

  var classes = (0, _classnames.default)('euiSuggestInput', className); // EuiFieldText's append accepts an array of elements so start by creating an empty array

  var appendArray = [];
  var statusElement = (status === 'saved' || status === 'unsaved') && (0, _react2.jsx)(_tool_tip.EuiToolTip, {
    position: "left",
    content: tooltipContent || statusMap[status].tooltip
  }, (0, _react2.jsx)(_icon.EuiIcon, {
    className: "euiSuggestInput__statusIcon",
    color: color,
    type: icon
  })); // Push the status element to the array if it is not undefined

  if (statusElement) appendArray.push(statusElement); // Check to see if consumer passed an append item and if so, add it to the array

  if (append) appendArray.push(append);
  var customInput = (0, _react2.jsx)(_form.EuiFieldText, (0, _extends2.default)({
    value: value,
    fullWidth: true,
    append: appendArray.length ? appendArray : undefined,
    isLoading: status === 'loading' ? true : false,
    onChange: onFieldChange
  }, rest));
  return (0, _react2.jsx)(_popover.EuiInputPopover, {
    className: classes,
    input: customInput,
    isOpen: suggestions.length > 0 && isPopoverOpen,
    panelPaddingSize: "none",
    fullWidth: true,
    closePopover: closePopover
  }, suggestions);
};

exports.EuiSuggestInput = EuiSuggestInput;