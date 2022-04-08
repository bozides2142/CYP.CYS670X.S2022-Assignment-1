"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiBetaBadge = exports.SIZES = exports.sizeToClassMap = exports.COLORS = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _common = require("../../common");

var _services = require("../../../services");

var _tool_tip = require("../../tool_tip");

var _icon = require("../../icon");

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var colorToClassMap = {
  accent: 'euiBetaBadge--accent',
  subdued: 'euiBetaBadge--subdued',
  hollow: 'euiBetaBadge--hollow'
};
var COLORS = (0, _common.keysOf)(colorToClassMap);
exports.COLORS = COLORS;
var sizeToClassMap = {
  s: 'euiBetaBadge--small',
  m: null
};
exports.sizeToClassMap = sizeToClassMap;
var SIZES = (0, _common.keysOf)(sizeToClassMap);
exports.SIZES = SIZES;

var EuiBetaBadge = function EuiBetaBadge(_ref) {
  var className = _ref.className,
      label = _ref.label,
      _ref$color = _ref.color,
      color = _ref$color === void 0 ? 'hollow' : _ref$color,
      tooltipContent = _ref.tooltipContent,
      _ref$tooltipPosition = _ref.tooltipPosition,
      tooltipPosition = _ref$tooltipPosition === void 0 ? 'top' : _ref$tooltipPosition,
      title = _ref.title,
      iconType = _ref.iconType,
      onClick = _ref.onClick,
      onClickAriaLabel = _ref.onClickAriaLabel,
      href = _ref.href,
      rel = _ref.rel,
      target = _ref.target,
      _ref$size = _ref.size,
      size = _ref$size === void 0 ? 'm' : _ref$size,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["className", "label", "color", "tooltipContent", "tooltipPosition", "title", "iconType", "onClick", "onClickAriaLabel", "href", "rel", "target", "size"]);
  var singleLetter = false;

  if (typeof label === 'string' && label.length === 1) {
    singleLetter = true;
  }

  var classes = (0, _classnames.default)('euiBetaBadge', {
    'euiBetaBadge--iconOnly': iconType,
    'euiBetaBadge--singleLetter': singleLetter,
    'euiBetaBadge-isClickable': onClick || href
  }, colorToClassMap[color], sizeToClassMap[size], className);
  var icon;

  if (iconType) {
    icon = (0, _react2.jsx)(_icon.EuiIcon, {
      className: "euiBetaBadge__icon",
      type: iconType,
      size: size === 'm' ? 'm' : 's',
      "aria-hidden": "true",
      color: "inherit" // forces the icon to inherit its parent color

    });
  }

  var Element = href ? 'a' : 'button';
  var relObj = {};

  if (href) {
    relObj.href = href;
    relObj.target = target;
    relObj.rel = (0, _services.getSecureRelForTarget)({
      href: href,
      target: target,
      rel: rel
    });
  }

  if (onClick) {
    relObj.onClick = onClick;
  }

  var content;

  if (onClick || href) {
    content = (0, _react2.jsx)(Element, (0, _extends2.default)({
      "aria-label": onClickAriaLabel,
      className: classes,
      title: typeof label === 'string' ? label : title
    }, relObj, rest), icon || label);

    if (tooltipContent) {
      return (0, _react2.jsx)(_tool_tip.EuiToolTip, {
        position: tooltipPosition,
        content: tooltipContent,
        title: title || label
      }, content);
    } else {
      return (0, _react2.jsx)(_react.Fragment, null, content);
    }
  } else {
    if (tooltipContent) {
      return (0, _react2.jsx)(_tool_tip.EuiToolTip, {
        position: tooltipPosition,
        content: tooltipContent,
        title: title || label
      }, (0, _react2.jsx)("span", (0, _extends2.default)({
        tabIndex: 0,
        className: classes,
        role: "button"
      }, rest), icon || label));
    } else {
      var spanTitle = title || label;

      if (spanTitle && typeof spanTitle !== 'string') {
        console.warn("Only string titles are permitted on badges that do not use tooltips. Found: ".concat((0, _typeof2.default)(spanTitle)));
      }

      return (0, _react2.jsx)("span", (0, _extends2.default)({
        className: classes,
        title: spanTitle
      }, rest), icon || label);
    }
  }
};

exports.EuiBetaBadge = EuiBetaBadge;