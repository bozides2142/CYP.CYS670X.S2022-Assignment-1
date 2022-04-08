"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.essql = essql;

var _services = require("../../../public/services");

var _constants = require("../../../common/lib/constants");

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function essql() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().essql;
  return {
    name: 'essql',
    type: 'datatable',
    context: {
      types: ['filter']
    },
    help,
    args: {
      query: {
        aliases: ['_', 'q'],
        types: ['string'],
        help: argHelp.query
      },
      parameter: {
        aliases: ['param'],
        types: ['string', 'number', 'boolean'],
        multi: true,
        help: argHelp.parameter
      },
      count: {
        types: ['number'],
        help: argHelp.count,
        default: 1000
      },
      timezone: {
        aliases: ['tz'],
        types: ['string'],
        default: 'UTC',
        help: argHelp.timezone
      }
    },
    fn: (input, args, handlers) => {
      const search = _services.searchService.getService().search;

      const {
        parameter,
        ...restOfArgs
      } = args;
      const req = { ...restOfArgs,
        params: parameter,
        filter: input.and
      };
      return search.search(req, {
        strategy: _constants.ESSQL_SEARCH_STRATEGY
      }).toPromise().then(resp => {
        return {
          type: 'datatable',
          meta: {
            type: 'essql'
          },
          ...resp
        };
      }).catch(e => {
        let message = `Unexpected error from Elasticsearch: ${e.message}`;

        if (e.err) {
          const {
            type,
            reason
          } = e.err.attributes;

          if (type === 'parsing_exception') {
            message = `Couldn't parse Elasticsearch SQL query. You may need to add double quotes to names containing special characters. Check your query and try again. Error: ${reason}`;
          } else {
            message = `Unexpected error from Elasticsearch: ${type} - ${reason}`;
          }
        } // Re-write the error message before surfacing it up


        e.message = message;
        throw e;
      });
    }
  };
}