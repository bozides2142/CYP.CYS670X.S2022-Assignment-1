"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiCode = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireWildcard(require("react"));

var _refractor = require("refractor");

var _classnames = _interopRequireDefault(require("classnames"));

var _utils = require("./utils");

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var EuiCode = function EuiCode(_ref) {
  var _ref$transparentBackg = _ref.transparentBackground,
      transparentBackground = _ref$transparentBackg === void 0 ? false : _ref$transparentBackg,
      _ref$language = _ref.language,
      _language = _ref$language === void 0 ? _utils.DEFAULT_LANGUAGE : _ref$language,
      children = _ref.children,
      className = _ref.className,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["transparentBackground", "language", "children", "className"]);

  var language = (0, _react.useMemo)(function () {
    return (0, _utils.checkSupportedLanguage)(_language);
  }, [_language]);
  var data = (0, _react.useMemo)(function () {
    if (typeof children !== 'string') {
      return [];
    }

    return (0, _refractor.highlight)(children, language);
  }, [children, language]);
  var content = (0, _react.useMemo)(function () {
    return (0, _utils.getHtmlContent)(data, children);
  }, [data, children]);
  var classes = (0, _classnames.default)('euiCode', {
    'euiCode--transparentBackground': transparentBackground
  }, className);
  return (0, _react2.jsx)("code", (0, _extends2.default)({
    className: classes,
    "data-code-language": language
  }, rest), content);
};

exports.EuiCode = EuiCode;