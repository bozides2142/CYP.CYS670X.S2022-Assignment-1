"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerCoreObjectTypes = registerCoreObjectTypes;

var _constants = require("./constants");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const legacyUrlAliasType = {
  name: _constants.LEGACY_URL_ALIAS_TYPE,
  namespaceType: 'agnostic',
  mappings: {
    dynamic: false,
    properties: {
      sourceId: {
        type: 'keyword'
      },
      targetNamespace: {
        type: 'keyword'
      },
      targetType: {
        type: 'keyword'
      },
      targetId: {
        type: 'keyword'
      },
      resolveCounter: {
        type: 'long'
      },
      disabled: {
        type: 'boolean'
      } // other properties exist, but we aren't querying or aggregating on those, so we don't need to specify them (because we use `dynamic: false` above)

    }
  },
  hidden: false
};
/**
 * @internal
 */

function registerCoreObjectTypes(typeRegistry) {
  typeRegistry.registerType(legacyUrlAliasType);
}