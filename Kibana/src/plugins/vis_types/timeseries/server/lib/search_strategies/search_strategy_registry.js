"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SearchStrategyRegistry = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _strategies = require("./strategies");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class SearchStrategyRegistry {
  constructor() {
    (0, _defineProperty2.default)(this, "strategies", []);
  }

  addStrategy(searchStrategy) {
    if (searchStrategy instanceof _strategies.AbstractSearchStrategy) {
      this.strategies.unshift(searchStrategy);
    }

    return this.strategies;
  }

  async getViableStrategy(requestContext, req, fetchedIndexPattern) {
    for (const searchStrategy of this.strategies) {
      const {
        isViable,
        capabilities
      } = await searchStrategy.checkForViability(requestContext, req, fetchedIndexPattern);

      if (isViable) {
        return {
          searchStrategy,
          capabilities
        };
      }
    }
  }

}

exports.SearchStrategyRegistry = SearchStrategyRegistry;