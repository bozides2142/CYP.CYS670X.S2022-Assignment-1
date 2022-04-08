"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.caseFn = caseFn;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function caseFn() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().case;
  return {
    name: 'case',
    type: 'case',
    help,
    args: {
      when: {
        aliases: ['_'],
        resolve: false,
        help: argHelp.when
      },
      if: {
        types: ['boolean'],
        help: argHelp.if
      },
      then: {
        resolve: false,
        required: true,
        help: argHelp.then
      }
    },

    fn(input, {
      if: condition,
      then,
      when
    }) {
      return (0, _rxjs.defer)(() => {
        var _ref;

        const matches = (_ref = condition !== null && condition !== void 0 ? condition : when === null || when === void 0 ? void 0 : when().pipe((0, _operators.map)(value => value === input))) !== null && _ref !== void 0 ? _ref : true;
        return (0, _rxjs.isObservable)(matches) ? matches : (0, _rxjs.of)(matches);
      }).pipe((0, _operators.concatMap)(matches => (matches ? then() : (0, _rxjs.of)(null)).pipe((0, _operators.map)(result => ({
        matches,
        result,
        type: 'case'
      })))));
    }

  };
}