"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkValidColor = exports.EuiAvatar = exports.TYPES = exports.SIZES = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _common = require("../common");

var _classnames = _interopRequireDefault(require("classnames"));

var _color = require("../../services/color");

var _services = require("../../services");

var _icon = require("../icon");

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var sizeToClassNameMap = {
  s: 'euiAvatar--s',
  m: 'euiAvatar--m',
  l: 'euiAvatar--l',
  xl: 'euiAvatar--xl'
};
var SIZES = (0, _common.keysOf)(sizeToClassNameMap);
exports.SIZES = SIZES;
var typeToClassNameMap = {
  space: 'euiAvatar--space',
  user: 'euiAvatar--user'
};
var TYPES = (0, _common.keysOf)(typeToClassNameMap);
exports.TYPES = TYPES;

var EuiAvatar = function EuiAvatar(_ref) {
  var className = _ref.className,
      color = _ref.color,
      imageUrl = _ref.imageUrl,
      initials = _ref.initials,
      initialsLength = _ref.initialsLength,
      iconType = _ref.iconType,
      iconSize = _ref.iconSize,
      iconColor = _ref.iconColor,
      name = _ref.name,
      _ref$size = _ref.size,
      size = _ref$size === void 0 ? 'm' : _ref$size,
      _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'user' : _ref$type,
      _ref$isDisabled = _ref.isDisabled,
      isDisabled = _ref$isDisabled === void 0 ? false : _ref$isDisabled,
      style = _ref.style,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["className", "color", "imageUrl", "initials", "initialsLength", "iconType", "iconSize", "iconColor", "name", "size", "type", "isDisabled", "style"]);
  var visColors = (0, _services.euiPaletteColorBlindBehindText)();
  var classes = (0, _classnames.default)('euiAvatar', sizeToClassNameMap[size], typeToClassNameMap[type], {
    'euiAvatar-isDisabled': isDisabled,
    'euiAvatar--plain': color === 'plain'
  }, className);
  checkValidInitials(initials);
  var avatarStyle = style || {};
  var iconCustomColor = iconColor;
  var isNamedColor = color === 'plain' || color === null;

  if (!isNamedColor) {
    checkValidColor(color);
    var assignedColor = color || visColors[Math.floor(name.length % visColors.length)];
    var textColor = _color.isColorDark.apply(void 0, (0, _toConsumableArray2.default)((0, _color.hexToRgb)(assignedColor))) ? '#FFFFFF' : '#000000';
    avatarStyle.backgroundColor = assignedColor;
    avatarStyle.color = textColor; // Allow consumers to let the icons keep their default color (like app icons)
    // when passing `iconColor = null`, otherwise continue to pass on `iconColor` or adjust with textColor

    iconCustomColor = iconColor || iconColor === null ? iconColor : textColor;
  }

  if (imageUrl) {
    avatarStyle.backgroundImage = "url(".concat(imageUrl, ")");
  }

  var content;

  if (!imageUrl && !iconType) {
    // Create the initials
    var calculatedInitials = (0, _services.toInitials)(name, initialsLength, initials);
    content = (0, _react2.jsx)("span", {
      "aria-hidden": "true"
    }, calculatedInitials);
  } else if (iconType) {
    content = (0, _react2.jsx)(_icon.EuiIcon, {
      className: "euiAvatar__icon",
      size: iconSize || size,
      type: iconType,
      "aria-label": name,
      color: iconCustomColor === null ? undefined : iconCustomColor
    });
  }

  return (0, _react2.jsx)("div", (0, _extends2.default)({
    className: classes,
    style: avatarStyle,
    "aria-label": isDisabled ? undefined : name,
    role: isDisabled ? 'presentation' : 'img',
    title: name
  }, rest), content);
}; // TODO: Migrate to a service


exports.EuiAvatar = EuiAvatar;

var checkValidColor = function checkValidColor(color) {
  var validHex = color && (0, _color.isValidHex)(color) || color === 'plain';

  if (color && !validHex) {
    throw new Error('EuiAvatar needs to pass a valid color. This can either be a three ' + 'or six character hex value');
  }
};

exports.checkValidColor = checkValidColor;

function checkValidInitials(initials) {
  // Must be a string of 1 or 2 characters
  if (initials && initials.length > 2) {
    console.warn('EuiAvatar only accepts a max of 2 characters for the initials as a string. It is displaying only the first 2 characters.');
  }
}