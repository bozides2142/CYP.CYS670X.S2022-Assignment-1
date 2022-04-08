"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiHeaderLogo = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _icon = require("../icon");

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
var EuiHeaderLogo = function EuiHeaderLogo(_ref) {
  var _ref$iconType = _ref.iconType,
      iconType = _ref$iconType === void 0 ? 'logoElastic' : _ref$iconType,
      _ref$iconTitle = _ref.iconTitle,
      iconTitle = _ref$iconTitle === void 0 ? 'Elastic' : _ref$iconTitle,
      href = _ref.href,
      rel = _ref.rel,
      target = _ref.target,
      children = _ref.children,
      className = _ref.className,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["iconType", "iconTitle", "href", "rel", "target", "children", "className"]);
  var classes = (0, _classnames.default)('euiHeaderLogo', className);
  var secureRel = (0, _services.getSecureRelForTarget)({
    href: href,
    rel: rel,
    target: target
  });
  var isHrefValid = !href || (0, _href_validator.validateHref)(href);
  return (0, _react2.jsx)("a", (0, _extends2.default)({
    href: isHrefValid ? href : '',
    rel: secureRel,
    target: target,
    className: classes
  }, rest), (0, _react2.jsx)(_icon.EuiIcon, {
    "aria-label": iconTitle,
    className: "euiHeaderLogo__icon",
    size: "l",
    type: iconType
  }), children && (0, _react2.jsx)("span", {
    className: "euiHeaderLogo__text"
  }, children));
};

exports.EuiHeaderLogo = EuiHeaderLogo;