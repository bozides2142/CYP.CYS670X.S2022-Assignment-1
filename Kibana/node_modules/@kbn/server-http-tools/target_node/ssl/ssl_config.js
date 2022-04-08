"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sslSchema = exports.SslConfig = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _configSchema = require("@kbn/config-schema");

var _crypto = require("@kbn/crypto");

var _crypto2 = require("crypto");

var _fs = require("fs");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const protocolMap = new Map([['TLSv1', _crypto2.constants.SSL_OP_NO_TLSv1], ['TLSv1.1', _crypto2.constants.SSL_OP_NO_TLSv1_1], ['TLSv1.2', _crypto2.constants.SSL_OP_NO_TLSv1_2], // @ts-expect-error According to the docs SSL_OP_NO_TLSv1_3 should exist (https://nodejs.org/docs/latest-v12.x/api/crypto.html)
['TLSv1.3', _crypto2.constants.SSL_OP_NO_TLSv1_3]]);

const sslSchema = _configSchema.schema.object({
  certificate: _configSchema.schema.maybe(_configSchema.schema.string()),
  certificateAuthorities: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.arrayOf(_configSchema.schema.string()), _configSchema.schema.string()])),
  cipherSuites: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
    defaultValue: _crypto2.constants.defaultCoreCipherList.split(':')
  }),
  enabled: _configSchema.schema.boolean({
    defaultValue: false
  }),
  key: _configSchema.schema.maybe(_configSchema.schema.string()),
  keyPassphrase: _configSchema.schema.maybe(_configSchema.schema.string()),
  keystore: _configSchema.schema.object({
    path: _configSchema.schema.maybe(_configSchema.schema.string()),
    password: _configSchema.schema.maybe(_configSchema.schema.string())
  }),
  truststore: _configSchema.schema.object({
    path: _configSchema.schema.maybe(_configSchema.schema.string()),
    password: _configSchema.schema.maybe(_configSchema.schema.string())
  }),
  redirectHttpFromPort: _configSchema.schema.maybe(_configSchema.schema.number()),
  supportedProtocols: _configSchema.schema.arrayOf(_configSchema.schema.oneOf([_configSchema.schema.literal('TLSv1'), _configSchema.schema.literal('TLSv1.1'), _configSchema.schema.literal('TLSv1.2'), _configSchema.schema.literal('TLSv1.3')]), {
    defaultValue: ['TLSv1.1', 'TLSv1.2', 'TLSv1.3'],
    minSize: 1
  }),
  clientAuthentication: _configSchema.schema.oneOf([_configSchema.schema.literal('none'), _configSchema.schema.literal('optional'), _configSchema.schema.literal('required')], {
    defaultValue: 'none'
  })
}, {
  validate: ssl => {
    if (ssl.key && ssl.keystore.path) {
      return 'cannot use [key] when [keystore.path] is specified';
    }

    if (ssl.certificate && ssl.keystore.path) {
      return 'cannot use [certificate] when [keystore.path] is specified';
    }

    if (ssl.enabled && (!ssl.key || !ssl.certificate) && !ssl.keystore.path) {
      return 'must specify [certificate] and [key] -- or [keystore.path] -- when ssl is enabled';
    }

    if (!ssl.enabled && ssl.clientAuthentication !== 'none') {
      return 'must enable ssl to use [clientAuthentication]';
    }
  }
});

exports.sslSchema = sslSchema;

class SslConfig {
  /**
   * @internal
   */
  constructor(config) {
    var _config$keystore, _config$truststore;

    (0, _defineProperty2.default)(this, "enabled", void 0);
    (0, _defineProperty2.default)(this, "redirectHttpFromPort", void 0);
    (0, _defineProperty2.default)(this, "key", void 0);
    (0, _defineProperty2.default)(this, "certificate", void 0);
    (0, _defineProperty2.default)(this, "certificateAuthorities", void 0);
    (0, _defineProperty2.default)(this, "keyPassphrase", void 0);
    (0, _defineProperty2.default)(this, "requestCert", void 0);
    (0, _defineProperty2.default)(this, "rejectUnauthorized", void 0);
    (0, _defineProperty2.default)(this, "cipherSuites", void 0);
    (0, _defineProperty2.default)(this, "supportedProtocols", void 0);
    this.enabled = config.enabled;
    this.redirectHttpFromPort = config.redirectHttpFromPort;
    this.cipherSuites = config.cipherSuites;
    this.supportedProtocols = config.supportedProtocols;
    this.requestCert = config.clientAuthentication !== 'none';
    this.rejectUnauthorized = config.clientAuthentication === 'required';

    const addCAs = ca => {
      if (ca && ca.length) {
        this.certificateAuthorities = [...(this.certificateAuthorities || []), ...ca];
      }
    };

    if ((_config$keystore = config.keystore) !== null && _config$keystore !== void 0 && _config$keystore.path) {
      const {
        key,
        cert,
        ca
      } = (0, _crypto.readPkcs12Keystore)(config.keystore.path, config.keystore.password);

      if (!key) {
        throw new Error(`Did not find private key in keystore at [keystore.path].`);
      } else if (!cert) {
        throw new Error(`Did not find certificate in keystore at [keystore.path].`);
      }

      this.key = key;
      this.certificate = cert;
      addCAs(ca);
    } else if (config.key && config.certificate) {
      this.key = readFile(config.key);
      this.keyPassphrase = config.keyPassphrase;
      this.certificate = readFile(config.certificate);
    }

    if ((_config$truststore = config.truststore) !== null && _config$truststore !== void 0 && _config$truststore.path) {
      const ca = (0, _crypto.readPkcs12Truststore)(config.truststore.path, config.truststore.password);
      addCAs(ca);
    }

    const ca = config.certificateAuthorities;

    if (ca) {
      const parsed = [];
      const paths = Array.isArray(ca) ? ca : [ca];

      if (paths.length > 0) {
        for (const path of paths) {
          parsed.push(readFile(path));
        }

        addCAs(parsed);
      }
    }
  }
  /**
   * Options that affect the OpenSSL protocol behavior via numeric bitmask of the SSL_OP_* options from OpenSSL Options.
   */


  getSecureOptions() {
    // our validation should ensure that this.supportedProtocols is at least an empty array,
    // which the following logic depends upon.
    if (this.supportedProtocols == null || this.supportedProtocols.length === 0) {
      throw new Error(`supportedProtocols should be specified`);
    }

    const supportedProtocols = this.supportedProtocols;
    return Array.from(protocolMap).reduce((secureOptions, [protocolAlias, secureOption]) => {
      // `secureOption` is the option that turns *off* support for a particular protocol,
      // so if protocol is supported, we should not enable this option.
      return supportedProtocols.includes(protocolAlias) ? secureOptions : secureOptions | secureOption; // eslint-disable-line no-bitwise
    }, 0);
  }

}

exports.SslConfig = SslConfig;

const readFile = file => (0, _fs.readFileSync)(file, 'utf8');