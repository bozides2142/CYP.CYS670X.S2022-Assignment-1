"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.errorsRouteRepository = void 0;

var _ioTsUtils = require("@kbn/io-ts-utils");

var t = _interopRequireWildcard(require("io-ts"));

var _create_apm_server_route = require("../apm_routes/create_apm_server_route");

var _get_distribution = require("./distribution/get_distribution");

var _setup_request = require("../../lib/helpers/setup_request");

var _default_api_types = require("../default_api_types");

var _get_error_group_main_statistics = require("./get_error_groups/get_error_group_main_statistics");

var _get_error_group_detailed_statistics = require("./get_error_groups/get_error_group_detailed_statistics");

var _get_error_group_sample = require("./get_error_groups/get_error_group_sample");

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


const errorsMainStatisticsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/errors/groups/main_statistics',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([t.partial({
      sortField: t.string,
      sortDirection: t.union([t.literal('asc'), t.literal('desc')])
    }), _default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const {
      params
    } = resources;
    const setup = await (0, _setup_request.setupRequest)(resources);
    const {
      serviceName
    } = params.path;
    const {
      environment,
      kuery,
      sortField,
      sortDirection,
      start,
      end
    } = params.query;
    const errorGroups = await (0, _get_error_group_main_statistics.getErrorGroupMainStatistics)({
      environment,
      kuery,
      serviceName,
      sortField,
      sortDirection,
      setup,
      start,
      end
    });
    return {
      errorGroups
    };
  }
});
const errorsDetailedStatisticsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/errors/groups/detailed_statistics',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([_default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt, _default_api_types.comparisonRangeRt, t.type({
      numBuckets: _ioTsUtils.toNumberRt,
      groupIds: _ioTsUtils.jsonRt.pipe(t.array(t.string))
    })])
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
      path: {
        serviceName
      },
      query: {
        environment,
        kuery,
        numBuckets,
        groupIds,
        comparisonStart,
        comparisonEnd,
        start,
        end
      }
    } = params;
    return (0, _get_error_group_detailed_statistics.getErrorGroupPeriods)({
      environment,
      kuery,
      serviceName,
      setup,
      numBuckets,
      groupIds,
      comparisonStart,
      comparisonEnd,
      start,
      end
    });
  }
});
const errorGroupsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/errors/{groupId}',
  params: t.type({
    path: t.type({
      serviceName: t.string,
      groupId: t.string
    }),
    query: t.intersection([_default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const {
      params
    } = resources;
    const setup = await (0, _setup_request.setupRequest)(resources);
    const {
      serviceName,
      groupId
    } = params.path;
    const {
      environment,
      kuery,
      start,
      end
    } = params.query;
    return (0, _get_error_group_sample.getErrorGroupSample)({
      environment,
      groupId,
      kuery,
      serviceName,
      setup,
      start,
      end
    });
  }
});
const errorDistributionRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/errors/distribution',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([t.partial({
      groupId: t.string
    }), _default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt, _default_api_types.comparisonRangeRt])
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
      serviceName
    } = params.path;
    const {
      environment,
      kuery,
      groupId,
      start,
      end,
      comparisonStart,
      comparisonEnd
    } = params.query;
    return (0, _get_distribution.getErrorDistribution)({
      environment,
      kuery,
      serviceName,
      groupId,
      setup,
      start,
      end,
      comparisonStart,
      comparisonEnd
    });
  }
});
const errorsRouteRepository = { ...errorsMainStatisticsRoute,
  ...errorsDetailedStatisticsRoute,
  ...errorGroupsRoute,
  ...errorDistributionRoute
};
exports.errorsRouteRepository = errorsRouteRepository;