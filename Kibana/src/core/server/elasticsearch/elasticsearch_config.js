"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configSchema = exports.config = exports.ElasticsearchConfig = exports.DEFAULT_API_VERSION = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _configSchema = require("@kbn/config-schema");

var _crypto = require("@kbn/crypto");

var _i18n = require("@kbn/i18n");

var _fs = require("fs");

var _default_headers = require("./default_headers");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const hostURISchema = _configSchema.schema.uri({
  scheme: ['http', 'https']
});

const DEFAULT_API_VERSION = 'master';
exports.DEFAULT_API_VERSION = DEFAULT_API_VERSION;

/**
 * Validation schema for elasticsearch service config. It can be reused when plugins allow users
 * to specify a local elasticsearch config.
 * @public
 */
const configSchema = _configSchema.schema.object({
  sniffOnStart: _configSchema.schema.boolean({
    defaultValue: false
  }),
  sniffInterval: _configSchema.schema.oneOf([_configSchema.schema.duration(), _configSchema.schema.literal(false)], {
    defaultValue: false
  }),
  sniffOnConnectionFault: _configSchema.schema.boolean({
    defaultValue: false
  }),
  hosts: _configSchema.schema.oneOf([hostURISchema, _configSchema.schema.arrayOf(hostURISchema, {
    minSize: 1
  })], {
    defaultValue: 'http://localhost:9200'
  }),
  compression: _configSchema.schema.boolean({
    defaultValue: false
  }),
  username: _configSchema.schema.maybe(_configSchema.schema.string({
    validate: rawConfig => {
      if (rawConfig === 'elastic') {
        return 'value of "elastic" is forbidden. This is a superuser account that cannot write to system indices that Kibana needs to ' + 'function. Use a service account token instead. Learn more: ' + 'https://www.elastic.co/guide/en/elasticsearch/reference/8.0/service-accounts.html' // we don't have a way to pass a branch into the config schema; hardcoding this one link to the 8.0 docs is OK
        ;
      }
    }
  })),
  password: _configSchema.schema.maybe(_configSchema.schema.string()),
  serviceAccountToken: _configSchema.schema.maybe(_configSchema.schema.conditional(_configSchema.schema.siblingRef('username'), _configSchema.schema.never(), _configSchema.schema.string(), _configSchema.schema.string({
    validate: () => {
      return `serviceAccountToken cannot be specified when "username" is also set.`;
    }
  }))),
  requestHeadersWhitelist: _configSchema.schema.oneOf([_configSchema.schema.string({
    // can't use `validate` option on union types, forced to validate each individual subtypes
    // see https://github.com/elastic/kibana/issues/64906
    validate: headersWhitelist => {
      const reservedHeaders = (0, _default_headers.getReservedHeaders)([headersWhitelist]);

      if (reservedHeaders.length) {
        return `cannot use reserved headers: [${reservedHeaders.join(', ')}]`;
      }
    }
  }), _configSchema.schema.arrayOf(_configSchema.schema.string(), {
    // can't use `validate` option on union types, forced to validate each individual subtypes
    // see https://github.com/elastic/kibana/issues/64906
    validate: headersWhitelist => {
      const reservedHeaders = (0, _default_headers.getReservedHeaders)(headersWhitelist);

      if (reservedHeaders.length) {
        return `cannot use reserved headers: [${reservedHeaders.join(', ')}]`;
      }
    }
  })], {
    defaultValue: ['authorization']
  }),
  customHeaders: _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.string(), {
    defaultValue: {},
    validate: customHeaders => {
      const reservedHeaders = (0, _default_headers.getReservedHeaders)(Object.keys(customHeaders));

      if (reservedHeaders.length) {
        return `cannot use reserved headers: [${reservedHeaders.join(', ')}]`;
      }
    }
  }),
  shardTimeout: _configSchema.schema.duration({
    defaultValue: '30s'
  }),
  requestTimeout: _configSchema.schema.duration({
    defaultValue: '30s'
  }),
  pingTimeout: _configSchema.schema.duration({
    defaultValue: _configSchema.schema.siblingRef('requestTimeout')
  }),
  logQueries: _configSchema.schema.boolean({
    defaultValue: false
  }),
  ssl: _configSchema.schema.object({
    verificationMode: _configSchema.schema.oneOf([_configSchema.schema.literal('none'), _configSchema.schema.literal('certificate'), _configSchema.schema.literal('full')], {
      defaultValue: 'full'
    }),
    certificateAuthorities: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.arrayOf(_configSchema.schema.string(), {
      minSize: 1
    })])),
    certificate: _configSchema.schema.maybe(_configSchema.schema.string()),
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
    alwaysPresentCertificate: _configSchema.schema.boolean({
      defaultValue: false
    })
  }, {
    validate: rawConfig => {
      if (rawConfig.key && rawConfig.keystore.path) {
        return 'cannot use [key] when [keystore.path] is specified';
      }

      if (rawConfig.certificate && rawConfig.keystore.path) {
        return 'cannot use [certificate] when [keystore.path] is specified';
      }
    }
  }),
  apiVersion: _configSchema.schema.string({
    defaultValue: DEFAULT_API_VERSION
  }),
  healthCheck: _configSchema.schema.object({
    delay: _configSchema.schema.duration({
      defaultValue: 2500
    })
  }),
  ignoreVersionMismatch: _configSchema.schema.conditional(_configSchema.schema.contextRef('dev'), false, _configSchema.schema.boolean({
    validate: rawValue => {
      if (rawValue === true) {
        return '"ignoreVersionMismatch" can only be set to true in development mode';
      }
    },
    defaultValue: false
  }), _configSchema.schema.boolean({
    defaultValue: false
  })),
  skipStartupConnectionCheck: _configSchema.schema.conditional( // Using dist over dev because integration_tests run with dev: false,
  // and this config is solely introduced to allow some of the integration tests to run without an ES server.
  _configSchema.schema.contextRef('dist'), true, _configSchema.schema.boolean({
    validate: rawValue => {
      if (rawValue === true) {
        return '"skipStartupConnectionCheck" can only be set to true when running from source to allow integration tests to run without an ES server';
      }
    },
    defaultValue: false
  }), _configSchema.schema.boolean({
    defaultValue: false
  }))
});

