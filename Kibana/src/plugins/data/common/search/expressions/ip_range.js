"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ipRangeFunction = void 0;

var _i18n = require("@kbn/i18n");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const ipRangeFunction = {
  name: 'ipRange',
  type: 'ip_range',
  inputTypes: ['null'],
  help: _i18n.i18n.translate('data.search.functions.ipRange.help', {
    defaultMessage: 'Create an IP range'
  }),
  args: {
    from: {
      types: ['string'],
      required: true,
      help: _i18n.i18n.translate('data.search.functions.ipRange.from.help', {
        defaultMessage: 'Specify the starting address'
      })
    },
    to: {
      types: ['string'],
      required: true,
      help: _i18n.i18n.translate('data.search.functions.ipRange.to.help', {
        defaultMessage: 'Specify the ending address'
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
      type: 'ip_range'
    };
  }

};
exports.ipRangeFunction = ipRangeFunction;