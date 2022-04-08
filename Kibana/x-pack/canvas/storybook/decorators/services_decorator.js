"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.servicesContextDecorator = exports.legacyContextDecorator = void 0;

var _react = _interopRequireDefault(require("react"));

var _i18nReact = require("@kbn/i18n-react");

var _public = require("../../../../../src/plugins/presentation_util/public");

var _services = require("../../public/services");

var _storybook = require("../../public/services/storybook");

var _legacy = require("../../public/services/legacy");

var _stubs = require("../../public/services/legacy/stubs");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const servicesContextDecorator = () => {
  const pluginServiceRegistry = new _public.PluginServiceRegistry(_storybook.pluginServiceProviders);

  _services.pluginServices.setRegistry(pluginServiceRegistry.start({}));

  return (story, storybook) => {
    if (process.env.JEST_WORKER_ID !== undefined) {
      storybook.args.useStaticData = true;
    }

    _services.pluginServices.setRegistry(pluginServiceRegistry.start(storybook.args));

    const ContextProvider = _services.pluginServices.getContextProvider();

    return /*#__PURE__*/_react.default.createElement(_i18nReact.I18nProvider, null, /*#__PURE__*/_react.default.createElement(ContextProvider, null, story()));
  };
};

exports.servicesContextDecorator = servicesContextDecorator;

const legacyContextDecorator = () => {
  (0, _stubs.startServices)();
  return story => /*#__PURE__*/_react.default.createElement(_legacy.LegacyServicesProvider, null, story());
};

exports.legacyContextDecorator = legacyContextDecorator;