"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uuidRegexp = exports.config = exports.HttpConfig = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _configSchema = require("@kbn/config-schema");

var _serverHttpTools = require("@kbn/server-http-tools");

var _os = require("os");

var _url = _interopRequireDefault(require("url"));

var _csp = require("../csp");

var _security_response_headers_config = require("./security_response_headers_config");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const validBasePathRegex = /^\/.*[^\/]$/;
const uuidRegexp = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
exports.uuidRegexp = uuidRegexp;

const hostURISchema = _configSchema.schema.uri({
  scheme: ['http', 'https']
});

const match = (regex, errorMsg) => str => regex.test(str) ? undefined : errorMsg; // The lower-case set of response headers which are forbidden within `customResponseHeaders`.


const RESPONSE_HEADER_DENY_LIST = ['location', 'refresh'];

const configSchema = _configSchema.schema.object({
  name: _configSchema.schema.string({
    defaultValue: () => (0, _os.hostname)()
  }),
  autoListen: _configSchema.schema.boolean({
    defaultValue: true
  }),
  publicBaseUrl: _configSchema.schema.maybe(_configSchema.schema.uri({
    scheme: ['http', 'https']
  })),
  basePath: _configSchema.schema.maybe(_configSchema.schema.string({
    validate: match(validBasePathRegex, "must start with a slash, don't end with one")
  })),
  shutdownTimeout: _configSchema.schema.duration({
    defaultValue: '30s',
    validate: duration => {
      const durationMs = duration.asMilliseconds();

      if (durationMs < 1000 || durationMs > 2 * 60 * 1000) {
        return 'the value should be between 1 second and 2 minutes';
      }
    }
  }),
  cors: _configSchema.schema.object({
    enabled: _configSchema.schema.boolean({
      defaultValue: false
    }),
    allowCredentials: _configSchema.schema.boolean({
      defaultValue: false
    }),
    allowOrigin: _configSchema.schema.oneOf([_configSchema.schema.arrayOf(hostURISchema, {
      minSize: 1
    }), _configSchema.schema.arrayOf(_configSchema.schema.literal('*'), {
      minSize: 1,
      maxSize: 1
    })], {
      defaultValue: ['*']
    })
  }, {
    validate(value) {
      if (value.allowCredentials === true && value.allowOrigin.includes('*')) {
        return 'Cannot specify wildcard origin "*" with "credentials: true". Please provide a list of allowed origins.';
      }
    }

  }),
  securityResponseHeaders: _security_response_headers_config.securityResponseHeadersSchema,
  customResponseHeaders: _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.any(), {
    defaultValue: {},

    validate(value) {
      const forbiddenKeys = Object.keys(value).filter(headerName => RESPONSE_HEADER_DENY_LIST.includes(headerName.toLowerCase()));

      if (forbiddenKeys.length > 0) {
        return `The following custom response headers are not allowed to be set: ${forbiddenKeys.join(', ')}`;
      }
    }

  }),
  host: _configSchema.schema.string({
    defaultValue: 'localhost',
    hostname: true
  }),
  maxPayload: _configSchema.schema.byteSize({
    defaultValue: '1048576b'
  }),
  port: _configSchema.schema.number({
    defaultValue: 5601
  }),
  rewriteBasePath: _configSchema.schema.boolean({
    defaultValue: false
  }),
  ssl: _serverHttpTools.sslSchema,
  keepaliveTimeout: _configSchema.schema.number({
    defaultValue: 120000
  }),
  socketTimeout: _configSchema.schema.number({
    defaultValue: 120000
  }),
  compression: _configSchema.schema.object({
    enabled: _configSchema.schema.boolean({
      defaultValue: true
    }),
    referrerWhitelist: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string({
      hostname: true
    }), {
      minSize: 1
    }))
  }),
  uuid: _configSchema.schema.maybe(_configSchema.schema.string({
    validate: match(uuidRegexp, 'must be a valid uuid')
  })),
  xsrf: _configSchema.schema.object({
    disableProtection: _configSchema.schema.boolean({
      defaultValue: false
    }),
    allowlist: _configSchema.schema.arrayOf(_configSchema.schema.string({
      validate: match(/^\//, 'must start with a slash')
    }), {
      defaultValue: []
    })
  }),
  requestId: _configSchema.schema.object({
    allowFromAnyIp: _configSchema.schema.boolean({
      defaultValue: false
    }),
    ipAllowlist: _configSchema.schema.arrayOf(_configSchema.schema.ip(), {
      defaultValue: []
    })
  }, {
    validate(value) {
      var _value$ipAllowlist;

      if (value.allowFromAnyIp === true && ((_value$ipAllowlist = value.ipAllowlist) === null || _value$ipAllowlist === void 0 ? void 0 : _value$ipAllowlist.length) > 0) {
        return `allowFromAnyIp must be set to 'false' if any values are specified in ipAllowlist`;
      }
    }

  })
}, {
  validate: rawConfig => {
    if (!rawConfig.basePath && rawConfig.rewriteBasePath) {
      return 'cannot use [rewriteBasePath] when [basePath] is not specified';
    }

    if (rawConfig.publicBaseUrl) {
      var _rawConfig$basePath;

      const parsedUrl = _url.default.parse(rawConfig.publicBaseUrl);

      if (parsedUrl.query || parsedUrl.hash || parsedUrl.auth) {
        return `[publicBaseUrl] may only contain a protocol, host, port, and pathname`;
      }

      if (parsedUrl.path !== ((_rawConfig$basePath = rawConfig.basePath) !== null && _rawConfig$basePath !== void 0 ? _rawConfig$basePath : '/')) {
        return `[publicBaseUrl] must contain the [basePath]: ${parsedUrl.path} !== ${rawConfig.basePath}`;
      }
    }

    if (!rawConfig.compression.enabled && rawConfig.compression.referrerWhitelist) {
      return 'cannot use [compression.referrerWhitelist] when [compression.enabled] is set to false';
    }

    if (rawConfig.ssl.enabled && rawConfig.ssl.redirectHttpFromPort !== undefined && rawConfig.ssl.redirectHttpFromPort === rawConfig.port) {
      return 'Kibana does not accept http traffic to [port] when ssl is ' + 'enabled (only https is allowed), so [ssl.redirectHttpFromPort] ' + `cannot be configured to the same value. Both are [${rawConfig.port}].`;
    }
  }
});

