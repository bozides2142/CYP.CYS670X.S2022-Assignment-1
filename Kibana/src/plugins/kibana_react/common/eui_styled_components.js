"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withTheme = exports.keyframes = exports.euiStyled = exports.css = exports.createGlobalStyle = exports.EuiThemeProviderDecorator = exports.EuiThemeProvider = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireDefault(require("react"));

var styledComponents = _interopRequireWildcard(require("styled-components"));

var _uiTheme = require("@kbn/ui-theme");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const EuiThemeProvider = ({
  darkMode = false,
  ...otherProps
}) => /*#__PURE__*/_react.default.createElement(styledComponents.ThemeProvider, (0, _extends2.default)({}, otherProps, {
  theme: outerTheme => ({ ...outerTheme,
    eui: darkMode ? _uiTheme.euiDarkVars : _uiTheme.euiLightVars,
    darkMode
  })
}));
/**
 * Storybook decorator using the EUI theme provider. Uses the value from
 * `globals` provided by the Storybook theme switcher.
 */


exports.EuiThemeProvider = EuiThemeProvider;

const EuiThemeProviderDecorator = (storyFn, {
  globals
}) => {
  const darkMode = globals.euiTheme === 'v8.dark' || globals.euiTheme === 'v7.dark';
  return /*#__PURE__*/_react.default.createElement(EuiThemeProvider, {
    darkMode: darkMode
  }, storyFn());
};

exports.EuiThemeProviderDecorator = EuiThemeProviderDecorator;
const {
  default: euiStyled,
  css,
  createGlobalStyle,
  keyframes,
  withTheme
} = styledComponents;
exports.withTheme = withTheme;
exports.keyframes = keyframes;
exports.createGlobalStyle = createGlobalStyle;
exports.css = css;
exports.euiStyled = euiStyled;