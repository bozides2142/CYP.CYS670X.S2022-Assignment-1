"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.autocompleteConfigDeprecationProvider = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const autocompleteConfigDeprecationProvider = ({
  renameFromRoot
}) => [renameFromRoot('kibana.autocompleteTerminateAfter', 'data.autocomplete.valueSuggestions.terminateAfter', {
  level: 'warning'
}), renameFromRoot('kibana.autocompleteTimeout', 'data.autocomplete.valueSuggestions.timeout', {
  level: 'warning'
})];

exports.autocompleteConfigDeprecationProvider = autocompleteConfigDeprecationProvider;