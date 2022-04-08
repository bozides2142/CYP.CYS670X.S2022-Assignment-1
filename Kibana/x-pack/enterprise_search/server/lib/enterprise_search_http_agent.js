"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.entSearchHttpAgent = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _fs = require("fs");

var _http = _interopRequireDefault(require("http"));

var _https = _interopRequireDefault(require("https"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * Returns an HTTP agent to be used for requests to Enterprise Search APIs
 */


class EnterpriseSearchHttpAgent {
  constructor() {
    (0, _defineProperty2.default)(this, "httpAgent", new _http.default.Agent());
  }

  getHttpAgent() {
    return this.httpAgent;
  }

  initializeHttpAgent(config) {
    if (!config.host) return;

    try {
      const parsedHost = new URL(config.host);

      if (parsedHost.protocol === 'https:') {
        this.httpAgent = new _https.default.Agent({
          ca: this.loadCertificateAuthorities(config.ssl.certificateAuthorities),
          ...this.getAgentOptions(config.ssl.verificationMode)
        });
      }
    } catch {// Ignore URL parsing errors and fall back to the HTTP agent
    }
  }
  /*
   * Loads custom CA certificate files and returns all certificates as an array
   * This is a potentially expensive operation & why this helper is a class
   * initialized once on plugin init
   */


  loadCertificateAuthorities(certificates) {
    if (!certificates) return [];
    const paths = Array.isArray(certificates) ? certificates : [certificates];
    return paths.map(path => (0, _fs.readFileSync)(path, 'utf8'));
  }
  /*
   * Convert verificationMode to rejectUnauthorized for more consistent config settings
   * with the rest of Kibana
   * @see https://github.com/elastic/kibana/blob/main/x-pack/plugins/actions/server/builtin_action_types/lib/get_node_tls_options.ts
   */


  getAgentOptions(verificationMode) {
    const agentOptions = {};

    switch (verificationMode) {
      case 'none':
        agentOptions.rejectUnauthorized = false;
        break;

      case 'certificate':
        agentOptions.rejectUnauthorized = true;

        agentOptions.checkServerIdentity = () => undefined;

        break;

      case 'full':
      default:
        agentOptions.rejectUnauthorized = true;
        break;
    }

    return agentOptions;
  }

}

const entSearchHttpAgent = new EnterpriseSearchHttpAgent();
exports.entSearchHttpAgent = entSearchHttpAgent;