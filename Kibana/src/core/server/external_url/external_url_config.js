"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExternalUrlConfig = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _crypto = require("@kbn/crypto");

var _config = require("./config");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const DEFAULT_CONFIG = Object.freeze(_config.config.schema.validate({}));
/**
 * External Url configuration for use in Kibana.
 * @public
 */

/**
 * External Url configuration for use in Kibana.
 * @public
 */
class ExternalUrlConfig {
  /**
   * Returns the default External Url configuration when passed with no config
   * @internal
   */
  constructor(rawConfig) {
    (0, _defineProperty2.default)(this, "policy", void 0);
    this.policy = rawConfig.policy.map(entry => {
      if (entry.host) {
        // If the host contains a `[`, then it's likely an IPv6 address. Otherwise, append a `.` if it doesn't already contain one
        const hostToHash = entry.host && !entry.host.includes('[') && !entry.host.endsWith('.') ? `${entry.host}.` : entry.host;
        return { ...entry,
          host: (0, _crypto.createSHA256Hash)(hostToHash)
        };
      }

      return entry;
    });
  }

}

exports.ExternalUrlConfig = ExternalUrlConfig;
(0, _defineProperty2.default)(ExternalUrlConfig, "DEFAULT", new ExternalUrlConfig(DEFAULT_CONFIG));