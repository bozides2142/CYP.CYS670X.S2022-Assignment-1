"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.euiCardSelectableColor = euiCardSelectableColor;
exports.EuiCardSelect = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _button_empty = require("../button/button_empty");

var _i18n = require("../i18n");

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var EuiCardSelect = function EuiCardSelect(_ref) {
  var className = _ref.className,
      _ref$isSelected = _ref.isSelected,
      isSelected = _ref$isSelected === void 0 ? false : _ref$isSelected,
      isDisabled = _ref.isDisabled,
      color = _ref.color,
      children = _ref.children,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["className", "isSelected", "isDisabled", "color", "children"]);
  var child = euiCardSelectableText(isSelected, isDisabled, children);
  var selectClasses = (0, _classnames.default)('euiCardSelect', "euiCardSelect--".concat(euiCardSelectableColor(color, isSelected)), className);
  return (0, _react2.jsx)(_button_empty.EuiButtonEmpty, (0, _extends2.default)({
    className: selectClasses,
    color: color || 'text',
    size: "xs",
    isDisabled: isDisabled,
    iconType: isSelected ? 'check' : undefined,
    role: "switch",
    "aria-checked": isSelected
  }, rest), child);
};

exports.EuiCardSelect = EuiCardSelect;

function euiCardSelectableText(isSelected, isDisabled, children) {
  if (children) {
    return children;
  }

  var text;

  if (isSelected) {
    text = (0, _react2.jsx)(_i18n.EuiI18n, {
      token: "euiCardSelect.selected",
      default: "Selected"
    });
  } else if (isDisabled) {
    text = (0, _react2.jsx)(_i18n.EuiI18n, {
      token: "euiCardSelect.unavailable",
      default: "Unavailable"
    });
  } else {
    text = (0, _react2.jsx)(_i18n.EuiI18n, {
      token: "euiCardSelect.select",
      default: "Select"
    });
  }

  return text;
}

function euiCardSelectableColor(color, isSelected) {
  var calculatedColor;

  if (color) {
    calculatedColor = color;
  } else if (isSelected) {
    calculatedColor = 'success';
  } else {
    calculatedColor = 'text';
  }

  return calculatedColor;
}