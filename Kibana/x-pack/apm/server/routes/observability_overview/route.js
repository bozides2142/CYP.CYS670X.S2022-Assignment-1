"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.observabilityOverviewRouteRepository = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _ioTsUtils = require("@kbn/io-ts-utils");

var _setup_request = require("../../lib/helpers/setup_request");

var _get_service_count = require("./get_service_count");

var _get_transactions_per_minute = require("./get_transactions_per_minute");

var _has_data = require("./has_data");

var _default_api_types = require("../default_api_types");

var _transactions = require("../../lib/helpers/transactions");

var _with_apm_span = require("../../utils/with_apm_span");

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


const observabilityOverviewHasDataRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/observability_overview/has_data',
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const setup = await (0, _setup_request.setupRequest)(resources);
    return await (0, _has_data.getHasData)({
      setup
    });
  }
});
const observabilityOverviewRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/observability_overview',
  params: t.type({
    query: t.intersection([_default_api_types.rangeRt, t.type({
      bucketSize: _ioTsUtils.toNumberRt,
      intervalString: t.string
    })])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const setup = await (0, _setup_request.setupRequest)(resources);
    const {
      bucketSize,
      intervalString,
      start,
      end
    } = resources.params.query;
    const searchAggregatedTransactions = await (0, _transactions.getSearchAggregatedTransactions)({
      apmEventClient: setup.apmEventClient,
      config: setup.config,
      start,
      end,
      kuery: ''
    });
    return (0, _with_apm_span.withApmSpan)('observability_overview', async () => {
      const [serviceCount, transactionPerMinute] = await Promise.all([(0, _get_service_count.getServiceCount)({
        setup,
        searchAggregatedTransactions,
        start,
        end
      }), (0, _get_transactions_per_minute.getTransactionsPerMinute)({
        setup,
        bucketSize,
        searchAggregatedTransactions,
        start,
        end,
        intervalString
      })]);
      return {
        serviceCount,
        transactionPerMinute
      };
    });
  }
});
const observabilityOverviewRouteRepository = { ...observabilityOverviewRoute,
  ...observabilityOverviewHasDataRoute
};
exports.observabilityOverviewRouteRepository = observabilityOverviewRouteRepository;