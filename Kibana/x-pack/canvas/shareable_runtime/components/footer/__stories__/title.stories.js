"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _context_example = require("../../../test/context_example");

var _title = require("../title");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const style = {
  background: '#333',
  padding: 10
};
(0, _react2.storiesOf)('shareables/Footer/Title', module).add('contextual: hello', () => /*#__PURE__*/_react.default.createElement(_context_example.ExampleContext, {
  source: "hello",
  style
}, /*#__PURE__*/_react.default.createElement(_title.Title, null))).add('contextual: austin', () => /*#__PURE__*/_react.default.createElement(_context_example.ExampleContext, {
  source: "austin",
  style
}, /*#__PURE__*/_react.default.createElement(_title.Title, null))).add('component', () => /*#__PURE__*/_react.default.createElement(_context_example.ExampleContext, {
  style
}, /*#__PURE__*/_react.default.createElement(_title.TitleComponent, {
  title: "This is a test title."
})));