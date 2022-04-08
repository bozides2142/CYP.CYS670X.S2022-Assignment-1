"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiSuggestItem = exports.DISPLAYS = exports.COLORS = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

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
var colorToClassNameMap = {
  tint0: 'euiSuggestItem__type--tint0',
  tint1: 'euiSuggestItem__type--tint1',
  tint2: 'euiSuggestItem__type--tint2',
  tint3: 'euiSuggestItem__type--tint3',
  tint4: 'euiSuggestItem__type--tint4',
  tint5: 'euiSuggestItem__type--tint5',
  tint6: 'euiSuggestItem__type--tint6',
  tint7: 'euiSuggestItem__type--tint7',
  tint8: 'euiSuggestItem__type--tint8',
  tint9: 'euiSuggestItem__type--tint9',
  tint10: 'euiSuggestItem__type--tint10'
};
var COLORS = (0, _common.keysOf)(colorToClassNameMap);
exports.COLORS = COLORS;
var labelDisplayToClassMap = {
  fixed: 'euiSuggestItem__labelDisplay--fixed',
  expand: 'euiSuggestItem__labelDisplay--expand'
};
var descriptionDisplayToClassMap = {
  truncate: 'euiSuggestItem__description--truncate',
  wrap: 'euiSuggestItem__description--wrap'
};
var DISPLAYS = (0, _common.keysOf)(labelDisplayToClassMap);
exports.DISPLAYS = DISPLAYS;

var EuiSuggestItem = function EuiSuggestItem(_ref) {
  var className = _ref.className,
      label = _ref.label,
      type = _ref.type,
      _ref$labelDisplay = _ref.labelDisplay,
      labelDisplay = _ref$labelDisplay === void 0 ? 'fixed' : _ref$labelDisplay,
      _ref$labelWidth = _ref.labelWidth,
      labelWidth = _ref$labelWidth === void 0 ? '50' : _ref$labelWidth,
      description = _ref.description,
      _ref$descriptionDispl = _ref.descriptionDisplay,
      descriptionDisplay = _ref$descriptionDispl === void 0 ? 'truncate' : _ref$descriptionDispl,
      onClick = _ref.onClick,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["className", "label", "type", "labelDisplay", "labelWidth", "description", "descriptionDisplay", "onClick"]);
  var classes = (0, _classnames.default)('euiSuggestItem', {
    'euiSuggestItem-isClickable': onClick
  }, className);
  var colorClass = '';
  var labelDisplayCalculated = !description ? 'expand' : labelDisplay;
  var labelClassNames = (0, _classnames.default)('euiSuggestItem__label', labelDisplayToClassMap[labelDisplayCalculated], (0, _defineProperty2.default)({}, "euiSuggestItem__label--width".concat(labelWidth), labelDisplay === 'fixed'));
  var descriptionClassNames = (0, _classnames.default)('euiSuggestItem__description', descriptionDisplayToClassMap[descriptionDisplay]);

  if (type && type.color) {
    if (COLORS.indexOf(type.color) > -1) {
      colorClass = colorToClassNameMap[type.color];
    }
  }

  var innerContent = (0, _react2.jsx)(_react.default.Fragment, null, (0, _react2.jsx)("span", {
    className: "euiSuggestItem__type ".concat(colorClass)
  }, (0, _react2.jsx)(_icon.EuiIcon, {
    type: type.iconType,
    color: "inherit" // forces the icon to inherit its parent color

  })), (0, _react2.jsx)("span", {
    className: labelClassNames
  }, label), description && (0, _react2.jsx)("span", {
    className: descriptionClassNames
  }, description));

  if (onClick) {
    return (0, _react2.jsx)("button", (0, _extends2.default)({
      onClick: onClick,
      className: classes
    }, rest), innerContent);
  } else {
    return (0, _react2.jsx)("div", (0, _extends2.default)({
      className: classes
    }, rest), innerContent);
  }
};

exports.EuiSuggestItem = EuiSuggestItem;