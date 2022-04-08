"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getThemeTag = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Computes the themeTag that will be used on the client-side as `__kbnThemeTag__`
 * @see `packages/kbn-ui-shared-deps-src/theme.ts`
 */
const getThemeTag = ({
  themeVersion,
  darkMode
}) => {
  return `${themeVersion}${darkMode ? 'dark' : 'light'}`;
};

exports.getThemeTag = getThemeTag;