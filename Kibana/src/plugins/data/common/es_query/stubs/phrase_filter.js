"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.phraseFilter = void 0;

var _esQuery = require("@kbn/es-query");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const phraseFilter = {
  meta: {
    negate: false,
    index: 'logstash-*',
    type: 'phrase',
    key: 'machine.os',
    value: 'ios',
    disabled: false,
    alias: null,
    params: {
      query: 'ios'
    }
  },
  $state: {
    store: _esQuery.FilterStateStore.APP_STATE
  },
  query: {}
};
exports.phraseFilter = phraseFilter;