"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addOwnerToSO = void 0;
Object.defineProperty(exports, "caseMigrations", {
  enumerable: true,
  get: function () {
    return _cases.caseMigrations;
  }
});
Object.defineProperty(exports, "configureMigrations", {
  enumerable: true,
  get: function () {
    return _configuration.configureMigrations;
  }
});
exports.connectorMappingsMigrations = void 0;
Object.defineProperty(exports, "createCommentsMigrations", {
  enumerable: true,
  get: function () {
    return _comments.createCommentsMigrations;
  }
});
Object.defineProperty(exports, "userActionsMigrations", {
  enumerable: true,
  get: function () {
    return _user_actions.userActionsMigrations;
  }
});

var _constants = require("../../../common/constants");

var _cases = require("./cases");

var _configuration = require("./configuration");

var _user_actions = require("./user_actions");

var _comments = require("./comments");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const addOwnerToSO = doc => ({ ...doc,
  attributes: { ...doc.attributes,
    owner: _constants.SECURITY_SOLUTION_OWNER
  },
  references: doc.references || []
});

exports.addOwnerToSO = addOwnerToSO;
const connectorMappingsMigrations = {
  '7.14.0': doc => {
    return addOwnerToSO(doc);
  }
};
exports.connectorMappingsMigrations = connectorMappingsMigrations;