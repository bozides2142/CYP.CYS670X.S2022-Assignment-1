"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiPageHeaderContent = exports.ALIGN_ITEMS = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _icon = require("../../icon");

var _tabs = require("../../tabs");

var _flex = require("../../flex");

var _spacer = require("../../spacer");

var _title = require("../../title");

var _text = require("../../text");

var _hooks = require("../../../services/hooks");

var _accessibility = require("../../accessibility");

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var ALIGN_ITEMS = ['top', 'bottom', 'center', 'stretch']; // Gets all the tab props including the button or link props

exports.ALIGN_ITEMS = ALIGN_ITEMS;

var EuiPageHeaderContent = function EuiPageHeaderContent(_ref) {
  var className = _ref.className,
      pageTitle = _ref.pageTitle,
      pageTitleProps = _ref.pageTitleProps,
      iconType = _ref.iconType,
      iconProps = _ref.iconProps,
      tabs = _ref.tabs,
      tabsProps = _ref.tabsProps,
      description = _ref.description,
      _ref$alignItems = _ref.alignItems,
      alignItems = _ref$alignItems === void 0 ? 'top' : _ref$alignItems,
      _ref$responsive = _ref.responsive,
      responsive = _ref$responsive === void 0 ? true : _ref$responsive,
      rightSideItems = _ref.rightSideItems,
      rightSideGroupProps = _ref.rightSideGroupProps,
      children = _ref.children,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["className", "pageTitle", "pageTitleProps", "iconType", "iconProps", "tabs", "tabsProps", "description", "alignItems", "responsive", "rightSideItems", "rightSideGroupProps", "children"]);
  var isResponsiveBreakpoint = (0, _hooks.useIsWithinBreakpoints)(['xs', 's'], !!responsive);
  var classes = (0, _classnames.default)('euiPageHeaderContent');
  var descriptionNode;

  if (description) {
    descriptionNode = (0, _react2.jsx)(_react.default.Fragment, null, (pageTitle || tabs) && (0, _react2.jsx)(_spacer.EuiSpacer, null), (0, _react2.jsx)(_text.EuiText, {
      grow: false
    }, (0, _react2.jsx)("p", null, description)));
  }

  var pageTitleNode;

  if (pageTitle) {
    var icon = iconType ? (0, _react2.jsx)(_icon.EuiIcon, (0, _extends2.default)({
      size: "xl"
    }, iconProps, {
      type: iconType,
      className: (0, _classnames.default)('euiPageHeaderContent__titleIcon', iconProps === null || iconProps === void 0 ? void 0 : iconProps.className)
    })) : undefined;
    pageTitleNode = (0, _react2.jsx)(_title.EuiTitle, (0, _extends2.default)({}, pageTitleProps, {
      size: "l"
    }), (0, _react2.jsx)("h1", null, icon, pageTitle));
  }

  var tabsNode;

  if (tabs) {
    var _tabs$find;

    var tabsSize = pageTitle ? 'l' : 'xl';

    var renderTabs = function renderTabs() {
      return tabs.map(function (tab, index) {
        var label = tab.label,
            tabRest = (0, _objectWithoutProperties2.default)(tab, ["label"]);
        return (0, _react2.jsx)(_tabs.EuiTab, (0, _extends2.default)({
          key: index
        }, tabRest), label);
      });
    }; // When tabs exist without a pageTitle, we need to recreate an h1 based on the currently selected tab and visually hide it


    var screenReaderPageTitle = !pageTitle && (0, _react2.jsx)(_accessibility.EuiScreenReaderOnly, null, (0, _react2.jsx)("h1", null, (_tabs$find = tabs.find(function (obj) {
      return obj.isSelected === true;
    })) === null || _tabs$find === void 0 ? void 0 : _tabs$find.label));
    tabsNode = (0, _react2.jsx)(_react.default.Fragment, null, pageTitleNode && (0, _react2.jsx)(_spacer.EuiSpacer, null), screenReaderPageTitle, (0, _react2.jsx)(_tabs.EuiTabs, (0, _extends2.default)({}, tabsProps, {
      display: "condensed",
      bottomBorder: false,
      size: tabsSize
    }), renderTabs()));
  }

  var childrenNode = children && (0, _react2.jsx)(_react.default.Fragment, null, (0, _react2.jsx)(_spacer.EuiSpacer, null), children);
  var bottomContentNode;

  if (childrenNode || tabsNode && pageTitleNode) {
    bottomContentNode = (0, _react2.jsx)("div", {
      className: "euiPageHeaderContent__bottom"
    }, childrenNode, pageTitleNode && tabsNode);
  }
  /**
   * The left side order depends on if a `pageTitle` was supplied.
   * If not, but there are `tabs`, then the tabs become the page title
   */


  var leftSideOrder;

  if (tabsNode && !pageTitleNode) {
    leftSideOrder = (0, _react2.jsx)(_react.default.Fragment, null, tabsNode, descriptionNode);
  } else {
    leftSideOrder = (0, _react2.jsx)(_react.default.Fragment, null, pageTitleNode, descriptionNode);
  }

  var rightSideFlexItem;

  if (rightSideItems && rightSideItems.length) {
    var wrapWithFlex = function wrapWithFlex() {
      return rightSideItems.map(function (item, index) {
        return (0, _react2.jsx)(_flex.EuiFlexItem, {
          grow: false,
          key: index
        }, item);
      });
    };

    rightSideFlexItem = (0, _react2.jsx)(_flex.EuiFlexItem, {
      grow: false
    }, (0, _react2.jsx)(_flex.EuiFlexGroup, (0, _extends2.default)({
      wrap: true,
      responsive: false
    }, rightSideGroupProps, {
      className: (0, _classnames.default)('euiPageHeaderContent__rightSideItems', rightSideGroupProps === null || rightSideGroupProps === void 0 ? void 0 : rightSideGroupProps.className)
    }), wrapWithFlex()));
  }

  return alignItems === 'top' || isResponsiveBreakpoint ? (0, _react2.jsx)("div", (0, _extends2.default)({
    className: classes
  }, rest), (0, _react2.jsx)(_flex.EuiFlexGroup, {
    responsive: !!responsive,
    className: "euiPageHeaderContent__top",
    alignItems: pageTitle ? 'flexStart' : 'baseline',
    gutterSize: "l"
  }, isResponsiveBreakpoint && responsive === 'reverse' ? (0, _react2.jsx)(_react.default.Fragment, null, rightSideFlexItem, (0, _react2.jsx)(_flex.EuiFlexItem, null, leftSideOrder)) : (0, _react2.jsx)(_react.default.Fragment, null, (0, _react2.jsx)(_flex.EuiFlexItem, null, leftSideOrder), rightSideFlexItem)), bottomContentNode) : (0, _react2.jsx)("div", (0, _extends2.default)({
    className: classes
  }, rest), (0, _react2.jsx)(_flex.EuiFlexGroup, {
    responsive: !!responsive,
    className: "euiPageHeaderContent__top",
    alignItems: alignItems === 'bottom' ? 'flexEnd' : alignItems,
    gutterSize: "l"
  }, (0, _react2.jsx)(_flex.EuiFlexItem, null, leftSideOrder, bottomContentNode), rightSideFlexItem));
};

exports.EuiPageHeaderContent = EuiPageHeaderContent;