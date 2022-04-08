"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PageComponent = exports.Page = void 0;

var _react = _interopRequireDefault(require("react"));

var _rendered_element = require("./rendered_element");

var _context = require("../context");

var _pageModule = _interopRequireDefault(require("./page.module.scss"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * A Page in the Shareable Workpad is conceptually identical to a Page in a Workpad.
 */


const PageComponent = ({
  page,
  height,
  width
}) => {
  const {
    elements,
    style,
    id
  } = page;
  const output = elements.map((element, i) => /*#__PURE__*/_react.default.createElement(_rendered_element.RenderedElement, {
    key: element.id,
    element: element,
    index: i + 1
  }));
  return /*#__PURE__*/_react.default.createElement("div", {
    id,
    className: _pageModule.default.root,
    style: {
      height,
      width,
      ...style
    }
  }, output);
};

exports.PageComponent = PageComponent;
/**
 * A store-connected container for the `Page` component.
 */

const Page = ({
  index
}) => {
  const [{
    workpad
  }] = (0, _context.useCanvasShareableState)();

  if (!workpad) {
    return null;
  }

  const {
    height,
    width,
    pages
  } = workpad;
  const page = pages[index];
  return /*#__PURE__*/_react.default.createElement(PageComponent, {
    page,
    height,
    width
  });
};

exports.Page = Page;