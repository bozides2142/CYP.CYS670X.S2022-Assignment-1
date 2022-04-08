"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.kibanaContextDecorator = void 0;

var _react = _interopRequireDefault(require("react"));

var _public = require("../../../../../src/plugins/kibana_react/public");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const settings = new Map();
settings.set('darkMode', true);
const platform = {
  http: {
    basePath: {
      get: () => '',
      prepend: () => '',
      remove: () => '',
      serverBasePath: ''
    }
  },
  uiSettings: settings
};

const kibanaContextDecorator = story => /*#__PURE__*/_react.default.createElement(_public.KibanaContextProvider, {
  services: platform
}, story());

exports.kibanaContextDecorator = kibanaContextDecorator;