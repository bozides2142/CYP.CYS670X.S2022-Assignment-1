"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.environmentsRouteRepository = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _common = require("../../../../observability/common");

var _transactions = require("../../lib/helpers/transactions");

var _setup_request = require("../../lib/helpers/setup_request");

var _get_environments = require("./get_environments");

var _default_api_types = require("../default_api_types");

var _create_apm_server_route = require("../apm_routes/create_apm_server_route");

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const environmentsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/environments',
  params: t.type({
    query: t.intersection([t.partial({
      serviceName: t.string
    }), _default_api_types.rangeRt])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const setup = await (0, _setup_request.setupRequest)(resources);
    const {
      context,
      params
    } = resources;
    const {
      serviceName,
      start,
      end
    } = params.query;
    const searchAggregatedTransactions = await (0, _transactions.getSearchAggregatedTransactions)({
      apmEventClient: setup.apmEventClient,
      config: setup.config,
      start,
      end,
      kuery: ''
    });
    const size = await context.core.uiSettings.client.get(_common.maxSuggestions);
    const environments = await (0, _get_environments.getEnvironments)({
      setup,
      serviceName,
      searchAggregatedTransactions,
      size,
      start,
      end
    });
    return {
      environments
    };
  }
});
const environmentsRouteRepository = environmentsRoute;
exports.environmentsRouteRepository = environmentsRouteRepository;