"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.osquerySearchStrategyProvider = void 0;

var _operators = require("rxjs/operators");

var _server = require("../../../../../../src/plugins/data/server");

var _common = require("../../../../../../src/plugins/data/common");

var _factory = require("./factory");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const osquerySearchStrategyProvider = data => {
  let es;
  return {
    search: (request, options, deps) => {
      var _dsl$index;

      if (request.factoryQueryType == null) {
        throw new Error('factoryQueryType is required');
      }

      const queryFactory = _factory.osqueryFactory[request.factoryQueryType];
      const dsl = queryFactory.buildDsl(request); // use internal user for searching .fleet* indicies

      es = (_dsl$index = dsl.index) !== null && _dsl$index !== void 0 && _dsl$index.includes('fleet') ? data.search.searchAsInternalUser : data.search.getSearchStrategy(_common.ENHANCED_ES_SEARCH_STRATEGY);
      return es.search({ ...request,
        params: dsl
      }, options, deps).pipe((0, _operators.map)(response => ({ ...response,
        ...{
          rawResponse: (0, _server.shimHitsTotal)(response.rawResponse)
        }
      })), (0, _operators.mergeMap)(esSearchRes => queryFactory.parse(request, esSearchRes)));
    },
    cancel: async (id, options, deps) => {
      var _es;

      if ((_es = es) !== null && _es !== void 0 && _es.cancel) {
        return es.cancel(id, options, deps);
      }
    }
  };
};

exports.osquerySearchStrategyProvider = osquerySearchStrategyProvider;