"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FeatureUsageService = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class FeatureUsageService {
  constructor() {
    (0, _defineProperty2.default)(this, "lastUsages", new Map());
  }

  setup() {
    return {
      register: (featureName, licenseType) => {
        const registered = this.lastUsages.get(featureName);

        if (registered) {
          if (registered.licenseType !== licenseType) {
            throw new Error(`Feature '${featureName}' has already been registered with another license type. (current: ${registered.licenseType}, new: ${licenseType})`);
          }
        } else {
          this.lastUsages.set(featureName, {
            name: featureName,
            lastUsed: null,
            licenseType
          });
        }
      }
    };
  }

  start() {
    return {
      notifyUsage: (featureName, usedAt = Date.now()) => {
        const usage = this.lastUsages.get(featureName);

        if (!usage) {
          throw new Error(`Feature '${featureName}' is not registered.`);
        }

        const lastUsed = (0, _lodash.isDate)(usedAt) ? usedAt : new Date(usedAt);

        if (usage.lastUsed == null || lastUsed > usage.lastUsed) {
          usage.lastUsed = lastUsed;
        }
      },
      getLastUsages: () => Array.from(this.lastUsages.values())
    };
  }

}

exports.FeatureUsageService = FeatureUsageService;