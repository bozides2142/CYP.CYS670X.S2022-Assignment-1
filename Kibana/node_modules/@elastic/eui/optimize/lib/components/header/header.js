"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EuiHeader = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _header_section = require("./header_section");

var _header_breadcrumbs = require("./header_breadcrumbs");

var _react2 = require("@emotion/react");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function createHeaderSection(sections, border) {
  return sections.map(function (section, index) {
    return (0, _react2.jsx)(_header_section.EuiHeaderSectionItem, {
      key: index,
      border: border
    }, section);
  });
}

// Start a counter to manage the total number of fixed headers that need the body class
var euiHeaderFixedCounter = 0;

var EuiHeader = function EuiHeader(_ref) {
  var children = _ref.children,
      className = _ref.className,
      sections = _ref.sections,
      _ref$position = _ref.position,
      position = _ref$position === void 0 ? 'static' : _ref$position,
      _ref$theme = _ref.theme,
      theme = _ref$theme === void 0 ? 'default' : _ref$theme,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["children", "className", "sections", "position", "theme"]);
  var classes = (0, _classnames.default)('euiHeader', "euiHeader--".concat(theme), "euiHeader--".concat(position), className);
  (0, _react.useEffect)(function () {
    if (position === 'fixed') {
      // Increment fixed header counter for each fixed header
      euiHeaderFixedCounter++;
      document.body.classList.add('euiBody--headerIsFixed');
      return function () {
        // Both decrement the fixed counter AND then check if there are none
        if (--euiHeaderFixedCounter === 0) {
          // If there are none, THEN remove class
          document.body.classList.remove('euiBody--headerIsFixed');
        }
      };
    }
  }, [position]);
  var contents;

  if (sections) {
    if (children) {
      // In case both children and sections are passed, warn in the console that the children will be disregarded
      console.warn('EuiHeader cannot accept both `children` and `sections`. It will disregard the `children`.');
    }

    contents = sections.map(function (section, index) {
      var content = [];

      if (section.items) {
        // Items get wrapped in EuiHeaderSection and each item in a EuiHeaderSectionItem
        content.push((0, _react2.jsx)(_header_section.EuiHeaderSection, {
          key: "items-".concat(index)
        }, createHeaderSection(section.items, section.borders)));
      }

      if (section.breadcrumbs) {
        content.push( // Breadcrumbs are separate and cannot be contained in a EuiHeaderSection
        // in order for truncation to work
        (0, _react2.jsx)(_header_breadcrumbs.EuiHeaderBreadcrumbs, (0, _extends2.default)({
          key: "breadcrumbs-".concat(index),
          breadcrumbs: section.breadcrumbs
        }, section.breadcrumbProps)));
      }

      return content;
    });
  } else {
    contents = children;
  }

  return (0, _react2.jsx)("div", (0, _extends2.default)({
    className: classes
  }, rest), contents);
};

exports.EuiHeader = EuiHeader;