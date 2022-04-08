"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScreenshotModePlugin = void 0;

var _is_screenshot_mode = require("./is_screenshot_mode");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class ScreenshotModePlugin {
  setup(core) {
    core.http.registerRouteHandlerContext('screenshotMode', (ctx, req) => {
      return {
        isScreenshot: (0, _is_screenshot_mode.isScreenshotMode)(req)
      };
    }); // We use "require" here to ensure the import does not have external references due to code bundling that
    // commonly happens during transpiling. External references would be missing in the environment puppeteer creates.
    // eslint-disable-next-line @typescript-eslint/no-var-requires

    const {
      setScreenshotModeEnabled,
      setScreenshotLayout
    } = require('../common');

    return {
      setScreenshotModeEnabled,
      setScreenshotLayout,
      isScreenshotMode: _is_screenshot_mode.isScreenshotMode
    };
  }

  start() {
    return {
      isScreenshotMode: _is_screenshot_mode.isScreenshotMode
    };
  }

  stop() {}

}

exports.ScreenshotModePlugin = ScreenshotModePlugin;