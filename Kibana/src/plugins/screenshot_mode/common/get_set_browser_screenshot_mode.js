"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setScreenshotModeEnabled = exports.setScreenshotModeDisabled = exports.setScreenshotLayout = exports.getScreenshotMode = exports.getScreenshotLayout = exports.KBN_SCREENSHOT_MODE_LAYOUT_KEY = exports.KBN_SCREENSHOT_MODE_ENABLED_KEY = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// **PLEASE NOTE**
// The functionality in this file targets a browser environment AND is intended to be used both in public and server.
// For instance, reporting uses these functions when starting puppeteer to set the current browser into "screenshot" mode.
const KBN_SCREENSHOT_MODE_ENABLED_KEY = '__KBN_SCREENSHOT_MODE_ENABLED_KEY__';
/**
 * This function is responsible for detecting whether we are currently in screenshot mode.
 *
 * We check in the current window context whether screenshot mode is enabled, otherwise we check
 * localStorage. The ability to set a value in localStorage enables more convenient development and testing
 * in functionality that needs to detect screenshot mode.
 */

exports.KBN_SCREENSHOT_MODE_ENABLED_KEY = KBN_SCREENSHOT_MODE_ENABLED_KEY;

const getScreenshotMode = () => {
  return window[KBN_SCREENSHOT_MODE_ENABLED_KEY] === true || window.localStorage.getItem(KBN_SCREENSHOT_MODE_ENABLED_KEY) === 'true';
};
/**
 * Use this function to set the current browser to screenshot mode.
 *
 * This function should be called as early as possible to ensure that screenshot mode is
 * correctly detected for the first page load. It is not suitable for use inside any plugin
 * code unless the plugin code is guaranteed to, somehow, load before any other code.
 *
 * Additionally, we don't know what environment this code will run in so we remove as many external
 * references as possible to make it portable. For instance, running inside puppeteer.
 */


exports.getScreenshotMode = getScreenshotMode;

const setScreenshotModeEnabled = () => {
  Object.defineProperty(window, '__KBN_SCREENSHOT_MODE_ENABLED_KEY__', // Literal value to prevent adding an external reference
  {
    enumerable: true,
    writable: true,
    configurable: false,
    value: true
  });
};

exports.setScreenshotModeEnabled = setScreenshotModeEnabled;

const setScreenshotModeDisabled = () => {
  Object.defineProperty(window, '__KBN_SCREENSHOT_MODE_ENABLED_KEY__', // Literal value to prevent adding an external reference
  {
    enumerable: true,
    writable: true,
    configurable: false,
    value: undefined
  });
};
/** @deprecated */


exports.setScreenshotModeDisabled = setScreenshotModeDisabled;
const KBN_SCREENSHOT_MODE_LAYOUT_KEY = '__KBN_SCREENSHOT_MODE_LAYOUT_KEY__';
/** @deprecated */

exports.KBN_SCREENSHOT_MODE_LAYOUT_KEY = KBN_SCREENSHOT_MODE_LAYOUT_KEY;

/** @deprecated */
const setScreenshotLayout = value => {
  Object.defineProperty(window, '__KBN_SCREENSHOT_MODE_LAYOUT_KEY__', // Literal value to prevent adding an external reference
  {
    enumerable: true,
    writable: true,
    configurable: false,
    value
  });
};
/** @deprecated */


exports.setScreenshotLayout = setScreenshotLayout;

const getScreenshotLayout = () => {
  return window[KBN_SCREENSHOT_MODE_LAYOUT_KEY] || window.localStorage.getItem(KBN_SCREENSHOT_MODE_LAYOUT_KEY);
};

exports.getScreenshotLayout = getScreenshotLayout;