"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isInlineScriptingEnabled = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const scriptAllowedTypesKey = 'script.allowed_types';

const isInlineScriptingEnabled = async ({
  client
}) => {
  var _ref, _ref2, _settings$transient$s;

  const {
    body: settings
  } = await client.cluster.getSettings({
    include_defaults: true,
    flat_settings: true
  }); // priority: transient -> persistent -> default

  const scriptAllowedTypes = (_ref = (_ref2 = (_settings$transient$s = settings.transient[scriptAllowedTypesKey]) !== null && _settings$transient$s !== void 0 ? _settings$transient$s : settings.persistent[scriptAllowedTypesKey]) !== null && _ref2 !== void 0 ? _ref2 : settings.defaults[scriptAllowedTypesKey]) !== null && _ref !== void 0 ? _ref : []; // when unspecified, the setting as a default `[]` value that means that both scriptings are allowed.

  return scriptAllowedTypes.length === 0 || scriptAllowedTypes.includes('inline');
};

exports.isInlineScriptingEnabled = isInlineScriptingEnabled;