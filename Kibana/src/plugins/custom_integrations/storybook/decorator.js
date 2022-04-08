"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCustomIntegrationsContextProvider = exports.getCustomIntegrationsContextDecorator = void 0;

var _react = _interopRequireDefault(require("react"));

var _i18nReact = require("@kbn/i18n-react");

var _public = require("../../presentation_util/public");

var _services = require("../public/services");

var _storybook = require("../public/services/storybook");

var _eui_styled_components = require("../../kibana_react/common/eui_styled_components");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Returns a Storybook Decorator that provides both the `I18nProvider` and access to `PluginServices`
 * for components rendered in Storybook.
 */
const getCustomIntegrationsContextDecorator = () => (story, {
  globals
}) => {
  const ContextProvider = getCustomIntegrationsContextProvider();
  const darkMode = globals.euiTheme === 'v8.dark' || globals.euiTheme === 'v7.dark';
  return /*#__PURE__*/_react.default.createElement(_i18nReact.I18nProvider, null, /*#__PURE__*/_react.default.createElement(_eui_styled_components.EuiThemeProvider, {
    darkMode: darkMode
  }, /*#__PURE__*/_react.default.createElement(ContextProvider, null, story())));
};
/**
 * Prepares `PluginServices` for use in Storybook and returns a React `Context.Provider` element
 * so components that access `PluginServices` can be rendered.
 */


exports.getCustomIntegrationsContextDecorator = getCustomIntegrationsContextDecorator;

const getCustomIntegrationsContextProvider = () => {
  const registry = new _public.PluginServiceRegistry(_storybook.providers);

  _services.pluginServices.setRegistry(registry.start({}));

  return _services.pluginServices.getContextProvider();
};

exports.getCustomIntegrationsContextProvider = getCustomIntegrationsContextProvider;