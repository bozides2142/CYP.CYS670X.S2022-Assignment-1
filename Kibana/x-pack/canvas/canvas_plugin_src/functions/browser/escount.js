"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.escount = escount;

var _build_es_request = require("../../../common/lib/request/build_es_request");

var _services = require("../../../public/services");

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-expect-error untyped local


function escount() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().escount;
  return {
    name: 'escount',
    type: 'number',
    context: {
      types: ['filter']
    },
    help,
    args: {
      query: {
        types: ['string'],
        aliases: ['_', 'q'],
        help: argHelp.query,
        default: '"-_index:.kibana"'
      },
      index: {
        types: ['string'],
        default: '_all',
        help: argHelp.index
      }
    },
    fn: (input, args, handlers) => {
      input.and = input.and.concat([{
        type: 'filter',
        filterType: 'luceneQueryString',
        query: args.query,
        and: []
      }]);
      const esRequest = (0, _build_es_request.buildESRequest)({
        index: args.index,
        body: {
          track_total_hits: true,
          size: 0,
          query: {
            bool: {
              must: [{
                match_all: {}
              }]
            }
          }
        }
      }, input);

      const search = _services.searchService.getService().search;

      const req = {
        params: { ...esRequest
        }
      };
      return search.search(req).toPromise().then(resp => {
        return resp.rawResponse.hits.total;
      });
    }
  };
}