"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ifFn = ifFn;

var _rxjs = require("rxjs");

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function ifFn() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().if;
  return {
    name: 'if',
    help,
    args: {
      condition: {
        types: ['boolean'],
        aliases: ['_'],
        help: argHelp.condition,
        required: true
      },
      then: {
        resolve: false,
        help: argHelp.then
      },
      else: {
        resolve: false,
        help: argHelp.else
      }
    },

    fn(input, args) {
      return (0, _rxjs.defer)(() => {
        var _ref, _args$then, _args$else;

        return (_ref = args.condition ? (_args$then = args.then) === null || _args$then === void 0 ? void 0 : _args$then.call(args) : (_args$else = args.else) === null || _args$else === void 0 ? void 0 : _args$else.call(args)) !== null && _ref !== void 0 ? _ref : (0, _rxjs.of)(input);
      });
    }

  };
}