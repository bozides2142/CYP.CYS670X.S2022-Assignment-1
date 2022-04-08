"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extendedBoundsFunction = void 0;

var _lodash = require("lodash");

var _i18n = require("@kbn/i18n");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const extendedBoundsFunction = {
  name: 'extendedBounds',
  type: 'extended_bounds',
  inputTypes: ['null'],
  help: _i18n.i18n.translate('data.search.functions.extendedBounds.help', {
    defaultMessage: 'Create extended bounds'
  }),
  args: {
    min: {
      types: ['number'],
      help: _i18n.i18n.translate('data.search.functions.extendedBounds.min.help', {
        defaultMessage: 'Specify the lower boundary value'
      })
    },
    max: {
      types: ['number'],
      help: _i18n.i18n.translate('data.search.functions.extendedBounds.max.help', {
        defaultMessage: 'Specify the upper boundary value'
      })
    }
  },

  fn(input, {
    min,
    max
  }) {
    return {
      type: 'extended_bounds',
      ...(0, _lodash.omitBy)({
        min,
        max
      }, _lodash.isNil)
    };
  }

};
exports.extendedBoundsFunction = extendedBoundsFunction;