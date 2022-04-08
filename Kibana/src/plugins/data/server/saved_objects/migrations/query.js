"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.savedQueryMigrations = void 0;

var _lodash = require("lodash");

var _persistable_state = require("../../../common/query/persistable_state");

var _common = require("../../../../kibana_utils/common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const extractFilterReferences = doc => {
  var _doc$attributes$filte;

  const {
    state: filters,
    references
  } = (0, _persistable_state.extract)((_doc$attributes$filte = doc.attributes.filters) !== null && _doc$attributes$filte !== void 0 ? _doc$attributes$filte : []);
  return { ...doc,
    attributes: { ...doc.attributes,
      filters
    },
    references
  };
};

const filterMigrations = (0, _lodash.mapValues)((0, _persistable_state.getAllMigrations)(), migrate => {
  return doc => ({ ...doc,
    attributes: { ...doc.attributes,
      filters: migrate(doc.attributes.filters)
    }
  });
});
const savedQueryMigrations = (0, _common.mergeMigrationFunctionMaps)({
  '7.16.0': extractFilterReferences
}, filterMigrations);
exports.savedQueryMigrations = savedQueryMigrations;