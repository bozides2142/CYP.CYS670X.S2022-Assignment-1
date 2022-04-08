"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiColorPaletteDisplayFixed = void 0;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _utils = require("../utils");

var _screen_reader = require("../../accessibility/screen_reader");

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var EuiColorPaletteDisplayFixed = function EuiColorPaletteDisplayFixed(_ref) {
  var palette = _ref.palette,
      title = _ref.title,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["palette", "title"]);
  var fixedGradient = (0, _utils.getFixedLinearGradient)(palette);
  var paletteStops = fixedGradient.map(function (item, index) {
    return (0, _react2.jsx)("span", {
      style: {
        backgroundColor: item.color,
        width: item.width
      },
      key: "".concat(item.color, "-").concat(index)
    });
  });
  return (0, _react2.jsx)("span", rest, title && (0, _react2.jsx)(_screen_reader.EuiScreenReaderOnly, null, (0, _react2.jsx)("span", null, title)), (0, _react2.jsx)("span", {
    // aria-hidden="true" is to ensure color blocks are ignored by screen readers,
    // and the only accessible text for options is the EuiScreenReaderOnly {title}
    "aria-hidden": "true",
    className: "euiColorPaletteDisplayFixed__bleedArea"
  }, paletteStops));
};

exports.EuiColorPaletteDisplayFixed = EuiColorPaletteDisplayFixed;