"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.traceRouteRepository = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _setup_request = require("../../lib/helpers/setup_request");

var _get_trace_items = require("./get_trace_items");

var _get_top_traces_primary_stats = require("./get_top_traces_primary_stats");

var _create_apm_server_route = require("../apm_routes/create_apm_server_route");

var _default_api_types = require("../default_api_types");

var _transactions = require("../../lib/helpers/transactions");

var _get_transaction_by_trace = require("../transactions/get_transaction_by_trace");

var _get_transaction = require("../transactions/get_transaction");

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


const tracesRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/traces',
  params: t.type({
    query: t.intersection([_default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const setup = await (0, _setup_request.setupRequest)(resources);
    const {
      params
    } = resources;
    const {
      environment,
      kuery,
      start,
      end
    } = params.query;
    const searchAggregatedTransactions = await (0, _transactions.getSearchAggregatedTransactions)({ ...setup,
      kuery,
      start,
      end
    });
    return await (0, _get_top_traces_primary_stats.getTopTracesPrimaryStats)({
      environment,
      kuery,
      setup,
      searchAggregatedTransactions,
      start,
      end
    });
  }
});
const tracesByIdRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/traces/{traceId}',
  params: t.type({
    path: t.type({
      traceId: t.string
    }),
    query: _default_api_types.rangeRt
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const setup = await (0, _setup_request.setupRequest)(resources);
    const {
      params
    } = resources;
    const {
      traceId
    } = params.path;
    const {
      start,
      end
    } = params.query;
    return (0, _get_trace_items.getTraceItems)(traceId, setup, start, end);
  }
});
const rootTransactionByTraceIdRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/traces/{traceId}/root_transaction',
  params: t.type({
    path: t.type({
      traceId: t.string
    })
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const {
      params
    } = resources;
    const {
      traceId
    } = params.path;
    const setup = await (0, _setup_request.setupRequest)(resources);
    return (0, _get_transaction_by_trace.getRootTransactionByTraceId)(traceId, setup);
  }
});
const transactionByIdRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/transactions/{transactionId}',
  params: t.type({
    path: t.type({
      transactionId: t.string
    })
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const {
      params
    } = resources;
    const {
      transactionId
    } = params.path;
    const setup = await (0, _setup_request.setupRequest)(resources);
    return {
      transaction: await (0, _get_transaction.getTransaction)({
        transactionId,
        setup
      })
    };
  }
});
const traceRouteRepository = { ...tracesByIdRoute,
  ...tracesRoute,
  ...rootTransactionByTraceIdRoute,
  ...transactionByIdRoute
};
exports.traceRouteRepository = traceRouteRepository;