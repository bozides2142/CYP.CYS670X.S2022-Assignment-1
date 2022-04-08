"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ToolbarSettingsComponent = exports.ToolbarSettings = void 0;

var _react = _interopRequireDefault(require("react"));

var _eui = require("@elastic/eui");

var _context = require("../../../context");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * The settings panel for the Toolbar of a Shareable Canvas Workpad.
 */


const ToolbarSettingsComponent = ({
  isAutohide,
  onSetAutohide
}) => {
  return /*#__PURE__*/_react.default.createElement("div", {
    style: {
      padding: 16
    }
  }, /*#__PURE__*/_react.default.createElement(_eui.EuiFormRow, {
    helpText: "Hide the toolbar when the mouse is not within the Canvas?"
  }, /*#__PURE__*/_react.default.createElement(_eui.EuiSwitch, {
    "data-test-subj": "hideToolbarSwitch",
    name: "toolbarHide",
    id: "toolbarHide",
    label: "Hide Toolbar",
    checked: isAutohide,
    onChange: () => onSetAutohide(!isAutohide)
  })));
};
/**
 * A store-connected container for the `ToolbarSettings` component.
 */


exports.ToolbarSettingsComponent = ToolbarSettingsComponent;

const ToolbarSettings = ({
  onSetAutohide
}) => {
  const [{
    settings
  }, dispatch] = (0, _context.useCanvasShareableState)();
  const {
    toolbar
  } = settings;
  const {
    isAutohide
  } = toolbar;

  const onSetAutohideFn = autohide => {
    onSetAutohide(autohide);
    dispatch((0, _context.setToolbarAutohideAction)(autohide));
  };

  return /*#__PURE__*/_react.default.createElement(ToolbarSettingsComponent, {
    onSetAutohide: onSetAutohideFn,
    isAutohide
  });
};

exports.ToolbarSettings = ToolbarSettings;