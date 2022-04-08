"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.range = void 0;

var _i18n = require("@kbn/i18n");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const range = () => ({
  name: 'range',
  help: _i18n.i18n.translate('visualizations.function.range.help', {
    defaultMessage: 'Generates range object'
  }),
  type: 'range',
  args: {
    from: {
      types: ['number'],
      help: _i18n.i18n.translate('visualizations.function.range.from.help', {
        defaultMessage: 'Start of range'
      }),
      required: true
    },
    to: {
      types: ['number'],
      help: _i18n.i18n.translate('visualizations.function.range.to.help', {
        defaultMessage: 'End of range'
      }),
      required: true
    }
  },
  fn: (context, args) => {
    return {
      type: 'range',
      from: args.from,
      to: args.to
    };
  }
});

exports.range = range;