"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serviceMapRouteRepository = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var t = _interopRequireWildcard(require("io-ts"));

var _license_check = require("../../../common/license_check");

var _service_map = require("../../../common/service_map");

var _feature = require("../../feature");

var _transactions = require("../../lib/helpers/transactions");

var _setup_request = require("../../lib/helpers/setup_request");

var _get_service_map = require("./get_service_map");

var _get_service_map_backend_node_info = require("./get_service_map_backend_node_info");

var _get_service_map_service_node_info = require("./get_service_map_service_node_info");

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


const serviceMapRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/service-map',
  params: t.type({
    query: t.intersection([t.partial({
      serviceName: t.string
    }), _default_api_types.environmentRt, _default_api_types.rangeRt])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const {
      config,
      context,
      params,
      logger
    } = resources;

    if (!config.serviceMapEnabled) {
      throw _boom.default.notFound();
    }

    if (!(0, _license_check.isActivePlatinumLicense)(context.licensing.license)) {
      throw _boom.default.forbidden(_service_map.invalidLicenseMessage);
    }

    (0, _feature.notifyFeatureUsage)({
      licensingPlugin: context.licensing,
      featureName: 'serviceMaps'
    });
    const setup = await (0, _setup_request.setupRequest)(resources);
    const {
      query: {
        serviceName,
        environment,
        start,
        end
      }
    } = params;
    const searchAggregatedTransactions = await (0, _transactions.getSearchAggregatedTransactions)({
      apmEventClient: setup.apmEventClient,
      config: setup.config,
      start,
      end,
      kuery: ''
    });
    return (0, _get_service_map.getServiceMap)({
      setup,
      serviceName,
      environment,
      searchAggregatedTransactions,
      logger,
      start,
      end
    });
  }
});
const serviceMapServiceNodeRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/service-map/service/{serviceName}',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([_default_api_types.environmentRt, _default_api_types.rangeRt, _default_api_types.offsetRt])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const {
      config,
      context,
      params
    } = resources;

    if (!config.serviceMapEnabled) {
      throw _boom.default.notFound();
    }

    if (!(0, _license_check.isActivePlatinumLicense)(context.licensing.license)) {
      throw _boom.default.forbidden(_service_map.invalidLicenseMessage);
    }

    const setup = await (0, _setup_request.setupRequest)(resources);
    const {
      path: {
        serviceName
      },
      query: {
        environment,
        start,
        end,
        offset
      }
    } = params;
    const searchAggregatedTransactions = await (0, _transactions.getSearchAggregatedTransactions)({
      apmEventClient: setup.apmEventClient,
      config: setup.config,
      start,
      end,
      kuery: ''
    });
    const commonProps = {
      environment,
      setup,
      serviceName,
      searchAggregatedTransactions,
      start,
      end
    };
    const [currentPeriod, previousPeriod] = await Promise.all([(0, _get_service_map_service_node_info.getServiceMapServiceNodeInfo)(commonProps), offset ? (0, _get_service_map_service_node_info.getServiceMapServiceNodeInfo)({ ...commonProps,
      offset
    }) : undefined]);
    return {
      currentPeriod,
      previousPeriod
    };
  }
});
const serviceMapBackendNodeRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/service-map/backend',
  params: t.type({
    query: t.intersection([t.type({
      backendName: t.string
    }), _default_api_types.environmentRt, _default_api_types.rangeRt, _default_api_types.offsetRt])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const {
      config,
      context,
      params
    } = resources;

    if (!config.serviceMapEnabled) {
      throw _boom.default.notFound();
    }

    if (!(0, _license_check.isActivePlatinumLicense)(context.licensing.license)) {
      throw _boom.default.forbidden(_service_map.invalidLicenseMessage);
    }

    const setup = await (0, _setup_request.setupRequest)(resources);
    const {
      query: {
        backendName,
        environment,
        start,
        end,
        offset
      }
    } = params;
    const commonProps = {
      environment,
      setup,
      backendName,
      start,
      end
    };
    const [currentPeriod, previousPeriod] = await Promise.all([(0, _get_service_map_backend_node_info.getServiceMapBackendNodeInfo)(commonProps), offset ? (0, _get_service_map_backend_node_info.getServiceMapBackendNodeInfo)({ ...commonProps,
      offset
    }) : undefined]);
    return {
      currentPeriod,
      previousPeriod
    };
  }
});
const serviceMapRouteRepository = { ...serviceMapRoute,
  ...serviceMapServiceNodeRoute,
  ...serviceMapBackendNodeRoute
};
exports.serviceMapRouteRepository = serviceMapRouteRepository;