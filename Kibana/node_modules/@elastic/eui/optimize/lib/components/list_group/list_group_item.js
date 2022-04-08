"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiListGroupItem = exports.COLORS = exports.SIZES = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _button = require("../button");

var _icon = require("../icon");

var _tool_tip = require("../tool_tip");

var _inner_text = require("../inner_text");

var _services = require("../../services");

var _href_validator = require("../../services/security/href_validator");

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var sizeToClassNameMap = {
  xs: 'euiListGroupItem--xSmall',
  s: 'euiListGroupItem--small',
  m: 'euiListGroupItem--medium',
  l: 'euiListGroupItem--large'
};
var SIZES = Object.keys(sizeToClassNameMap);
exports.SIZES = SIZES;
var colorToClassNameMap = {
  inherit: '',
  primary: 'euiListGroupItem--primary',
  text: 'euiListGroupItem--text',
  subdued: 'euiListGroupItem--subdued',
  ghost: 'euiListGroupItem--ghost'
};
var COLORS = Object.keys(colorToClassNameMap);
exports.COLORS = COLORS;

var EuiListGroupItem = function EuiListGroupItem(_ref) {
  var label = _ref.label,
      _ref$isActive = _ref.isActive,
      isActive = _ref$isActive === void 0 ? false : _ref$isActive,
      _ref$isDisabled = _ref.isDisabled,
      _isDisabled = _ref$isDisabled === void 0 ? false : _ref$isDisabled,
      href = _ref.href,
      target = _ref.target,
      rel = _ref.rel,
      className = _ref.className,
      iconType = _ref.iconType,
      icon = _ref.icon,
      iconProps = _ref.iconProps,
      extraAction = _ref.extraAction,
      onClick = _ref.onClick,
      _ref$size = _ref.size,
      size = _ref$size === void 0 ? 'm' : _ref$size,
      _ref$color = _ref.color,
      color = _ref$color === void 0 ? 'inherit' : _ref$color,
      _ref$showToolTip = _ref.showToolTip,
      showToolTip = _ref$showToolTip === void 0 ? false : _ref$showToolTip,
      wrapText = _ref.wrapText,
      buttonRef = _ref.buttonRef,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["label", "isActive", "isDisabled", "href", "target", "rel", "className", "iconType", "icon", "iconProps", "extraAction", "onClick", "size", "color", "showToolTip", "wrapText", "buttonRef"]);

  var isHrefValid = !href || (0, _href_validator.validateHref)(href);
  var isDisabled = _isDisabled || !isHrefValid;
  var classes = (0, _classnames.default)('euiListGroupItem', sizeToClassNameMap[size], colorToClassNameMap[color], {
    'euiListGroupItem-isActive': isActive,
    'euiListGroupItem-isDisabled': isDisabled,
    'euiListGroupItem-isClickable': href || onClick,
    'euiListGroupItem-hasExtraAction': extraAction,
    'euiListGroupItem--wrapText': wrapText
  }, className);
  var iconNode;

  if (iconType) {
    iconNode = (0, _react2.jsx)(_icon.EuiIcon, (0, _extends2.default)({
      color: "inherit" // forces the icon to inherit its parent color

    }, iconProps, {
      type: iconType,
      className: (0, _classnames.default)('euiListGroupItem__icon', iconProps === null || iconProps === void 0 ? void 0 : iconProps.className)
    }));

    if (icon) {
      console.warn('Both `iconType` and `icon` were passed to EuiListGroupItem but only one can exist. The `iconType` was used.');
    }
  } else if (icon) {
    iconNode = /*#__PURE__*/_react.default.cloneElement(icon, {
      className: (0, _classnames.default)('euiListGroupItem__icon', icon.props.className)
    });
  }

  var extraActionNode;

  if (extraAction) {
    var _iconType = extraAction.iconType,
        alwaysShow = extraAction.alwaysShow,
        _className = extraAction.className,
        actionIsDisabled = extraAction.isDisabled,
        _rest = (0, _objectWithoutProperties2.default)(extraAction, ["iconType", "alwaysShow", "className", "isDisabled"]);

    var extraActionClasses = (0, _classnames.default)('euiListGroupItem__extraAction', {
      'euiListGroupItem__extraAction-alwaysShow': alwaysShow
    }, _className);
    extraActionNode = (0, _react2.jsx)(_button.EuiButtonIcon, (0, _extends2.default)({
      className: extraActionClasses,
      iconType: _iconType
    }, _rest, {
      disabled: isDisabled || actionIsDisabled
    }));
  } // Only add the label as the title attribute if it's possibly truncated
  // Also ensure the value of the title attribute is a string


  var _useInnerText = (0, _inner_text.useInnerText)(),
      _useInnerText2 = (0, _slicedToArray2.default)(_useInnerText, 2),
      ref = _useInnerText2[0],
      innerText = _useInnerText2[1];

  var shouldRenderTitle = !wrapText && !showToolTip;
  var labelContent = shouldRenderTitle ? (0, _react2.jsx)("span", {
    ref: ref,
    className: "euiListGroupItem__label",
    title: typeof label === 'string' ? label : innerText
  }, label) : (0, _react2.jsx)("span", {
    className: "euiListGroupItem__label"
  }, label); // Handle the variety of interaction behavior

  var itemContent;
  var secureRel = (0, _services.getSecureRelForTarget)({
    href: href,
    rel: rel,
    target: target
  });

  if (href && !isDisabled) {
    itemContent = (0, _react2.jsx)("a", (0, _extends2.default)({
      className: "euiListGroupItem__button",
      href: href,
      target: target,
      rel: secureRel,
      onClick: onClick
    }, rest), iconNode, labelContent);
  } else if (href && isDisabled || onClick) {
    itemContent = (0, _react2.jsx)("button", (0, _extends2.default)({
      type: "button",
      className: "euiListGroupItem__button",
      disabled: isDisabled,
      onClick: onClick,
      ref: buttonRef
    }, rest), iconNode, labelContent);
  } else {
    itemContent = (0, _react2.jsx)("span", (0, _extends2.default)({
      className: "euiListGroupItem__text"
    }, rest), iconNode, labelContent);
  }

  if (showToolTip) {
    itemContent = (0, _react2.jsx)("li", {
      className: classes
    }, (0, _react2.jsx)(_tool_tip.EuiToolTip, {
      anchorClassName: "euiListGroupItem__tooltip",
      content: label,
      position: "right",
      delay: "long"
    }, itemContent));
  } else {
    itemContent = (0, _react2.jsx)("li", {
      className: classes
    }, itemContent, extraActionNode);
  }

  return (0, _react2.jsx)(_react.Fragment, null, itemContent);
};

exports.EuiListGroupItem = EuiListGroupItem;