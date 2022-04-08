"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.phraseFilterFunction = void 0;

var _i18n = require("@kbn/i18n");

var _esQuery = require("@kbn/es-query");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const phraseFilterFunction = {
  name: 'rangeFilter',
  type: 'kibana_filter',
  inputTypes: ['null'],
  help: _i18n.i18n.translate('data.search.functions.phraseFilter.help', {
    defaultMessage: 'Create kibana phrase or phrases filter'
  }),
  args: {
    field: {
      types: ['kibana_field'],
      required: true,
      help: _i18n.i18n.translate('data.search.functions.phraseFilter.field.help', {
        defaultMessage: 'Specify the field you want to filter on. Use `field` function.'
      })
    },
    phrase: {
      types: ['string'],
      multi: true,
      required: true,
      help: _i18n.i18n.translate('data.search.functions.phraseFilter.phrase.help', {
        defaultMessage: 'Specify the phrases'
      })
    },
    negate: {
      types: ['boolean'],
      default: false,
      help: _i18n.i18n.translate('data.search.functions.phraseFilter.negate.help', {
        defaultMessage: 'Should the filter be negated'
      })
    }
  },

  fn(input, args) {
    if (args.phrase.length === 1) {
      return {
        type: 'kibana_filter',
        ...(0, _esQuery.buildFilter)({}, args.field.spec, _esQuery.FILTERS.PHRASE, args.negate || false, false, args.phrase[0], null)
      };
    }

    return {
      type: 'kibana_filter',
      ...(0, _esQuery.buildFilter)({}, args.field.spec, _esQuery.FILTERS.PHRASES, args.negate || false, false, args.phrase, null)
    };
  }

};
exports.phraseFilterFunction = phraseFilterFunction;