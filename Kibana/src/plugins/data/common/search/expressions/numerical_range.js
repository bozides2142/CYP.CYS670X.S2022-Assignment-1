"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.numericalRangeFunction = void 0;

var _lodash = require("lodash");

var _i18n = require("@kbn/i18n");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const numericalRangeFunction = {
  name: 'numericalRange',
  type: 'numerical_range',
  inputTypes: ['null'],
  help: _i18n.i18n.translate('data.search.functions.numericalRange.help', {
    defaultMessage: 'Create a numerical range'
  }),
  args: {
    from: {
      types: ['number'],
      help: _i18n.i18n.translate('data.search.functions.numericalRange.from.help', {
        defaultMessage: 'Specify the starting value'
      })
    },
    to: {
      types: ['number'],
      help: _i18n.i18n.translate('data.search.functions.numericalRange.to.help', {
        defaultMessage: 'Specify the ending value'
      })
    },
    label: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.functions.numericalRange.label.help', {
        defaultMessage: 'Specify the range label'
      })
    }
  },

  fn(input, {
    from,
    to,
    label
  }) {
    return {
      type: 'numerical_range',
      ...(0, _lodash.omitBy)({
        from,
        to,
        label
      }, _lodash.isNil)
    };
  }

};
exports.numericalRangeFunction = numericalRangeFunction;