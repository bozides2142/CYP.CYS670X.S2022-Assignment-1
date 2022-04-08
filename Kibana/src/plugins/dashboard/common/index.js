"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UI_SETTINGS = void 0;
Object.defineProperty(exports, "migratePanelsTo730", {
  enumerable: true,
  get: function () {
    return _migrate_to_730_panels.migratePanelsTo730;
  }
});

var _migrate_to_730_panels = require("./migrate_to_730_panels");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const UI_SETTINGS = {
  ENABLE_LABS_UI: 'labs:dashboard:enable_ui'
};
exports.UI_SETTINGS = UI_SETTINGS;