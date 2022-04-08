"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KibanaConfigWriter = void 0;

var _crypto = require("crypto");

var _fs = require("fs");

var _promises = _interopRequireDefault(require("fs/promises"));

var _jsYaml = _interopRequireDefault(require("js-yaml"));

var _path = _interopRequireDefault(require("path"));

var _std = require("@kbn/std");

var _errors = require("./errors");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class KibanaConfigWriter {
  constructor(configPath, dataDirectoryPath, logger) {
    this.configPath = configPath;
    this.dataDirectoryPath = dataDirectoryPath;
    this.logger = logger;
  }
  /**
   * Checks if we can write to the Kibana configuration file and data directory.
   */


  async isConfigWritable() {
    try {
      // We perform two separate checks here:
      // 1. If we can write to data directory to add a new CA certificate file.
      // 2. If we can write to the Kibana configuration file if it exists.
      await Promise.all([_promises.default.access(this.dataDirectoryPath, _fs.constants.W_OK), _promises.default.access(this.configPath, _fs.constants.W_OK)]);
      return true;
    } catch {
      return false;
    }
  }
  /**
   * Writes Elasticsearch configuration to the disk.
   * @param params
   */


  async writeConfig(params) {
    const caPath = _path.default.join(this.dataDirectoryPath, `ca_${Date.now()}.crt`);

    const config = {
      'elasticsearch.hosts': [params.host]
    };

    if ('serviceAccountToken' in params && params.serviceAccountToken) {
      config['elasticsearch.serviceAccountToken'] = params.serviceAccountToken.value;
    } else if ('username' in params && params.username) {
      config['elasticsearch.username'] = params.username;
      config['elasticsearch.password'] = params.password;
    }

    if (params.caCert) {
      config['elasticsearch.ssl.certificateAuthorities'] = [caPath];
    } // If a certificate is passed configure Fleet default output


    if (params.caCert) {
      try {
        config['xpack.fleet.outputs'] = KibanaConfigWriter.getFleetDefaultOutputConfig(params.caCert, params.host);
      } catch (err) {
        this.logger.error(`Failed to generate Fleet default output: ${(0, _errors.getDetailedErrorMessage)(err)}.`);
        throw err;
      }
    } // Load and parse existing configuration file to check if it already has values for the config
    // entries we want to write.


    const existingConfig = await this.loadAndParseKibanaConfig();
    const conflictingKeys = Object.keys(config).filter(configKey => configKey in existingConfig.parsed); // If existing config has conflicting entries, back it up first.

    let configToWrite;

    if (conflictingKeys.length > 0) {
      this.logger.warn(`Kibana configuration file has the following conflicting keys that will be overridden: [${conflictingKeys.join(', ')}].`);
      const existingCommentedConfig = KibanaConfigWriter.commentOutKibanaConfig(existingConfig.raw);
      configToWrite = `${existingCommentedConfig}\n\n# This section was automatically generated during setup.\n${_jsYaml.default.safeDump({ ...existingConfig.parsed,
        ...config
      }, {
        flowLevel: 1
      })}\n`;
    } else {
      configToWrite = `${existingConfig.raw}\n\n# This section was automatically generated during setup.\n${_jsYaml.default.safeDump(config, {
        flowLevel: 1
      })}\n`;
    }

    if (params.caCert) {
      this.logger.debug(`Writing CA certificate to ${caPath}.`);

      try {
        await _promises.default.writeFile(caPath, params.caCert);
        this.logger.debug(`Successfully wrote CA certificate to ${caPath}.`);
      } catch (err) {
        this.logger.error(`Failed to write CA certificate to ${caPath}: ${(0, _errors.getDetailedErrorMessage)(err)}.`);
        throw err;
      }
    }

    this.logger.debug(`Writing Elasticsearch configuration to ${this.configPath}.`);

    try {
      await _promises.default.writeFile(this.configPath, configToWrite);
      this.logger.debug(`Successfully wrote Elasticsearch configuration to ${this.configPath}.`);
    } catch (err) {
      this.logger.error(`Failed to write  Elasticsearch configuration to ${this.configPath}: ${(0, _errors.getDetailedErrorMessage)(err)}.`);
      throw err;
    }
  }
  /**
   * Loads and parses existing Kibana configuration file.
   */


  async loadAndParseKibanaConfig() {
    let rawConfig;

    try {
      rawConfig = await _promises.default.readFile(this.configPath, 'utf-8');
    } catch (err) {
      this.logger.error(`Failed to read configuration file: ${(0, _errors.getDetailedErrorMessage)(err)}.`);
      throw err;
    }

    let parsedConfig;

    try {
      var _yaml$safeLoad;

      parsedConfig = (0, _std.getFlattenedObject)((_yaml$safeLoad = _jsYaml.default.safeLoad(rawConfig)) !== null && _yaml$safeLoad !== void 0 ? _yaml$safeLoad : {});
    } catch (err) {
      this.logger.error(`Failed to parse configuration file: ${(0, _errors.getDetailedErrorMessage)(err)}.`);
      throw err;
    }

    return {
      raw: rawConfig,
      parsed: parsedConfig
    };
  }
  /**
   * Build config for Fleet outputs
   * @param caCert
   * @param host
   */


  static getFleetDefaultOutputConfig(caCert, host) {
    const cert = new _crypto.X509Certificate(caCert); // fingerprint256 is a ":" separated uppercase hexadecimal string

    const certFingerprint = cert.fingerprint256.split(':').join('').toLowerCase();
    return [{
      id: 'fleet-default-output',
      name: 'default',
      is_default: true,
      is_default_monitoring: true,
      type: 'elasticsearch',
      hosts: [host],
      ca_trusted_fingerprint: certFingerprint
    }];
  }
  /**
   * Comments out all non-commented entries in the Kibana configuration file.
   * @param rawConfig Content of the Kibana configuration file.
   */


  static commentOutKibanaConfig(rawConfig) {
    const backupTimestamp = new Date().toISOString();
    const commentedRawConfigLines = [`### >>>>>>> BACKUP START: Kibana interactive setup (${backupTimestamp})\n`];

    for (const rawConfigLine of rawConfig.split('\n')) {
      const trimmedLine = rawConfigLine.trim();
      commentedRawConfigLines.push(trimmedLine.length === 0 || trimmedLine.startsWith('#') ? rawConfigLine : `#${rawConfigLine}`);
    }

    return [...commentedRawConfigLines, `### >>>>>>> BACKUP END: Kibana interactive setup (${backupTimestamp})`].join('\n');
  }

}

exports.KibanaConfigWriter = KibanaConfigWriter;