exports.configSchema = configSchema;

const deprecations = () => [(settings, fromPath, addDeprecation, {
  branch
}) => {
  var _es$ssl, _es$ssl2, _es$ssl3, _es$ssl4;

  const es = settings[fromPath];

  if (!es) {
    return;
  }

  if (es.username === 'kibana') {
    const username = es.username;
    addDeprecation({
      configPath: `${fromPath}.username`,
      title: _i18n.i18n.translate('core.deprecations.elasticsearchUsername.title', {
        defaultMessage: 'Using "elasticsearch.username: {username}" is deprecated',
        values: {
          username
        }
      }),
      message: _i18n.i18n.translate('core.deprecations.elasticsearchUsername.message', {
        defaultMessage: 'Kibana is configured to authenticate to Elasticsearch with the "{username}" user. Use a service account token instead.',
        values: {
          username
        }
      }),
      level: 'warning',
      documentationUrl: `https://www.elastic.co/guide/en/elasticsearch/reference/${branch}/service-accounts.html`,
      correctiveActions: {
        manualSteps: [_i18n.i18n.translate('core.deprecations.elasticsearchUsername.manualSteps1', {
          defaultMessage: 'Use the elasticsearch-service-tokens CLI tool to create a new service account token for the "elastic/kibana" service account.'
        }), _i18n.i18n.translate('core.deprecations.elasticsearchUsername.manualSteps2', {
          defaultMessage: 'Add the "elasticsearch.serviceAccountToken" setting to kibana.yml.'
        }), _i18n.i18n.translate('core.deprecations.elasticsearchUsername.manualSteps3', {
          defaultMessage: 'Remove "elasticsearch.username" and "elasticsearch.password" from kibana.yml.'
        })]
      }
    });
  }

  const addSslDeprecation = (existingSetting, missingSetting) => {
    addDeprecation({
      configPath: existingSetting,
      title: _i18n.i18n.translate('core.deprecations.elasticsearchSSL.title', {
        defaultMessage: 'Using "{existingSetting}" without "{missingSetting}" has no effect',
        values: {
          existingSetting,
          missingSetting
        }
      }),
      message: _i18n.i18n.translate('core.deprecations.elasticsearchSSL.message', {
        defaultMessage: 'Use both "{existingSetting}" and "{missingSetting}" to enable Kibana to use Mutual TLS authentication with Elasticsearch.',
        values: {
          existingSetting,
          missingSetting
        }
      }),
      level: 'warning',
      documentationUrl: `https://www.elastic.co/guide/en/kibana/${branch}/elasticsearch-mutual-tls.html`,
      correctiveActions: {
        manualSteps: [_i18n.i18n.translate('core.deprecations.elasticsearchSSL.manualSteps1', {
          defaultMessage: 'Add the "{missingSetting}" setting to kibana.yml.',
          values: {
            missingSetting
          }
        }), _i18n.i18n.translate('core.deprecations.elasticsearchSSL.manualSteps2', {
          defaultMessage: 'Alternatively, if you don\'t want to use Mutual TLS authentication, remove "{existingSetting}" from kibana.yml.',
          values: {
            existingSetting
          }
        })]
      }
    });
  };

  if (((_es$ssl = es.ssl) === null || _es$ssl === void 0 ? void 0 : _es$ssl.key) !== undefined && ((_es$ssl2 = es.ssl) === null || _es$ssl2 === void 0 ? void 0 : _es$ssl2.certificate) === undefined) {
    addSslDeprecation(`${fromPath}.ssl.key`, `${fromPath}.ssl.certificate`);
  } else if (((_es$ssl3 = es.ssl) === null || _es$ssl3 === void 0 ? void 0 : _es$ssl3.certificate) !== undefined && ((_es$ssl4 = es.ssl) === null || _es$ssl4 === void 0 ? void 0 : _es$ssl4.key) === undefined) {
    addSslDeprecation(`${fromPath}.ssl.certificate`, `${fromPath}.ssl.key`);
  }

  if (es.logQueries === true) {
    addDeprecation({
      configPath: `${fromPath}.logQueries`,
      level: 'warning',
      message: `Setting [${fromPath}.logQueries] is deprecated and no longer used. You should set the log level to "debug" for the "elasticsearch.query" context in "logging.loggers".`,
      correctiveActions: {
        manualSteps: [`Remove Setting [${fromPath}.logQueries] from your kibana configs`, `Set the log level to "debug" for the "elasticsearch.query" context in "logging.loggers".`]
      }
    });
  }

  return;
}];

