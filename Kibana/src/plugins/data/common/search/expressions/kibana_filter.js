"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.kibanaFilterFunction = void 0;

var _i18n = require("@kbn/i18n");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const kibanaFilterFunction = {
  name: 'kibanaFilter',
  type: 'kibana_filter',
  inputTypes: ['null'],
  help: _i18n.i18n.translate('data.search.functions.kibanaFilter.help', {
    defaultMessage: 'Create kibana filter'
  }),
  args: {
    query: {
      types: ['string'],
      aliases: ['q', '_'],
      required: true,
      help: _i18n.i18n.translate('data.search.functions.kibanaFilter.field.help', {
        defaultMessage: 'Specify free form esdsl query'
      })
    },
    negate: {
      types: ['boolean'],
      default: false,
      help: _i18n.i18n.translate('data.search.functions.kibanaFilter.negate.help', {
        defaultMessage: 'Should the filter be negated'
      })
    },
    disabled: {
      types: ['boolean'],
      default: false,
      help: _i18n.i18n.translate('data.search.functions.kibanaFilter.disabled.help', {
        defaultMessage: 'Should the filter be disabled'
      })
    }
  },

  fn(input, args) {
    return {
      type: 'kibana_filter',
      meta: {
        negate: args.negate || false,
        alias: '',
        disabled: args.disabled || false
      },
      query: JSON.parse(args.query)
    };
  }

};
exports.kibanaFilterFunction = kibanaFilterFunction;