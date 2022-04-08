"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createConfig$ = createConfig$;

var _crypto = _interopRequireDefault(require("crypto"));

var _ipaddr = _interopRequireDefault(require("ipaddr.js"));

var _lodash = require("lodash");

var _operators = require("rxjs/operators");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * Set up dynamic config defaults
 * - xpack.kibanaServer
 * - xpack.reporting.encryptionKey
 */


function createConfig$(core, config$, parentLogger) {
  const logger = parentLogger.clone(['config']);
  return config$.pipe((0, _operators.map)(config => {
    // encryption key
    let encryptionKey = config.encryptionKey;

    if (encryptionKey === undefined) {
      logger.warn('Generating a random key for xpack.reporting.encryptionKey. To prevent sessions from being invalidated on ' + 'restart, please set xpack.reporting.encryptionKey in the kibana.yml or use the bin/kibana-encryption-keys command.');
      encryptionKey = _crypto.default.randomBytes(16).toString('hex');
    }

    const {
      kibanaServer: reportingServer
    } = config;
    const serverInfo = core.http.getServerInfo(); // set kibanaServer.hostname, default to server.host, don't allow "0.0.0.0" as it breaks in Windows

    let kibanaServerHostname = reportingServer.hostname ? reportingServer.hostname : serverInfo.hostname;

    if (_ipaddr.default.isValid(kibanaServerHostname) && !(0, _lodash.sum)(_ipaddr.default.parse(kibanaServerHostname).toByteArray())) {
      logger.warn(`Found 'server.host: "0.0.0.0"' in Kibana configuration. Reporting is not able to use this as the Kibana server hostname.` + ` To enable PNG/PDF Reporting to work, 'xpack.reporting.kibanaServer.hostname: localhost' is automatically set in the configuration.` + ` You can prevent this message by adding 'xpack.reporting.kibanaServer.hostname: localhost' in kibana.yml.`);
      kibanaServerHostname = 'localhost';
    } // kibanaServer.port, default to server.port


    const kibanaServerPort = reportingServer.port ? reportingServer.port : serverInfo.port; // kibanaServer.protocol, default to server.protocol

    const kibanaServerProtocol = reportingServer.protocol ? reportingServer.protocol : serverInfo.protocol;
    return { ...config,
      encryptionKey,
      kibanaServer: {
        hostname: kibanaServerHostname,
        port: kibanaServerPort,
        protocol: kibanaServerProtocol
      }
    };
  }));
}