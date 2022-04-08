"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.queryFilterFunction = void 0;

var _lodash = require("lodash");

var _i18n = require("@kbn/i18n");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const queryFilterFunction = {
  name: 'queryFilter',
  type: 'kibana_query_filter',
  inputTypes: ['null'],
  help: _i18n.i18n.translate('data.search.functions.queryFilter.help', {
    defaultMessage: 'Create a query filter'
  }),
  args: {
    input: {
      types: ['kibana_query'],
      aliases: ['_'],
      required: true,
      help: _i18n.i18n.translate('data.search.functions.queryFilter.input.help', {
        defaultMessage: 'Specify the query filter'
      })
    },
    label: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.functions.queryFilter.label.help', {
        defaultMessage: 'Specify the filter label'
      })
    }
  },

  fn(_, {
    input,
    label
  }) {
    return {
      type: 'kibana_query_filter',
      input: (0, _lodash.omit)(input, 'type'),
      ...(0, _lodash.omitBy)({
        label
      }, _lodash.isNil)
    };
  }

};
exports.queryFilterFunction = queryFilterFunction;