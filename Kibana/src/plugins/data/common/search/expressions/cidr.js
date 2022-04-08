"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cidrFunction = void 0;

var _i18n = require("@kbn/i18n");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const cidrFunction = {
  name: 'cidr',
  type: 'cidr',
  inputTypes: ['null'],
  help: _i18n.i18n.translate('data.search.functions.cidr.help', {
    defaultMessage: 'Create a CIDR-based range'
  }),
  args: {
    mask: {
      types: ['string'],
      required: true,
      help: _i18n.i18n.translate('data.search.functions.cidr.cidr.help', {
        defaultMessage: 'Specify the CIDR block'
      })
    }
  },

  fn(input, {
    mask
  }) {
    return {
      mask,
      type: 'cidr'
    };
  }

};
exports.cidrFunction = cidrFunction;