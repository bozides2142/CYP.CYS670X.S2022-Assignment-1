"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDeprecationsForGlobalSettings = exports.getDeprecationsFor = void 0;

var _saferLodashSet = require("@elastic/safer-lodash-set");

var _config = require("@kbn/config");

var _mocks = require("./mocks");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const defaultContext = _mocks.configDeprecationsMock.createContext();

function collectDeprecations(provider, settings, path, context = defaultContext) {
  const deprecations = provider(_config.configDeprecationFactory);
  const deprecationMessages = [];
  const deprecationLevels = [];
  const {
    config: migrated
  } = (0, _config.applyDeprecations)(settings, deprecations.map(deprecation => ({
    deprecation,
    path,
    context
  })), () => ({
    message,
    level
  }) => {
    deprecationMessages.push(message);
    deprecationLevels.push(level !== null && level !== void 0 ? level : '');
  });
  return {
    messages: deprecationMessages,
    levels: deprecationLevels,
    migrated
  };
}

const getDeprecationsFor = ({
  provider,
  settings = {},
  path
}) => {
  return collectDeprecations(provider, (0, _saferLodashSet.set)({}, path, settings), path);
};

exports.getDeprecationsFor = getDeprecationsFor;

const getDeprecationsForGlobalSettings = ({
  provider,
  settings = {}
}) => {
  return collectDeprecations(provider, settings, '');
};

exports.getDeprecationsForGlobalSettings = getDeprecationsForGlobalSettings;