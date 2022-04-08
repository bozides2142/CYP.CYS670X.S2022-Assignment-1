"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ContextService = void 0;

var _container = require("./container");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/** @internal */
class ContextService {
  constructor(core) {
    this.core = core;
  }

  preboot({
    pluginDependencies
  }) {
    return this.getContextContainerFactory(pluginDependencies);
  }

  setup({
    pluginDependencies
  }) {
    return this.getContextContainerFactory(pluginDependencies);
  }

  getContextContainerFactory(pluginDependencies) {
    return {
      createContextContainer: () => {
        return new _container.ContextContainer(pluginDependencies, this.core.coreId);
      }
    };
  }

}
/** @internal */


exports.ContextService = ContextService;