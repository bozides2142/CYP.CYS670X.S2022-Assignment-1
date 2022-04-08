"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LocatorClient = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _locator = require("./locator");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class LocatorClient {
  /**
   * Collection of registered locators.
   */
  constructor(deps) {
    (0, _defineProperty2.default)(this, "locators", new Map());
    (0, _defineProperty2.default)(this, "getAllMigrations", () => {
      const locatorParamsMigrations = this.migrations();
      const locatorMigrations = {};
      const versions = new Set();

      for (const migrationMap of Object.values(locatorParamsMigrations)) for (const version of Object.keys(migrationMap)) versions.add(version);

      for (const version of versions.values()) {
        const migration = locator => {
          const locatorMigrationsMap = locatorParamsMigrations[locator.id];
          if (!locatorMigrationsMap) return locator;
          const migrationFunction = locatorMigrationsMap[version];
          if (!migrationFunction) return locator;
          return { ...locator,
            version,
            state: migrationFunction(locator.state)
          };
        };

        locatorMigrations[version] = migration;
      }

      return locatorMigrations;
    });
    this.deps = deps;
  }
  /**
   * Creates and register a URL locator.
   *
   * @param definition A definition of URL locator.
   * @returns A public interface of URL locator.
   */


  create(definition) {
    const locator = new _locator.Locator(definition, this.deps);
    this.locators.set(definition.id, locator);
    return locator;
  }
  /**
   * Returns a previously registered URL locator.
   *
   * @param id ID of a URL locator.
   * @returns A public interface of a registered URL locator.
   */


  get(id) {
    return this.locators.get(id);
  }

  getOrThrow(id) {
    const locator = this.locators.get(id);
    if (!locator) throw new Error(`Locator [ID = "${id}"] is not registered.`);
    return locator;
  }

  migrations() {
    const migrations = {};

    for (const locator of this.locators.values()) {
      migrations[locator.id] = typeof locator.migrations === 'function' ? locator.migrations() : locator.migrations;
    }

    return migrations;
  } // PersistableStateService<LocatorData> ----------------------------------------------------------


  telemetry(state, collector) {
    for (const locator of this.locators.values()) {
      collector = locator.telemetry(state.state, collector);
    }

    return collector;
  }

  inject(state, references) {
    const locator = this.getOrThrow(state.id);
    const filteredReferences = references.filter(ref => ref.name.startsWith('params:')).map(ref => ({ ...ref,
      name: ref.name.substr('params:'.length)
    }));
    return { ...state,
      state: locator.inject(state.state, filteredReferences)
    };
  }

  extract(state) {
    const locator = this.getOrThrow(state.id);
    const extracted = locator.extract(state.state);
    return {
      state: { ...state,
        state: extracted.state
      },
      references: extracted.references.map(ref => ({ ...ref,
        name: 'params:' + ref.name
      }))
    };
  }

}

exports.LocatorClient = LocatorClient;