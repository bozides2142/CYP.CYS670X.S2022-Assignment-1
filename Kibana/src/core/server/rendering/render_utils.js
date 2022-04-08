"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStylesheetPaths = exports.getSettingValue = void 0;

var _uiSharedDepsNpm = _interopRequireDefault(require("@kbn/ui-shared-deps-npm"));

var UiSharedDepsSrc = _interopRequireWildcard(require("@kbn/ui-shared-deps-src"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getSettingValue = (settingName, settings, convert) => {
  var _settings$user$settin, _settings$user, _settings$user$settin2;

  const value = (_settings$user$settin = (_settings$user = settings.user) === null || _settings$user === void 0 ? void 0 : (_settings$user$settin2 = _settings$user[settingName]) === null || _settings$user$settin2 === void 0 ? void 0 : _settings$user$settin2.userValue) !== null && _settings$user$settin !== void 0 ? _settings$user$settin : settings.defaults[settingName].value;
  return convert(value);
};

exports.getSettingValue = getSettingValue;

const getStylesheetPaths = ({
  themeVersion,
  darkMode,
  basePath,
  buildNum
}) => {
  const regularBundlePath = `${basePath}/${buildNum}/bundles`;
  return [...(darkMode ? [`${regularBundlePath}/kbn-ui-shared-deps-npm/${_uiSharedDepsNpm.default.darkCssDistFilename(themeVersion)}`, `${regularBundlePath}/kbn-ui-shared-deps-src/${UiSharedDepsSrc.cssDistFilename}`, `${basePath}/node_modules/@kbn/ui-framework/dist/kui_dark.css`, `${basePath}/ui/legacy_dark_theme.css`] : [`${regularBundlePath}/kbn-ui-shared-deps-npm/${_uiSharedDepsNpm.default.lightCssDistFilename(themeVersion)}`, `${regularBundlePath}/kbn-ui-shared-deps-src/${UiSharedDepsSrc.cssDistFilename}`, `${basePath}/node_modules/@kbn/ui-framework/dist/kui_light.css`, `${basePath}/ui/legacy_light_theme.css`])];
};

exports.getStylesheetPaths = getStylesheetPaths;