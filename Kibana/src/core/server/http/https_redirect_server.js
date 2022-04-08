"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HttpsRedirectServer = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _url = require("url");

var _serverHttpTools = require("@kbn/server-http-tools");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class HttpsRedirectServer {
  constructor(log) {
    (0, _defineProperty2.default)(this, "server", void 0);
    this.log = log;
  }

  async start(config) {
    this.log.debug('starting http --> https redirect server');

    if (!config.ssl.enabled || config.ssl.redirectHttpFromPort === undefined) {
      throw new Error('Redirect server cannot be started when [ssl.enabled] is set to `false`' + ' or [ssl.redirectHttpFromPort] is not specified.');
    } // Redirect server is configured in the same way as any other HTTP server
    // within the platform with the only exception that it should always be a
    // plain HTTP server, so we just ignore `tls` part of options.


    this.server = (0, _serverHttpTools.createServer)({ ...(0, _serverHttpTools.getServerOptions)(config, {
        configureTLS: false
      }),
      port: config.ssl.redirectHttpFromPort
    }, (0, _serverHttpTools.getListenerOptions)(config));
    this.server.ext('onRequest', (request, responseToolkit) => {
      return responseToolkit.redirect((0, _url.format)({
        hostname: config.host,
        pathname: request.url.pathname,
        port: config.port,
        protocol: 'https',
        search: request.url.search
      })).takeover();
    });

    try {
      await this.server.start();
      this.log.debug(`http --> https redirect server running at ${this.server.info.uri}`);
    } catch (err) {
      if (err.code === 'EADDRINUSE') {
        throw new Error('The redirect server failed to start up because port ' + `${config.ssl.redirectHttpFromPort} is already in use. Ensure the port specified ` + 'in `server.ssl.redirectHttpFromPort` is available.');
      } else {
        throw err;
      }
    }
  }

  async stop() {
    if (this.server === undefined) {
      return;
    }

    this.log.debug('stopping http --> https redirect server');
    await this.server.stop();
    this.server = undefined;
  }

}

exports.HttpsRedirectServer = HttpsRedirectServer;