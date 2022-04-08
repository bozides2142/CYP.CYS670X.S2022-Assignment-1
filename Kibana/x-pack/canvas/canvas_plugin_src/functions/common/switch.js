"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.switchFn = switchFn;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function switchFn() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().switch;
  return {
    name: 'switch',
    help,
    args: {
      case: {
        types: ['case'],
        aliases: ['_'],
        resolve: false,
        multi: true,
        required: true,
        help: argHelp.case
      },
      default: {
        aliases: ['finally'],
        resolve: false,
        help: argHelp.default
      }
    },

    fn(input, args) {
      return (0, _rxjs.combineLatest)(args.case.map(item => (0, _rxjs.defer)(() => item()))).pipe((0, _operators.concatMap)(items => {
        var _ref, _args$default;

        const item = items.find(({
          matches
        }) => matches);
        const item$ = item && (0, _rxjs.of)(item.result);
        return (_ref = item$ !== null && item$ !== void 0 ? item$ : (_args$default = args.default) === null || _args$default === void 0 ? void 0 : _args$default.call(args)) !== null && _ref !== void 0 ? _ref : (0, _rxjs.of)(input);
      }));
    }

  };
}