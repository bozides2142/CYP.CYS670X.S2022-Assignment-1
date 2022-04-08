"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseClientOptions = parseClientOptions;

var _url = require("url");

var _default_headers = require("../default_headers");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Parse the client options from given client config and `scoped` flag.
 *
 * @param config The config to generate the client options from.
 * @param scoped if true, will adapt the configuration to be used by a scoped client
 *        (will remove basic auth and ssl certificates)
 */
function parseClientOptions(config, scoped) {
  var _config$keepAlive;

  const clientOptions = {
    sniffOnStart: config.sniffOnStart,
    sniffOnConnectionFault: config.sniffOnConnectionFault,
    headers: { ..._default_headers.DEFAULT_HEADERS,
      ...config.customHeaders
    },
    // do not make assumption on user-supplied data content
    // fixes https://github.com/elastic/kibana/issues/101944
    disablePrototypePoisoningProtection: true,
    agent: {
      maxSockets: Infinity,
      keepAlive: (_config$keepAlive = config.keepAlive) !== null && _config$keepAlive !== void 0 ? _config$keepAlive : true
    },
    compression: config.compression
  };

  if (config.pingTimeout != null) {
    clientOptions.pingTimeout = getDurationAsMs(config.pingTimeout);
  }

  if (config.requestTimeout != null) {
    clientOptions.requestTimeout = getDurationAsMs(config.requestTimeout);
  }

  if (config.sniffInterval != null) {
    clientOptions.sniffInterval = typeof config.sniffInterval === 'boolean' ? config.sniffInterval : getDurationAsMs(config.sniffInterval);
  }

  if (!scoped) {
    if (config.username && config.password) {
      clientOptions.auth = {
        username: config.username,
        password: config.password
      };
    } else if (config.serviceAccountToken) {
      // TODO: change once ES client has native support for service account tokens: https://github.com/elastic/elasticsearch-js/issues/1477
      clientOptions.headers.authorization = `Bearer ${config.serviceAccountToken}`;
    }
  }

  clientOptions.nodes = config.hosts.map(host => convertHost(host));

  if (config.ssl) {
    clientOptions.tls = generateSslConfig(config.ssl, scoped && !config.ssl.alwaysPresentCertificate);
  }

  if (config.caFingerprint != null) {
    clientOptions.caFingerprint = config.caFingerprint;
  }

  return clientOptions;
}

const generateSslConfig = (sslConfig, ignoreCertAndKey) => {
  const ssl = {
    ca: sslConfig.certificateAuthorities
  };
  const verificationMode = sslConfig.verificationMode;

  switch (verificationMode) {
    case 'none':
      ssl.rejectUnauthorized = false;
      break;

    case 'certificate':
      ssl.rejectUnauthorized = true; // by default, NodeJS is checking the server identify

      ssl.checkServerIdentity = () => undefined;

      break;

    case 'full':
      ssl.rejectUnauthorized = true;
      break;

    default:
      throw new Error(`Unknown ssl verificationMode: ${verificationMode}`);
  } // Add client certificate and key if required by elasticsearch


  if (!ignoreCertAndKey && sslConfig.certificate && sslConfig.key) {
    ssl.cert = sslConfig.certificate;
    ssl.key = sslConfig.key;
    ssl.passphrase = sslConfig.keyPassphrase;
  }

  return ssl;
};

const convertHost = host => {
  const url = new _url.URL(host);
  const isHTTPS = url.protocol === 'https:';
  url.port = url.port || (isHTTPS ? '443' : '80');
  return {
    url
  };
};

const getDurationAsMs = duration => typeof duration === 'number' ? duration : duration.asMilliseconds();