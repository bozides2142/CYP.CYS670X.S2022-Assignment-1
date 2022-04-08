"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildFiltersFunction = buildFiltersFunction;

var _i18n = require("../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function buildFiltersFunction(fn, migrations) {
  return function filters() {
    const {
      help,
      args: argHelp
    } = (0, _i18n.getFunctionHelp)().filters;
    return {
      name: 'filters',
      type: 'filter',
      help,
      context: {
        types: ['null']
      },
      args: {
        group: {
          aliases: ['_'],
          types: ['string'],
          help: argHelp.group,
          multi: true
        },
        ungrouped: {
          aliases: ['nogroup', 'nogroups'],
          types: ['boolean'],
          help: argHelp.ungrouped,
          default: false
        }
      },
      fn,
      migrations
    };
  };
}