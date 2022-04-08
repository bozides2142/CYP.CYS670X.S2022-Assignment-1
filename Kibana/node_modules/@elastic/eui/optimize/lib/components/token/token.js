"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiToken = exports.COLORS = exports.FILLS = exports.SHAPES = exports.SIZES = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _defaults = _interopRequireDefault(require("lodash/defaults"));

var _classnames = _interopRequireDefault(require("classnames"));

var _common = require("../common");

var _services = require("../../services");

var _icon = require("../icon");

var _token_map = require("./token_map");

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var sizeToClassMap = {
  xs: 'euiToken--xsmall',
  s: 'euiToken--small',
  m: 'euiToken--medium',
  l: 'euiToken--large'
};
var SIZES = (0, _common.keysOf)(sizeToClassMap);
exports.SIZES = SIZES;
var shapeToClassMap = {
  circle: 'euiToken--circle',
  square: 'euiToken--square',
  rectangle: 'euiToken--rectangle'
};
var SHAPES = (0, _common.keysOf)(shapeToClassMap);
exports.SHAPES = SHAPES;
var fillToClassMap = {
  none: null,
  light: 'euiToken--light',
  dark: 'euiToken--dark'
};
var FILLS = (0, _common.keysOf)(fillToClassMap);
exports.FILLS = FILLS;
var colorToClassMap = {
  euiColorVis0: 'euiToken--euiColorVis0',
  euiColorVis1: 'euiToken--euiColorVis1',
  euiColorVis2: 'euiToken--euiColorVis2',
  euiColorVis3: 'euiToken--euiColorVis3',
  euiColorVis4: 'euiToken--euiColorVis4',
  euiColorVis5: 'euiToken--euiColorVis5',
  euiColorVis6: 'euiToken--euiColorVis6',
  euiColorVis7: 'euiToken--euiColorVis7',
  euiColorVis8: 'euiToken--euiColorVis8',
  euiColorVis9: 'euiToken--euiColorVis9',
  gray: 'euiToken--gray'
};
var COLORS = (0, _common.keysOf)(colorToClassMap);
exports.COLORS = COLORS;

var EuiToken = function EuiToken(_ref) {
  var iconType = _ref.iconType,
      color = _ref.color,
      fill = _ref.fill,
      shape = _ref.shape,
      _ref$size = _ref.size,
      size = _ref$size === void 0 ? 's' : _ref$size,
      _ref$style = _ref.style,
      style = _ref$style === void 0 ? {} : _ref$style,
      className = _ref.className,
      title = _ref.title,
      ariaLabel = _ref['aria-label'],
      ariaLabelledby = _ref['aria-labelledby'],
      ariaDescribedby = _ref['aria-describedby'],
      rest = (0, _objectWithoutProperties2.default)(_ref, ["iconType", "color", "fill", "shape", "size", "style", "className", "title", "aria-label", "aria-labelledby", "aria-describedby"]);
  // Set the icon size to the same as the passed size
  // unless they passed `xs` which IconSize doesn't support
  var finalSize = size === 'xs' ? 's' : size; // When displaying at the small size, the token specific icons
  // should actually be displayed at medium size

  if (typeof iconType === 'string' && iconType.indexOf('token') === 0 && size === 's') {
    finalSize = 'm';
  }

  var currentDisplay = {
    color: color,
    fill: fill,
    shape: shape
  };
  var finalDisplay; // If the iconType passed is one of the prefab token types,
  // grab its properties

  if (typeof iconType === 'string' && iconType in _token_map.TOKEN_MAP) {
    var tokenDisplay = _token_map.TOKEN_MAP[iconType];
    finalDisplay = (0, _defaults.default)(currentDisplay, tokenDisplay);
  } else {
    finalDisplay = currentDisplay;
  }

  var finalColor = finalDisplay.color || 'gray';
  var finalShape = finalDisplay.shape || 'circle';
  var finalFill = finalDisplay.fill || 'light'; // Color can be a named space via euiColorVis

  var colorClass;

  if (finalColor in colorToClassMap) {
    colorClass = colorToClassMap[finalColor];
  } // Or it can be a string which adds inline styles for the
  else {
      // text color if fill='none' or
      if (finalFill === 'none') {
        style.color = finalColor;
      } // full background color if fill='dark' and overrides fill='light' with dark
      else {
          finalFill = 'dark';
          style.backgroundColor = finalColor;
          style.color = _services.isColorDark.apply(void 0, (0, _toConsumableArray2.default)((0, _services.hexToRgb)(finalColor))) ? '#FFFFFF' : '#000000';
        }
    }

  var classes = (0, _classnames.default)('euiToken', colorClass, shapeToClassMap[finalShape], fillToClassMap[finalFill], sizeToClassMap[size], className);
  return (0, _react2.jsx)("span", (0, _extends2.default)({
    className: classes,
    style: style
  }, rest), (0, _react2.jsx)(_icon.EuiIcon, {
    type: iconType,
    size: finalSize,
    title: title,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
    "aria-describedby": ariaDescribedby
  }));
};

exports.EuiToken = EuiToken;