const config = {
  path: 'server',
  schema: configSchema,
  deprecations: ({
    rename
  }) => [rename('maxPayloadBytes', 'maxPayload', {
    level: 'warning'
  })]
};
exports.config = config;

class HttpConfig {
  /**
   * @internal
   */
  constructor(rawHttpConfig, rawCspConfig, rawExternalUrlConfig) {
    var _rawHttpConfig$custom;

    (0, _defineProperty2.default)(this, "name", void 0);
    (0, _defineProperty2.default)(this, "autoListen", void 0);
    (0, _defineProperty2.default)(this, "host", void 0);
    (0, _defineProperty2.default)(this, "keepaliveTimeout", void 0);
    (0, _defineProperty2.default)(this, "socketTimeout", void 0);
    (0, _defineProperty2.default)(this, "port", void 0);
    (0, _defineProperty2.default)(this, "cors", void 0);
    (0, _defineProperty2.default)(this, "securityResponseHeaders", void 0);
    (0, _defineProperty2.default)(this, "customResponseHeaders", void 0);
    (0, _defineProperty2.default)(this, "maxPayload", void 0);
    (0, _defineProperty2.default)(this, "basePath", void 0);
    (0, _defineProperty2.default)(this, "publicBaseUrl", void 0);
    (0, _defineProperty2.default)(this, "rewriteBasePath", void 0);
    (0, _defineProperty2.default)(this, "ssl", void 0);
    (0, _defineProperty2.default)(this, "compression", void 0);
    (0, _defineProperty2.default)(this, "csp", void 0);
    (0, _defineProperty2.default)(this, "externalUrl", void 0);
    (0, _defineProperty2.default)(this, "xsrf", void 0);
    (0, _defineProperty2.default)(this, "requestId", void 0);
    (0, _defineProperty2.default)(this, "shutdownTimeout", void 0);
    this.autoListen = rawHttpConfig.autoListen;
    this.host = rawHttpConfig.host;
    this.port = rawHttpConfig.port;
    this.cors = rawHttpConfig.cors;
    const {
      securityResponseHeaders,
      disableEmbedding
    } = (0, _security_response_headers_config.parseRawSecurityResponseHeadersConfig)(rawHttpConfig.securityResponseHeaders);
    this.securityResponseHeaders = securityResponseHeaders;
    this.customResponseHeaders = Object.entries((_rawHttpConfig$custom = rawHttpConfig.customResponseHeaders) !== null && _rawHttpConfig$custom !== void 0 ? _rawHttpConfig$custom : {}).reduce((headers, [key, value]) => {
      return { ...headers,
        [key]: Array.isArray(value) ? value.map(e => convertHeader(e)) : convertHeader(value)
      };
    }, {});
    this.maxPayload = rawHttpConfig.maxPayload;
    this.name = rawHttpConfig.name;
    this.basePath = rawHttpConfig.basePath;
    this.publicBaseUrl = rawHttpConfig.publicBaseUrl;
    this.keepaliveTimeout = rawHttpConfig.keepaliveTimeout;
    this.socketTimeout = rawHttpConfig.socketTimeout;
    this.rewriteBasePath = rawHttpConfig.rewriteBasePath;
    this.ssl = new _serverHttpTools.SslConfig(rawHttpConfig.ssl || {});
    this.compression = rawHttpConfig.compression;
    this.csp = new _csp.CspConfig({ ...rawCspConfig,
      disableEmbedding
    });
    this.externalUrl = rawExternalUrlConfig;
    this.xsrf = rawHttpConfig.xsrf;
    this.requestId = rawHttpConfig.requestId;
    this.shutdownTimeout = rawHttpConfig.shutdownTimeout;
  }

}

exports.HttpConfig = HttpConfig;

const convertHeader = entry => {
  return typeof entry === 'object' ? JSON.stringify(entry) : String(entry);
};