"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.routerContextDecorator = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactRouterDom = require("react-router-dom");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const routerContextDecorator = story => /*#__PURE__*/_react.default.createElement(_reactRouterDom.MemoryRouter, {
  initialEntries: ['/']
}, story());

exports.routerContextDecorator = routerContextDecorator;