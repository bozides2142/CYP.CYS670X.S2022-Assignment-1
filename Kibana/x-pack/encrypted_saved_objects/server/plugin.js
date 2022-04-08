"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EncryptedSavedObjectsPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _nodeCrypto = _interopRequireDefault(require("@elastic/node-crypto"));

var _create_migration = require("./create_migration");

var _crypto = require("./crypto");

var _routes = require("./routes");

var _saved_objects = require("./saved_objects");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Represents EncryptedSavedObjects Plugin instance that will be managed by the Kibana plugin system.
 */


class EncryptedSavedObjectsPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "savedObjectsSetup", void 0);
    this.initializerContext = initializerContext;
    this.logger = this.initializerContext.logger.get();
  }

  setup(core, deps) {
    const config = this.initializerContext.config.get();
    const canEncrypt = config.encryptionKey !== undefined;

    if (!canEncrypt) {
      this.logger.warn('Saved objects encryption key is not set. This will severely limit Kibana functionality. ' + 'Please set xpack.encryptedSavedObjects.encryptionKey in the kibana.yml or use the bin/kibana-encryption-keys command.');
    }

    const primaryCrypto = config.encryptionKey ? (0, _nodeCrypto.default)({
      encryptionKey: config.encryptionKey
    }) : undefined;
    const decryptionOnlyCryptos = config.keyRotation.decryptionOnlyKeys.map(decryptionKey => (0, _nodeCrypto.default)({
      encryptionKey: decryptionKey
    }));
    const service = Object.freeze(new _crypto.EncryptedSavedObjectsService({
      primaryCrypto,
      decryptionOnlyCryptos,
      logger: this.logger
    }));
    this.savedObjectsSetup = (0, _saved_objects.setupSavedObjects)({
      service,
      savedObjects: core.savedObjects,
      security: deps.security,
      getStartServices: core.getStartServices
    });
    (0, _routes.defineRoutes)({
      router: core.http.createRouter(),
      logger: this.initializerContext.logger.get('routes'),
      encryptionKeyRotationService: Object.freeze(new _crypto.EncryptionKeyRotationService({
        logger: this.logger.get('key-rotation-service'),
        service,
        getStartServices: core.getStartServices,
        security: deps.security
      })),
      config
    });
    return {
      canEncrypt,
      registerType: typeRegistration => service.registerType(typeRegistration),
      createMigration: (0, _create_migration.getCreateMigration)(service, typeRegistration => {
        const serviceForMigration = new _crypto.EncryptedSavedObjectsService({
          primaryCrypto,
          decryptionOnlyCryptos,
          logger: this.logger
        });
        serviceForMigration.registerType(typeRegistration);
        return serviceForMigration;
      })
    };
  }

  start() {
    this.logger.debug('Starting plugin');
    return {
      isEncryptionError: error => error instanceof _crypto.EncryptionError,
      getClient: (options = {}) => this.savedObjectsSetup(options)
    };
  }

  stop() {
    this.logger.debug('Stopping plugin');
  }

}

exports.EncryptedSavedObjectsPlugin = EncryptedSavedObjectsPlugin;