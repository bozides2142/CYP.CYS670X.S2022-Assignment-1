"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.existsFilterFunction = void 0;

var _i18n = require("@kbn/i18n");

var _esQuery = require("@kbn/es-query");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const existsFilterFunction = {
  name: 'existsFilter',
  type: 'kibana_filter',
  inputTypes: ['null'],
  help: _i18n.i18n.translate('data.search.functions.existsFilter.help', {
    defaultMessage: 'Create kibana exists filter'
  }),
  args: {
    field: {
      types: ['kibana_field'],
      required: true,
      help: _i18n.i18n.translate('data.search.functions.existsFilter.field.help', {
        defaultMessage: 'Specify the field you want to filter on. Use `field` function.'
      })
    },
    negate: {
      types: ['boolean'],
      default: false,
      help: _i18n.i18n.translate('data.search.functions.existsFilter.negate.help', {
        defaultMessage: 'Should the filter be negated.'
      })
    }
  },

  fn(input, args) {
    return {
      type: 'kibana_filter',
      ...(0, _esQuery.buildFilter)({}, args.field.spec, _esQuery.FILTERS.EXISTS, args.negate || false, false, {}, null)
    };
  }

};
exports.existsFilterFunction = existsFilterFunction;