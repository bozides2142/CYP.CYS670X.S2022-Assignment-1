"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PagePreviewComponent = exports.PagePreview = void 0;

var _react = _interopRequireDefault(require("react"));

var _page = require("../page");

var _context = require("../../context");

var _actions = require("../../context/actions");

var _page_previewModule = _interopRequireDefault(require("./page_preview.module.scss"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * The small preview of the page shown within the `Scrubber`.
 */


const PagePreviewComponent = ({
  height,
  index,
  onClick,
  page,
  workpadHeight,
  workpadWidth
}) => {
  const scale = height / workpadHeight;
  const transform = {
    height: workpadHeight,
    width: workpadWidth,
    transform: `scale3d(${scale}, ${scale}, 1)`
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    className: _page_previewModule.default.root,
    onClick: () => onClick(index),
    onKeyPress: () => onClick(index),
    style: {
      height: workpadHeight * scale,
      width: workpadWidth * scale
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: _page_previewModule.default.preview,
    style: transform
  }, /*#__PURE__*/_react.default.createElement(_page.PageComponent, {
    page,
    height: workpadHeight,
    width: workpadWidth
  })));
};
/**
 * A store-connected container for the `PagePreview` component.
 */


exports.PagePreviewComponent = PagePreviewComponent;

const PagePreview = ({
  index,
  height
}) => {
  const [{
    workpad
  }, dispatch] = (0, _context.useCanvasShareableState)();

  if (!workpad) {
    return null;
  }

  const page = workpad.pages[index];

  const onClick = pageIndex => dispatch((0, _actions.setPageAction)(pageIndex));

  const {
    height: workpadHeight,
    width: workpadWidth
  } = workpad;
  return /*#__PURE__*/_react.default.createElement(PagePreviewComponent, {
    onClick,
    height,
    workpadHeight,
    workpadWidth,
    page,
    index
  });
};

exports.PagePreview = PagePreview;