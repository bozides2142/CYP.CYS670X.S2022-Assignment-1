"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEnsureDefaultDataView = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const createEnsureDefaultDataView = (uiSettings, onRedirectNoDefaultView) => {
  /**
   * Checks whether a default data view is set and exists and defines
   * one otherwise.
   */
  return async function ensureDefaultDataView() {
    if (!(await this.getDefaultDataView())) {
      return onRedirectNoDefaultView();
    }
  };
};

exports.createEnsureDefaultDataView = createEnsureDefaultDataView;