const config = {
  path: 'elasticsearch',
  schema: configSchema,
  deprecations
};
/**
 * Wrapper of config schema.
 * @public
 */

exports.config = config;

class ElasticsearchConfig {
  /**
   * @internal
   * Only valid in dev mode. Skip the valid connection check during startup. The connection check allows
   * Kibana to ensure that the Elasticsearch connection is valid before allowing
   * any other services to be set up.
   *
   * @remarks
   * You should disable this check at your own risk: Other services in Kibana
   * may fail if this step is not completed.
   */

  /**
   * The interval between health check requests Kibana sends to the Elasticsearch.
   */

  /**
   * Whether to allow kibana to connect to a non-compatible elasticsearch node.
   */

  /**
   * Version of the Elasticsearch (6.7, 7.1 or `master`) client will be connecting to.
   */

  /**
   * Whether to use compression for communications with elasticsearch.
   */

  /**
   * Hosts that the client will connect to. If sniffing is enabled, this list will
   * be used as seeds to discover the rest of your cluster.
   */

  /**
   * List of Kibana client-side headers to send to Elasticsearch when request
   * scoped cluster client is used. If this is an empty array then *no* client-side
   * will be sent.
   */

  /**
   * Timeout after which PING HTTP request will be aborted and retried.
   */

  /**
   * Timeout after which HTTP request will be aborted and retried.
   */

  /**
   * Timeout for Elasticsearch to wait for responses from shards. Set to 0 to disable.
   */

  /**
   * Specifies whether the client should attempt to detect the rest of the cluster
   * when it is first instantiated.
   */

  /**
   * Interval to perform a sniff operation and make sure the list of nodes is complete.
   * If `false` then sniffing is disabled.
   */

  /**
   * Specifies whether the client should immediately sniff for a more current list
   * of nodes when a connection dies.
   */

  /**
   * If Elasticsearch is protected with basic authentication, this setting provides
   * the username that the Kibana server uses to perform its administrative functions.
   * Cannot be used in conjunction with serviceAccountToken.
   */

  /**
   * If Elasticsearch is protected with basic authentication, this setting provides
   * the password that the Kibana server uses to perform its administrative functions.
   */

  /**
   * If Elasticsearch security features are enabled, this setting provides the service account
   * token that the Kibana server users to perform its administrative functions.
   *
   * This is an alternative to specifying a username and password.
   */

  /**
   * Set of settings configure SSL connection between Kibana and Elasticsearch that
   * are required when `xpack.ssl.verification_mode` in Elasticsearch is set to
   * either `certificate` or `full`.
   */

