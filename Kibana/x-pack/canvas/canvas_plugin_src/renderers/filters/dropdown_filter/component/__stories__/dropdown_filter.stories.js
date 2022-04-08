"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _addonActions = require("@storybook/addon-actions");

var _dropdown_filter = require("../dropdown_filter");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const choices = [['1', 'Item One'], ['2', 'Item Two'], ['3', 'Item Three']];
(0, _react2.storiesOf)('renderers/DropdownFilter', module).add('default', () => /*#__PURE__*/_react.default.createElement(_dropdown_filter.DropdownFilter, {
  commit: (0, _addonActions.action)('commit')
})).add('with new value', () => /*#__PURE__*/_react.default.createElement(_dropdown_filter.DropdownFilter, {
  commit: (0, _addonActions.action)('commit'),
  initialValue: "selectedValue"
})).add('with choices', () => /*#__PURE__*/_react.default.createElement(_dropdown_filter.DropdownFilter, {
  commit: (0, _addonActions.action)('commit'),
  choices: choices
})).add('with choices and value', () => /*#__PURE__*/_react.default.createElement(_dropdown_filter.DropdownFilter, {
  commit: (0, _addonActions.action)('commit'),
  choices: choices,
  initialValue: "Item Two"
})).add('with choices and new value', () => /*#__PURE__*/_react.default.createElement(_dropdown_filter.DropdownFilter, {
  commit: (0, _addonActions.action)('commit'),
  choices: choices,
  initialValue: "selectedValue"
}));