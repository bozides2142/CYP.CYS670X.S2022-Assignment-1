"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiPageHeader = exports.PADDING_SIZES = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _common = require("../../common");

var _page_header_content = require("./page_header_content");

var _restrict_width = require("../_restrict_width");

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var paddingSizeToClassNameMap = {
  none: null,
  s: 'euiPageHeader--paddingSmall',
  m: 'euiPageHeader--paddingMedium',
  l: 'euiPageHeader--paddingLarge'
};
var PADDING_SIZES = (0, _common.keysOf)(paddingSizeToClassNameMap);
exports.PADDING_SIZES = PADDING_SIZES;

var EuiPageHeader = function EuiPageHeader(_ref) {
  var _classNames;

  var className = _ref.className,
      _ref$restrictWidth = _ref.restrictWidth,
      restrictWidth = _ref$restrictWidth === void 0 ? false : _ref$restrictWidth,
      _ref$paddingSize = _ref.paddingSize,
      paddingSize = _ref$paddingSize === void 0 ? 'none' : _ref$paddingSize,
      bottomBorder = _ref.bottomBorder,
      style = _ref.style,
      alignItems = _ref.alignItems,
      _ref$responsive = _ref.responsive,
      responsive = _ref$responsive === void 0 ? true : _ref$responsive,
      children = _ref.children,
      pageTitle = _ref.pageTitle,
      pageTitleProps = _ref.pageTitleProps,
      iconType = _ref.iconType,
      iconProps = _ref.iconProps,
      tabs = _ref.tabs,
      tabsProps = _ref.tabsProps,
      description = _ref.description,
      rightSideItems = _ref.rightSideItems,
      rightSideGroupProps = _ref.rightSideGroupProps,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["className", "restrictWidth", "paddingSize", "bottomBorder", "style", "alignItems", "responsive", "children", "pageTitle", "pageTitleProps", "iconType", "iconProps", "tabs", "tabsProps", "description", "rightSideItems", "rightSideGroupProps"]);

  var _setPropsForRestricte = (0, _restrict_width.setPropsForRestrictedPageWidth)(restrictWidth, style),
      widthClassName = _setPropsForRestricte.widthClassName,
      newStyle = _setPropsForRestricte.newStyle;

  var classes = (0, _classnames.default)('euiPageHeader', paddingSizeToClassNameMap[paddingSize], (_classNames = {}, (0, _defineProperty2.default)(_classNames, "euiPageHeader--".concat(widthClassName), widthClassName), (0, _defineProperty2.default)(_classNames, 'euiPageHeader--bottomBorder', bottomBorder), (0, _defineProperty2.default)(_classNames, 'euiPageHeader--responsive', responsive === true), (0, _defineProperty2.default)(_classNames, 'euiPageHeader--responsiveReverse', responsive === 'reverse'), (0, _defineProperty2.default)(_classNames, 'euiPageHeader--tabsAtBottom', pageTitle && tabs), (0, _defineProperty2.default)(_classNames, 'euiPageHeader--onlyTabs', tabs && !pageTitle && !rightSideItems && !description && !children), _classNames), "euiPageHeader--".concat(alignItems !== null && alignItems !== void 0 ? alignItems : 'center'), className);

  if (!pageTitle && !tabs && !description && !rightSideItems) {
    return (0, _react2.jsx)("header", (0, _extends2.default)({
      className: classes,
      style: newStyle || style
    }, rest), children);
  }

  return (0, _react2.jsx)("header", (0, _extends2.default)({
    className: classes,
    style: newStyle || style
  }, rest), (0, _react2.jsx)(_page_header_content.EuiPageHeaderContent, {
    alignItems: alignItems,
    responsive: responsive,
    pageTitle: pageTitle,
    pageTitleProps: pageTitleProps,
    iconType: iconType,
    iconProps: iconProps,
    tabs: tabs,
    tabsProps: tabsProps,
    description: description,
    rightSideItems: rightSideItems,
    rightSideGroupProps: rightSideGroupProps
  }, children));
};

exports.EuiPageHeader = EuiPageHeader;