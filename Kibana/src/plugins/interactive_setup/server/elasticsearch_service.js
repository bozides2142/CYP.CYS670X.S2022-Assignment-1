"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ElasticsearchService = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _elasticsearch = require("@elastic/elasticsearch");

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _tls = _interopRequireDefault(require("tls"));

var _server = require("../../../../src/core/server");

var _common = require("../common");

var _compatibility_error = require("./compatibility_error");

var _errors = require("./errors");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class ElasticsearchService {
  /**
   * Elasticsearch client used to check Elasticsearch connection status.
   */
  constructor(logger, kibanaVersion) {
    (0, _defineProperty2.default)(this, "connectionStatusClient", void 0);
    this.logger = logger;
    this.kibanaVersion = kibanaVersion;
  }

  setup({
    elasticsearch,
    connectionCheckInterval
  }) {
    const connectionStatusClient = this.connectionStatusClient = elasticsearch.createClient('connectionStatus');
    return {
      connectionStatus$: (0, _rxjs.timer)(0, connectionCheckInterval.asMilliseconds()).pipe((0, _operators.exhaustMap)(() => {
        return (0, _rxjs.from)(connectionStatusClient.asInternalUser.ping()).pipe((0, _operators.map)(() => _common.ElasticsearchConnectionStatus.Configured), (0, _operators.catchError)(pingError => (0, _rxjs.of)(pingError instanceof _elasticsearch.errors.ConnectionError ? _common.ElasticsearchConnectionStatus.NotConfigured : _common.ElasticsearchConnectionStatus.Configured)));
      }), (0, _operators.takeWhile)(status => status !== _common.ElasticsearchConnectionStatus.Configured,
      /* inclusive */
      true), (0, _operators.distinctUntilChanged)(), (0, _operators.shareReplay)({
        refCount: true,
        bufferSize: 1
      })),
      enroll: this.enroll.bind(this, elasticsearch),
      authenticate: this.authenticate.bind(this, elasticsearch),
      ping: this.ping.bind(this, elasticsearch)
    };
  }

  stop() {
    if (this.connectionStatusClient) {
      this.connectionStatusClient.close().catch(err => {
        this.logger.debug(`Failed to stop Elasticsearch service: ${(0, _errors.getDetailedErrorMessage)(err)}`);
      });
      this.connectionStatusClient = undefined;
    }
  }
  /**
   * Iterates through provided {@param hosts} one by one trying to call Kibana enrollment API using
   * the specified {@param apiKey}.
   * @param elasticsearch Core Elasticsearch service preboot contract.
   * @param apiKey The ApiKey to use to authenticate Kibana enrollment request.
   * @param hosts The list of Elasticsearch node addresses to enroll with. The addresses are supposed
   * to point to exactly same Elasticsearch node, potentially available via different network interfaces.
   * @param caFingerprint The fingerprint of the root CA certificate that is supposed to sign certificate presented by
   * the Elasticsearch node we're enrolling with. Should be in a form of a hex colon-delimited string in upper case.
   */


  async enroll(elasticsearch, {
    apiKey,
    hosts,
    caFingerprint
  }) {
    const scopeableRequest = {
      headers: {
        authorization: `ApiKey ${apiKey}`
      }
    }; // We should iterate through all provided hosts until we find an accessible one.

    for (const host of hosts) {
      this.logger.debug(`Trying to enroll with "${host}" host using "${caFingerprint}" CA fingerprint.`);
      const enrollClient = elasticsearch.createClient('enroll', {
        hosts: [host],
        caFingerprint,
        ssl: {
          verificationMode: 'none'
        }
      });
      let enrollmentResponse;

      try {
        enrollmentResponse = await enrollClient.asScoped(scopeableRequest).asCurrentUser.transport.request({
          method: 'GET',
          path: '/_security/enroll/kibana'
        });
      } catch (err) {
        // We expect that all hosts belong to exactly same node and any non-connection error for one host would mean
        // that enrollment will fail for any other host and we should bail out.
        if (err instanceof _elasticsearch.errors.ConnectionError || err instanceof _elasticsearch.errors.TimeoutError) {
          this.logger.error(`Unable to connect to host "${host}", will proceed to the next host if available: ${(0, _errors.getDetailedErrorMessage)(err)}`);
          continue;
        }

        this.logger.error(`Failed to enroll with host "${host}": ${(0, _errors.getDetailedErrorMessage)(err)}`);
        throw err;
      } finally {
        await enrollClient.close();
      }

      this.logger.debug(`Successfully enrolled with host "${host}", token name: ${enrollmentResponse.body.token.name}, CA certificate: ${enrollmentResponse.body.http_ca}`);
      const enrollResult = {
        host,
        caCert: ElasticsearchService.createPemCertificate(enrollmentResponse.body.http_ca),
        serviceAccountToken: enrollmentResponse.body.token
      }; // Now try to use retrieved service account and CA certificate to authenticate to this host.

      const authenticateClient = elasticsearch.createClient('authenticate', {
        caFingerprint,
        hosts: [host],
        serviceAccountToken: enrollResult.serviceAccountToken.value,
        ssl: {
          certificateAuthorities: [enrollResult.caCert]
        }
      });
      this.logger.debug(`Verifying if "${enrollmentResponse.body.token.name}" token can authenticate to host "${host}".`);

      try {
        await authenticateClient.asInternalUser.security.authenticate();
        this.logger.debug(`Successfully authenticated "${enrollmentResponse.body.token.name}" token to host "${host}".`);
      } catch (err) {
        this.logger.error(`Failed to authenticate "${enrollmentResponse.body.token.name}" token to host "${host}": ${(0, _errors.getDetailedErrorMessage)(err)}.`);
        await authenticateClient.close();
        throw err;
      }

      const versionCompatibility = await this.checkCompatibility(authenticateClient.asInternalUser);
      await authenticateClient.close();

      if (!versionCompatibility.isCompatible) {
        this.logger.error(`Failed compatibility check of host "${host}": ${versionCompatibility.message}`);
        throw new _compatibility_error.CompatibilityError(versionCompatibility);
      }

      return enrollResult;
    }

    throw new Error('Unable to connect to any of the provided hosts.');
  }

  async authenticate(elasticsearch, {
    host,
    username,
    password,
    caCert
  }) {
    const client = elasticsearch.createClient('authenticate', {
      hosts: [host],
      username,
      password,
      ssl: caCert ? {
        certificateAuthorities: [caCert]
      } : undefined
    });

    try {
      // Using `ping` instead of `authenticate` allows us to verify clusters with both
      // security enabled and disabled.
      await client.asInternalUser.ping();
    } catch (error) {
      this.logger.error(`Failed to authenticate with host "${host}": ${(0, _errors.getDetailedErrorMessage)(error)}`);
      await client.close();
      throw error;
    }

    const versionCompatibility = await this.checkCompatibility(client.asInternalUser);
    await client.close();

    if (!versionCompatibility.isCompatible) {
      this.logger.error(`Failed compatibility check of host "${host}": ${versionCompatibility.message}`);
      throw new _compatibility_error.CompatibilityError(versionCompatibility);
    }
  }

  async ping(elasticsearch, host) {
    const client = elasticsearch.createClient('ping', {
      hosts: [host],
      username: '',
      password: '',
      ssl: {
        verificationMode: 'none'
      }
    });
    this.logger.debug(`Connecting to host "${host}"`);
    let authRequired = false;

    try {
      await client.asInternalUser.ping();
    } catch (error) {
      if (error instanceof _elasticsearch.errors.ConnectionError || error instanceof _elasticsearch.errors.TimeoutError || error instanceof _elasticsearch.errors.ProductNotSupportedError) {
        this.logger.error(`Unable to connect to host "${host}": ${(0, _errors.getDetailedErrorMessage)(error)}`);
        await client.close();
        throw error;
      }

      authRequired = (0, _errors.getErrorStatusCode)(error) === 401;
    }

    this.logger.debug(`Fetching certificate chain from host "${host}"`);
    let certificateChain;
    const {
      protocol,
      hostname,
      port
    } = new URL(host);

    if (protocol === 'https:') {
      try {
        const cert = await ElasticsearchService.fetchPeerCertificate(hostname, port);
        certificateChain = ElasticsearchService.flattenCertificateChain(cert).map(ElasticsearchService.getCertificate);
      } catch (error) {
        this.logger.error(`Failed to fetch peer certificate from host "${host}": ${(0, _errors.getDetailedErrorMessage)(error)}`);
        await client.close();
        throw error;
      }
    } // This check is a security requirement - Do not remove it!


    this.logger.debug(`Verifying that host "${host}" responds with Elastic product header`);

    try {
      var _response$headers;

      const response = await client.asInternalUser.transport.request({
        method: 'OPTIONS',
        path: '/'
      });

      if (((_response$headers = response.headers) === null || _response$headers === void 0 ? void 0 : _response$headers['x-elastic-product']) !== 'Elasticsearch') {
        throw new Error('Host did not respond with valid Elastic product header.');
      }
    } catch (error) {
      this.logger.error(`Host "${host}" is not a valid Elasticsearch cluster: ${(0, _errors.getDetailedErrorMessage)(error)}`);
      await client.close();
      throw error;
    }

    await client.close();
    return {
      authRequired,
      certificateChain
    };
  }

  async checkCompatibility(internalClient) {
    return (0, _server.pollEsNodesVersion)({
      internalClient,
      log: this.logger,
      kibanaVersion: this.kibanaVersion,
      ignoreVersionMismatch: false,
      esVersionCheckInterval: -1 // Passing a negative number here will result in immediate completion after the first value is emitted

    }).pipe((0, _operators.first)()).toPromise();
  }

  static fetchPeerCertificate(host, port) {
    return new Promise((resolve, reject) => {
      const socket = _tls.default.connect({
        host,
        port: Number(port),
        rejectUnauthorized: false
      });

      socket.once('secureConnect', () => {
        const cert = socket.getPeerCertificate(true);
        socket.destroy();
        resolve(cert);
      });
      socket.once('error', reject);
    });
  }

  static flattenCertificateChain(cert, accumulator = []) {
    accumulator.push(cert);

    if (cert.issuerCertificate && cert.fingerprint256 !== cert.issuerCertificate.fingerprint256) {
      ElasticsearchService.flattenCertificateChain(cert.issuerCertificate, accumulator);
    }

    return accumulator;
  }

  static getCertificate(cert) {
    return {
      issuer: cert.issuer,
      valid_from: cert.valid_from,
      valid_to: cert.valid_to,
      subject: cert.subject,
      fingerprint256: cert.fingerprint256,
      raw: cert.raw.toString('base64')
    };
  }

  static createPemCertificate(derCaString) {
    // Use `X509Certificate` class once we upgrade to Node v16.
    return `-----BEGIN CERTIFICATE-----\n${derCaString.replace(/_/g, '/').replace(/-/g, '+').replace(/([^\n]{1,65})/g, '$1\n').replace(/\n$/g, '')}\n-----END CERTIFICATE-----\n`;
  }

  static formatFingerprint(caFingerprint) {
    var _caFingerprint$toUppe, _caFingerprint$toUppe2;

    // Convert a plain hex string returned in the enrollment token to a format that ES client
    // expects, i.e. to a colon delimited hex string in upper case: deadbeef -> DE:AD:BE:EF.
    return (_caFingerprint$toUppe = (_caFingerprint$toUppe2 = caFingerprint.toUpperCase().match(/.{1,2}/g)) === null || _caFingerprint$toUppe2 === void 0 ? void 0 : _caFingerprint$toUppe2.join(':')) !== null && _caFingerprint$toUppe !== void 0 ? _caFingerprint$toUppe : '';
  }

}

exports.ElasticsearchService = ElasticsearchService;