"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.backendsRouteRepository = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _ioTsUtils = require("@kbn/io-ts-utils");

var _setup_request = require("../../lib/helpers/setup_request");

var _default_api_types = require("../default_api_types");

var _create_apm_server_route = require("../apm_routes/create_apm_server_route");

var _get_metadata_for_backend = require("./get_metadata_for_backend");

var _get_latency_charts_for_backend = require("./get_latency_charts_for_backend");

var _get_top_backends = require("./get_top_backends");

var _get_upstream_services_for_backend = require("./get_upstream_services_for_backend");

var _get_throughput_charts_for_backend = require("./get_throughput_charts_for_backend");

var _get_error_rate_charts_for_backend = require("./get_error_rate_charts_for_backend");

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


const topBackendsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/backends/top_backends',
  params: t.intersection([t.type({
    query: t.intersection([_default_api_types.rangeRt, _default_api_types.environmentRt, _default_api_types.kueryRt, t.type({
      numBuckets: _ioTsUtils.toNumberRt
    })])
  }), t.partial({
    query: _default_api_types.offsetRt
  })]),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const setup = await (0, _setup_request.setupRequest)(resources);
    const {
      environment,
      offset,
      numBuckets,
      kuery,
      start,
      end
    } = resources.params.query;
    const opts = {
      setup,
      start,
      end,
      numBuckets,
      environment,
      kuery
    };
    const [currentBackends, previousBackends] = await Promise.all([(0, _get_top_backends.getTopBackends)(opts), offset ? (0, _get_top_backends.getTopBackends)({ ...opts,
      offset
    }) : Promise.resolve([])]);
    return {
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      backends: currentBackends.map(backend => {
        var _prev$stats;

        const {
          stats,
          ...rest
        } = backend;
        const prev = previousBackends.find(item => item.location.id === backend.location.id);
        return { ...rest,
          currentStats: stats,
          previousStats: (_prev$stats = prev === null || prev === void 0 ? void 0 : prev.stats) !== null && _prev$stats !== void 0 ? _prev$stats : null
        };
      })
    };
  }
});
const upstreamServicesForBackendRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/backends/upstream_services',
  params: t.intersection([t.type({
    query: t.intersection([t.type({
      backendName: t.string
    }), _default_api_types.rangeRt, t.type({
      numBuckets: _ioTsUtils.toNumberRt
    })])
  }), t.partial({
    query: t.intersection([_default_api_types.environmentRt, _default_api_types.offsetRt, _default_api_types.kueryRt])
  })]),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const setup = await (0, _setup_request.setupRequest)(resources);
    const {
      query: {
        backendName,
        environment,
        offset,
        numBuckets,
        kuery,
        start,
        end
      }
    } = resources.params;
    const opts = {
      backendName,
      setup,
      start,
      end,
      numBuckets,
      environment,
      kuery
    };
    const [currentServices, previousServices] = await Promise.all([(0, _get_upstream_services_for_backend.getUpstreamServicesForBackend)(opts), offset ? (0, _get_upstream_services_for_backend.getUpstreamServicesForBackend)({ ...opts,
      offset
    }) : Promise.resolve([])]);
    return {
      services: currentServices.map(service => {
        var _prev$stats2;

        const {
          stats,
          ...rest
        } = service;
        const prev = previousServices.find(item => item.location.id === service.location.id);
        return { ...rest,
          currentStats: stats,
          previousStats: (_prev$stats2 = prev === null || prev === void 0 ? void 0 : prev.stats) !== null && _prev$stats2 !== void 0 ? _prev$stats2 : null
        };
      })
    };
  }
});
const backendMetadataRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/backends/metadata',
  params: t.type({
    query: t.intersection([t.type({
      backendName: t.string
    }), _default_api_types.rangeRt])
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
      backendName,
      start,
      end
    } = params.query;
    const metadata = await (0, _get_metadata_for_backend.getMetadataForBackend)({
      backendName,
      setup,
      start,
      end
    });
    return {
      metadata
    };
  }
});
const backendLatencyChartsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/backends/charts/latency',
  params: t.type({
    query: t.intersection([t.type({
      backendName: t.string
    }), _default_api_types.rangeRt, _default_api_types.kueryRt, _default_api_types.environmentRt, _default_api_types.offsetRt])
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
      backendName,
      kuery,
      environment,
      offset,
      start,
      end
    } = params.query;
    const [currentTimeseries, comparisonTimeseries] = await Promise.all([(0, _get_latency_charts_for_backend.getLatencyChartsForBackend)({
      backendName,
      setup,
      start,
      end,
      kuery,
      environment
    }), offset ? (0, _get_latency_charts_for_backend.getLatencyChartsForBackend)({
      backendName,
      setup,
      start,
      end,
      kuery,
      environment,
      offset
    }) : null]);
    return {
      currentTimeseries,
      comparisonTimeseries
    };
  }
});
const backendThroughputChartsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/backends/charts/throughput',
  params: t.type({
    query: t.intersection([t.type({
      backendName: t.string
    }), _default_api_types.rangeRt, _default_api_types.kueryRt, _default_api_types.environmentRt, _default_api_types.offsetRt])
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
      backendName,
      kuery,
      environment,
      offset,
      start,
      end
    } = params.query;
    const [currentTimeseries, comparisonTimeseries] = await Promise.all([(0, _get_throughput_charts_for_backend.getThroughputChartsForBackend)({
      backendName,
      setup,
      start,
      end,
      kuery,
      environment
    }), offset ? (0, _get_throughput_charts_for_backend.getThroughputChartsForBackend)({
      backendName,
      setup,
      start,
      end,
      kuery,
      environment,
      offset
    }) : null]);
    return {
      currentTimeseries,
      comparisonTimeseries
    };
  }
});
const backendFailedTransactionRateChartsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/backends/charts/error_rate',
  params: t.type({
    query: t.intersection([t.type({
      backendName: t.string
    }), _default_api_types.rangeRt, _default_api_types.kueryRt, _default_api_types.environmentRt, _default_api_types.offsetRt])
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
      backendName,
      kuery,
      environment,
      offset,
      start,
      end
    } = params.query;
    const [currentTimeseries, comparisonTimeseries] = await Promise.all([(0, _get_error_rate_charts_for_backend.getErrorRateChartsForBackend)({
      backendName,
      setup,
      start,
      end,
      kuery,
      environment
    }), offset ? (0, _get_error_rate_charts_for_backend.getErrorRateChartsForBackend)({
      backendName,
      setup,
      start,
      end,
      kuery,
      environment,
      offset
    }) : null]);
    return {
      currentTimeseries,
      comparisonTimeseries
    };
  }
});
const backendsRouteRepository = { ...topBackendsRoute,
  ...upstreamServicesForBackendRoute,
  ...backendMetadataRoute,
  ...backendLatencyChartsRoute,
  ...backendThroughputChartsRoute,
  ...backendFailedTransactionRateChartsRoute
};
exports.backendsRouteRepository = backendsRouteRepository;