  /**
   * Header names and values to send to Elasticsearch with every request. These
   * headers cannot be overwritten by client-side headers and aren't affected by
   * `requestHeadersWhitelist` configuration.
   */
  constructor(rawConfig) {
    (0, _defineProperty2.default)(this, "skipStartupConnectionCheck", void 0);
    (0, _defineProperty2.default)(this, "healthCheckDelay", void 0);
    (0, _defineProperty2.default)(this, "ignoreVersionMismatch", void 0);
    (0, _defineProperty2.default)(this, "apiVersion", void 0);
    (0, _defineProperty2.default)(this, "compression", void 0);
    (0, _defineProperty2.default)(this, "hosts", void 0);
    (0, _defineProperty2.default)(this, "requestHeadersWhitelist", void 0);
    (0, _defineProperty2.default)(this, "pingTimeout", void 0);
    (0, _defineProperty2.default)(this, "requestTimeout", void 0);
    (0, _defineProperty2.default)(this, "shardTimeout", void 0);
    (0, _defineProperty2.default)(this, "sniffOnStart", void 0);
    (0, _defineProperty2.default)(this, "sniffInterval", void 0);
    (0, _defineProperty2.default)(this, "sniffOnConnectionFault", void 0);
    (0, _defineProperty2.default)(this, "username", void 0);
    (0, _defineProperty2.default)(this, "password", void 0);
    (0, _defineProperty2.default)(this, "serviceAccountToken", void 0);
    (0, _defineProperty2.default)(this, "ssl", void 0);
    (0, _defineProperty2.default)(this, "customHeaders", void 0);
    this.ignoreVersionMismatch = rawConfig.ignoreVersionMismatch;
    this.apiVersion = rawConfig.apiVersion;
    this.hosts = Array.isArray(rawConfig.hosts) ? rawConfig.hosts : [rawConfig.hosts];
    this.requestHeadersWhitelist = Array.isArray(rawConfig.requestHeadersWhitelist) ? rawConfig.requestHeadersWhitelist : [rawConfig.requestHeadersWhitelist];
    this.pingTimeout = rawConfig.pingTimeout;
    this.requestTimeout = rawConfig.requestTimeout;
    this.shardTimeout = rawConfig.shardTimeout;
    this.sniffOnStart = rawConfig.sniffOnStart;
    this.sniffOnConnectionFault = rawConfig.sniffOnConnectionFault;
    this.sniffInterval = rawConfig.sniffInterval;
    this.healthCheckDelay = rawConfig.healthCheck.delay;
    this.username = rawConfig.username;
    this.password = rawConfig.password;
    this.serviceAccountToken = rawConfig.serviceAccountToken;
    this.customHeaders = rawConfig.customHeaders;
    this.compression = rawConfig.compression;
    this.skipStartupConnectionCheck = rawConfig.skipStartupConnectionCheck;
    const {
      alwaysPresentCertificate,
      verificationMode
    } = rawConfig.ssl;
    const {
      key,
      keyPassphrase,
      certificate,
      certificateAuthorities
    } = readKeyAndCerts(rawConfig);
    this.ssl = {
      alwaysPresentCertificate,
      key,
      keyPassphrase,
      certificate,
      certificateAuthorities,
      verificationMode
    };
  }

}

exports.ElasticsearchConfig = ElasticsearchConfig;

const readKeyAndCerts = rawConfig => {
  var _rawConfig$ssl$keysto, _rawConfig$ssl$trusts;

  let key;
  let keyPassphrase;
  let certificate;
  let certificateAuthorities;

  const addCAs = ca => {
    if (ca && ca.length) {
      certificateAuthorities = [...(certificateAuthorities || []), ...ca];
    }
  };

  if ((_rawConfig$ssl$keysto = rawConfig.ssl.keystore) !== null && _rawConfig$ssl$keysto !== void 0 && _rawConfig$ssl$keysto.path) {
    const keystore = (0, _crypto.readPkcs12Keystore)(rawConfig.ssl.keystore.path, rawConfig.ssl.keystore.password);

    if (!keystore.key) {
      throw new Error(`Did not find key in Elasticsearch keystore.`);
    } else if (!keystore.cert) {
      throw new Error(`Did not find certificate in Elasticsearch keystore.`);
    }

    key = keystore.key;
    certificate = keystore.cert;
    addCAs(keystore.ca);
  } else {
    if (rawConfig.ssl.key) {
      key = readFile(rawConfig.ssl.key);
      keyPassphrase = rawConfig.ssl.keyPassphrase;
    }

    if (rawConfig.ssl.certificate) {
      certificate = readFile(rawConfig.ssl.certificate);
    }
  }

  if ((_rawConfig$ssl$trusts = rawConfig.ssl.truststore) !== null && _rawConfig$ssl$trusts !== void 0 && _rawConfig$ssl$trusts.path) {
    const ca = (0, _crypto.readPkcs12Truststore)(rawConfig.ssl.truststore.path, rawConfig.ssl.truststore.password);
    addCAs(ca);
  }

  const ca = rawConfig.ssl.certificateAuthorities;

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

  return {
    key,
    keyPassphrase,
    certificate,
    certificateAuthorities
  };
};

const readFile = file => {
  return (0, _fs.readFileSync)(file, 'utf8');
};