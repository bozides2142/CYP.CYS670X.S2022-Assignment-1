"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeSavedObjectMigrationMaps = void 0;

var _lodash = require("lodash");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Merges two saved object migration maps.
 *
 * If there is a migration for a given version on only one of the maps,
 * that migration function will be used:
 *
 * mergeSavedObjectMigrationMaps({ '1.2.3': f }, { '4.5.6': g }) -> { '1.2.3': f, '4.5.6': g }
 *
 * If there is a migration for a given version on both maps, the migrations will be composed:
 *
 * mergeSavedObjectMigrationMaps({ '1.2.3': f }, { '1.2.3': g }) -> { '1.2.3': (doc, context) => f(g(doc, context), context) }
 *
 * @public
 */
const mergeSavedObjectMigrationMaps = (map1, map2) => {
  const customizer = (objValue, srcValue) => {
    if (!srcValue || !objValue) {
      return srcValue || objValue;
    }

    return (state, context) => objValue(srcValue(state, context), context);
  };

  return (0, _lodash.mergeWith)({ ...map1
  }, map2, customizer);
};

exports.mergeSavedObjectMigrationMaps = mergeSavedObjectMigrationMaps;