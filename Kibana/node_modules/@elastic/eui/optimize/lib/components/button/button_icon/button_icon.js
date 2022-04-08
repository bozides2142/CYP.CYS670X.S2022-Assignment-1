"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiButtonIcon = exports.SIZES = exports.COLORS = exports.DISPLAYS = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _services = require("../../../services");

var _common = require("../../common");

var _icon = require("../../icon");

var _href_validator = require("../../../services/security/href_validator");

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var displayToClassNameMap = {
  base: null,
  empty: 'euiButtonIcon--empty',
  fill: 'euiButtonIcon--fill'
};
var DISPLAYS = (0, _common.keysOf)(displayToClassNameMap);
exports.DISPLAYS = DISPLAYS;
var colorToClassNameMap = {
  accent: 'euiButtonIcon--accent',
  danger: 'euiButtonIcon--danger',
  ghost: 'euiButtonIcon--ghost',
  primary: 'euiButtonIcon--primary',
  success: 'euiButtonIcon--success',
  text: 'euiButtonIcon--text',
  warning: 'euiButtonIcon--warning'
};
var COLORS = (0, _common.keysOf)(colorToClassNameMap);
exports.COLORS = COLORS;
var sizeToClassNameMap = {
  xs: 'euiButtonIcon--xSmall',
  s: 'euiButtonIcon--small',
  m: 'euiButtonIcon--medium'
};
var SIZES = (0, _common.keysOf)(sizeToClassNameMap);
exports.SIZES = SIZES;

var EuiButtonIcon = function EuiButtonIcon(_ref) {
  var className = _ref.className,
      iconType = _ref.iconType,
      _ref$iconSize = _ref.iconSize,
      iconSize = _ref$iconSize === void 0 ? 'm' : _ref$iconSize,
      _ref$color = _ref.color,
      color = _ref$color === void 0 ? 'primary' : _ref$color,
      _isDisabled = _ref.isDisabled,
      disabled = _ref.disabled,
      href = _ref.href,
      _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'button' : _ref$type,
      _ref$display = _ref.display,
      display = _ref$display === void 0 ? 'empty' : _ref$display,
      target = _ref.target,
      rel = _ref.rel,
      _ref$size = _ref.size,
      size = _ref$size === void 0 ? 'xs' : _ref$size,
      buttonRef = _ref.buttonRef,
      isSelected = _ref.isSelected,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["className", "iconType", "iconSize", "color", "isDisabled", "disabled", "href", "type", "display", "target", "rel", "size", "buttonRef", "isSelected"]);
  var isHrefValid = !href || (0, _href_validator.validateHref)(href);
  var isDisabled = _isDisabled || disabled || !isHrefValid;
  var ariaHidden = rest['aria-hidden'];
  var isAriaHidden = ariaHidden === 'true' || ariaHidden === true;

  if (!rest['aria-label'] && !rest['aria-labelledby'] && !isAriaHidden) {
    console.warn("EuiButtonIcon requires aria-label or aria-labelledby to be specified because icon-only\n      buttons are screen-reader-inaccessible without them.");
  }

  var classes = (0, _classnames.default)('euiButtonIcon', {
    'euiButtonIcon-isDisabled': isDisabled
  }, colorToClassNameMap[color], display && displayToClassNameMap[display], size && sizeToClassNameMap[size], className); // Add an icon to the button if one exists.

  var buttonIcon;

  if (iconType) {
    buttonIcon = (0, _react2.jsx)(_icon.EuiIcon, {
      className: "euiButtonIcon__icon",
      type: iconType,
      size: iconSize,
      "aria-hidden": "true",
      color: "inherit" // forces the icon to inherit its parent color

    });
  } // <a> elements don't respect the `disabled` attribute. So if we're disabled, we'll just pretend
  // this is a button and piggyback off its disabled styles.


  if (href && !isDisabled) {
    var secureRel = (0, _services.getSecureRelForTarget)({
      href: href,
      target: target,
      rel: rel
    });
    return (0, _react2.jsx)("a", (0, _extends2.default)({
      tabIndex: isAriaHidden ? -1 : undefined,
      className: classes,
      href: href,
      target: target,
      rel: secureRel,
      ref: buttonRef
    }, rest), buttonIcon);
  }

  var buttonType;
  return (0, _react2.jsx)("button", (0, _extends2.default)({
    tabIndex: isAriaHidden ? -1 : undefined,
    disabled: isDisabled,
    className: classes,
    "aria-pressed": isSelected,
    type: type,
    ref: buttonRef
  }, rest), buttonIcon);
};

exports.EuiButtonIcon = EuiButtonIcon;