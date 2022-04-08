"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMigrateFunction = void 0;

var _migrate_base_input = require("./migrate_base_input");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getMigrateFunction = embeddables => {
  const migrateFn = (state, version) => {
    const enhancements = state.enhancements || {};
    const factory = embeddables.getEmbeddableFactory(state.type);
    let updatedInput = _migrate_base_input.baseEmbeddableMigrations[version] ? _migrate_base_input.baseEmbeddableMigrations[version](state) : state;
    const factoryMigrations = typeof (factory === null || factory === void 0 ? void 0 : factory.migrations) === 'function' ? factory === null || factory === void 0 ? void 0 : factory.migrations() : (factory === null || factory === void 0 ? void 0 : factory.migrations) || {};

    if (factoryMigrations[version]) {
      updatedInput = factoryMigrations[version](updatedInput);
    }

    if (factory !== null && factory !== void 0 && factory.isContainerType) {
      updatedInput.panels = (state.panels || []).map(panel => {
        return migrateFn(panel, version);
      });
    }

    updatedInput.enhancements = {};
    Object.keys(enhancements).forEach(key => {
      if (!enhancements[key]) return;
      const enhancementDefinition = embeddables.getEnhancement(key);
      const enchantmentMigrations = typeof (enhancementDefinition === null || enhancementDefinition === void 0 ? void 0 : enhancementDefinition.migrations) === 'function' ? enhancementDefinition === null || enhancementDefinition === void 0 ? void 0 : enhancementDefinition.migrations() : (enhancementDefinition === null || enhancementDefinition === void 0 ? void 0 : enhancementDefinition.migrations) || {};
      const migratedEnhancement = enchantmentMigrations[version] ? enchantmentMigrations[version](enhancements[key]) : enhancements[key];
      updatedInput.enhancements[key] = migratedEnhancement;
    });
    return updatedInput;
  };

  return migrateFn;
};

exports.getMigrateFunction = getMigrateFunction;