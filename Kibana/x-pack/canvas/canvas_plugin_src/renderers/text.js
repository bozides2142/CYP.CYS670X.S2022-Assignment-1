"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.textFactory = exports.getTextRenderer = void 0;

var _reactDom = _interopRequireDefault(require("react-dom"));

var _react = _interopRequireDefault(require("react"));

var _public = require("../../../../../src/plugins/kibana_react/public");

var _lib = require("../../../../../src/plugins/presentation_util/common/lib");

var _i18n = require("../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const {
  text: strings
} = _i18n.RendererStrings;

const getTextRenderer = (theme$ = _lib.defaultTheme$) => () => ({
  name: 'text',
  displayName: strings.getDisplayName(),
  help: strings.getHelpDescription(),
  reuseDomNode: true,

  render(domNode, {
    text: textString
  }, handlers) {
    _reactDom.default.render( /*#__PURE__*/_react.default.createElement(_public.KibanaThemeProvider, {
      theme$: theme$
    }, /*#__PURE__*/_react.default.createElement("div", null, textString)), domNode, () => handlers.done());

    handlers.onDestroy(() => _reactDom.default.unmountComponentAtNode(domNode));
  }

});

exports.getTextRenderer = getTextRenderer;

const textFactory = (core, plugins) => getTextRenderer(core.theme.theme$);

exports.textFactory = textFactory;