"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.kibanaContext = void 0;

var _ = require("../..");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const kibanaContext = {
  name: 'kibana_context',
  from: {
    null: () => {
      return {
        type: 'kibana_context'
      };
    }
  },
  to: {
    null: () => {
      return {
        type: 'null'
      };
    },
    filter: input => {
      const {
        filters = []
      } = input;
      return {
        type: 'filter',
        filterType: 'filter',
        and: filters.map(_.adaptToExpressionValueFilter)
      };
    }
  }
};
exports.kibanaContext = kibanaContext;