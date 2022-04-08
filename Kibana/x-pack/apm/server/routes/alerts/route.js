"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.alertsChartPreviewRouteRepository = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _get_transaction_duration = require("./chart_preview/get_transaction_duration");

var _get_transaction_error_count = require("./chart_preview/get_transaction_error_count");

var _get_transaction_error_rate = require("./chart_preview/get_transaction_error_rate");

var _setup_request = require("../../lib/helpers/setup_request");

var _create_apm_server_route = require("../apm_routes/create_apm_server_route");

var _default_api_types = require("../default_api_types");

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


const alertParamsRt = t.intersection([t.partial({
  aggregationType: t.union([t.literal('avg'), t.literal('95th'), t.literal('99th')]),
  serviceName: t.string,
  transactionType: t.string
}), _default_api_types.environmentRt, _default_api_types.rangeRt, t.type({
  interval: t.string
})]);
const transactionErrorRateChartPreview = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/alerts/chart_preview/transaction_error_rate',
  params: t.type({
    query: alertParamsRt
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
      _inspect,
      ...alertParams
    } = params.query;
    const errorRateChartPreview = await (0, _get_transaction_error_rate.getTransactionErrorRateChartPreview)({
      setup,
      alertParams
    });
    return {
      errorRateChartPreview
    };
  }
});
const transactionErrorCountChartPreview = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/alerts/chart_preview/transaction_error_count',
  params: t.type({
    query: alertParamsRt
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
      _inspect,
      ...alertParams
    } = params.query;
    const errorCountChartPreview = await (0, _get_transaction_error_count.getTransactionErrorCountChartPreview)({
      setup,
      alertParams
    });
    return {
      errorCountChartPreview
    };
  }
});
const transactionDurationChartPreview = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/alerts/chart_preview/transaction_duration',
  params: t.type({
    query: alertParamsRt
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
      _inspect,
      ...alertParams
    } = params.query;
    const latencyChartPreview = await (0, _get_transaction_duration.getTransactionDurationChartPreview)({
      alertParams,
      setup
    });
    return {
      latencyChartPreview
    };
  }
});
const alertsChartPreviewRouteRepository = { ...transactionErrorRateChartPreview,
  ...transactionDurationChartPreview,
  ...transactionErrorCountChartPreview,
  ...transactionDurationChartPreview
};
exports.alertsChartPreviewRouteRepository = alertsChartPreviewRouteRepository;