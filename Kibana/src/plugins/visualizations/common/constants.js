"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VisualizeConstants = exports.VISUALIZE_ENABLE_LABS_SETTING = exports.VISUALIZE_EMBEDDABLE_TYPE = exports.VISUALIZE_APP_NAME = exports.STATE_STORAGE_KEY = exports.GLOBAL_STATE_STORAGE_KEY = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const VISUALIZE_ENABLE_LABS_SETTING = 'visualize:enableLabs';
exports.VISUALIZE_ENABLE_LABS_SETTING = VISUALIZE_ENABLE_LABS_SETTING;
const VISUALIZE_EMBEDDABLE_TYPE = 'visualization';
exports.VISUALIZE_EMBEDDABLE_TYPE = VISUALIZE_EMBEDDABLE_TYPE;
const STATE_STORAGE_KEY = '_a';
exports.STATE_STORAGE_KEY = STATE_STORAGE_KEY;
const GLOBAL_STATE_STORAGE_KEY = '_g';
exports.GLOBAL_STATE_STORAGE_KEY = GLOBAL_STATE_STORAGE_KEY;
const VISUALIZE_APP_NAME = 'visualize';
exports.VISUALIZE_APP_NAME = VISUALIZE_APP_NAME;
const VisualizeConstants = {
  VISUALIZE_BASE_PATH: '/app/visualize',
  LANDING_PAGE_PATH: '/',
  WIZARD_STEP_1_PAGE_PATH: '/new',
  WIZARD_STEP_2_PAGE_PATH: '/new/configure',
  CREATE_PATH: '/create',
  EDIT_PATH: '/edit',
  EDIT_BY_VALUE_PATH: '/edit_by_value',
  APP_ID: 'visualize'
};
exports.VisualizeConstants = VisualizeConstants;