"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dateRangeFunction = void 0;

var _i18n = require("@kbn/i18n");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const dateRangeFunction = {
  name: 'dateRange',
  type: 'date_range',
  inputTypes: ['null'],
  help: _i18n.i18n.translate('data.search.functions.dateRange.help', {
    defaultMessage: 'Create a date range'
  }),
  args: {
    from: {
      types: ['number', 'string'],
      help: _i18n.i18n.translate('data.search.functions.dateRange.from.help', {
        defaultMessage: 'Specify the starting date'
      })
    },
    to: {
      types: ['number', 'string'],
      help: _i18n.i18n.translate('data.search.functions.dateRange.to.help', {
        defaultMessage: 'Specify the ending date'
      })
    }
  },

  fn(input, {
    from,
    to
  }) {
    return {
      from,
      to,
      type: 'date_range'
    };
  }

};
exports.dateRangeFunction = dateRangeFunction;