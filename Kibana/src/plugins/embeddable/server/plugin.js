"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EmbeddableServerPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = require("lodash");

var _lib = require("../common/lib");

var _get_all_migrations = require("../common/lib/get_all_migrations");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class EmbeddableServerPlugin {
  constructor() {
    (0, _defineProperty2.default)(this, "embeddableFactories", new Map());
    (0, _defineProperty2.default)(this, "enhancements", new Map());
    (0, _defineProperty2.default)(this, "migrateFn", void 0);
    (0, _defineProperty2.default)(this, "registerEnhancement", enhancement => {
      if (this.enhancements.has(enhancement.id)) {
        throw new Error(`enhancement with id ${enhancement.id} already exists in the registry`);
      }

      this.enhancements.set(enhancement.id, {
        id: enhancement.id,
        telemetry: enhancement.telemetry || (() => ({})),
        inject: enhancement.inject || _lodash.identity,
        extract: enhancement.extract || (state => {
          return {
            state,
            references: []
          };
        }),
        migrations: enhancement.migrations || {}
      });
    });
    (0, _defineProperty2.default)(this, "getEnhancement", id => {
      return this.enhancements.get(id) || {
        id: 'unknown',
        telemetry: (state, stats) => stats,
        inject: _lodash.identity,
        extract: state => {
          return {
            state,
            references: []
          };
        },
        migrations: {}
      };
    });
    (0, _defineProperty2.default)(this, "registerEmbeddableFactory", factory => {
      if (this.embeddableFactories.has(factory.id)) {
        throw new Error(`Embeddable factory [embeddableFactoryId = ${factory.id}] already registered in Embeddables API.`);
      }

      this.embeddableFactories.set(factory.id, {
        id: factory.id,
        telemetry: factory.telemetry || (() => ({})),
        inject: factory.inject || _lodash.identity,
        extract: factory.extract || (state => ({
          state,
          references: []
        })),
        migrations: factory.migrations || {}
      });
    });
    (0, _defineProperty2.default)(this, "getEmbeddableFactory", embeddableFactoryId => {
      return this.embeddableFactories.get(embeddableFactoryId) || {
        id: 'unknown',
        telemetry: (state, stats) => stats,
        inject: state => state,
        extract: state => {
          return {
            state,
            references: []
          };
        },
        migrations: {}
      };
    });
  }

  setup(core) {
    const commonContract = {
      getEmbeddableFactory: this.getEmbeddableFactory,
      getEnhancement: this.getEnhancement
    };
    this.migrateFn = (0, _lib.getMigrateFunction)(commonContract);
    return {
      registerEmbeddableFactory: this.registerEmbeddableFactory,
      registerEnhancement: this.registerEnhancement,
      telemetry: (0, _lib.getTelemetryFunction)(commonContract),
      extract: (0, _lib.getExtractFunction)(commonContract),
      inject: (0, _lib.getInjectFunction)(commonContract),
      getAllMigrations: () => (0, _get_all_migrations.getAllMigrations)(Array.from(this.embeddableFactories.values()), Array.from(this.enhancements.values()), this.migrateFn)
    };
  }

  start(core) {
    const commonContract = {
      getEmbeddableFactory: this.getEmbeddableFactory,
      getEnhancement: this.getEnhancement
    };
    return {
      telemetry: (0, _lib.getTelemetryFunction)(commonContract),
      extract: (0, _lib.getExtractFunction)(commonContract),
      inject: (0, _lib.getInjectFunction)(commonContract),
      getAllMigrations: () => (0, _get_all_migrations.getAllMigrations)(Array.from(this.embeddableFactories.values()), Array.from(this.enhancements.values()), this.migrateFn)
    };
  }

  stop() {}

}

exports.EmbeddableServerPlugin = EmbeddableServerPlugin;