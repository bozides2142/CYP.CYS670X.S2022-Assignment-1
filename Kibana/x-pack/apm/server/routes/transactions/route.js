"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transactionRouteRepository = void 0;

var _ioTsUtils = require("@kbn/io-ts-utils");

var t = _interopRequireWildcard(require("io-ts"));

var _latency_aggregation_types = require("../../../common/latency_aggregation_types");

var _transactions = require("../../lib/helpers/transactions");

var _setup_request = require("../../lib/helpers/setup_request");

var _get_service_transaction_groups = require("../services/get_service_transaction_groups");

var _get_service_transaction_group_detailed_statistics = require("../services/get_service_transaction_group_detailed_statistics");

var _breakdown = require("./breakdown");

var _trace_samples = require("./trace_samples");

var _get_latency_charts = require("./get_latency_charts");

var _get_failed_transaction_rate_periods = require("./get_failed_transaction_rate_periods");

var _get_coldstart_rate = require("../../lib/transaction_groups/get_coldstart_rate");

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


const transactionGroupsMainStatisticsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/transactions/groups/main_statistics',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([_default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt, t.type({
      transactionType: t.string,
      latencyAggregationType: _latency_aggregation_types.latencyAggregationTypeRt
    })])
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
      path: {
        serviceName
      },
      query: {
        environment,
        kuery,
        latencyAggregationType,
        transactionType,
        start,
        end
      }
    } = params;
    const searchAggregatedTransactions = await (0, _transactions.getSearchAggregatedTransactions)({ ...setup,
      kuery,
      start,
      end
    });
    return (0, _get_service_transaction_groups.getServiceTransactionGroups)({
      environment,
      kuery,
      setup,
      serviceName,
      searchAggregatedTransactions,
      transactionType,
      latencyAggregationType,
      start,
      end
    });
  }
});
const transactionGroupsDetailedStatisticsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/transactions/groups/detailed_statistics',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([_default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt, _default_api_types.comparisonRangeRt, t.type({
      transactionNames: _ioTsUtils.jsonRt.pipe(t.array(t.string)),
      numBuckets: _ioTsUtils.toNumberRt,
      transactionType: t.string,
      latencyAggregationType: _latency_aggregation_types.latencyAggregationTypeRt
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
        transactionNames,
        latencyAggregationType,
        numBuckets,
        transactionType,
        comparisonStart,
        comparisonEnd,
        start,
        end
      }
    } = params;
    const searchAggregatedTransactions = await (0, _transactions.getSearchAggregatedTransactions)({ ...setup,
      kuery,
      start,
      end
    });
    return await (0, _get_service_transaction_group_detailed_statistics.getServiceTransactionGroupDetailedStatisticsPeriods)({
      environment,
      kuery,
      setup,
      serviceName,
      transactionNames,
      searchAggregatedTransactions,
      transactionType,
      numBuckets,
      latencyAggregationType,
      comparisonStart,
      comparisonEnd,
      start,
      end
    });
  }
});
const transactionLatencyChartsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/transactions/charts/latency',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([t.type({
      transactionType: t.string,
      latencyAggregationType: _latency_aggregation_types.latencyAggregationTypeRt
    }), t.partial({
      transactionName: t.string
    }), t.intersection([_default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt, _default_api_types.comparisonRangeRt])])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const setup = await (0, _setup_request.setupRequest)(resources);
    const {
      params,
      logger
    } = resources;
    const {
      serviceName
    } = params.path;
    const {
      environment,
      kuery,
      transactionType,
      transactionName,
      latencyAggregationType,
      comparisonStart,
      comparisonEnd,
      start,
      end
    } = params.query;
    const searchAggregatedTransactions = await (0, _transactions.getSearchAggregatedTransactions)({ ...setup,
      kuery,
      start,
      end
    });
    const options = {
      environment,
      kuery,
      serviceName,
      transactionType,
      transactionName,
      setup,
      searchAggregatedTransactions,
      logger,
      start,
      end
    };
    const {
      currentPeriod,
      previousPeriod
    } = await (0, _get_latency_charts.getLatencyPeriods)({ ...options,
      latencyAggregationType: latencyAggregationType,
      comparisonStart,
      comparisonEnd
    });
    return {
      currentPeriod,
      previousPeriod
    };
  }
});
const transactionTraceSamplesRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/transactions/traces/samples',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([t.type({
      transactionType: t.string,
      transactionName: t.string
    }), t.partial({
      transactionId: t.string,
      traceId: t.string,
      sampleRangeFrom: _ioTsUtils.toNumberRt,
      sampleRangeTo: _ioTsUtils.toNumberRt
    }), _default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt])
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
      transactionType,
      transactionName,
      transactionId = '',
      traceId = '',
      sampleRangeFrom,
      sampleRangeTo,
      start,
      end
    } = params.query;
    return (0, _trace_samples.getTransactionTraceSamples)({
      environment,
      kuery,
      serviceName,
      transactionType,
      transactionName,
      transactionId,
      traceId,
      sampleRangeFrom,
      sampleRangeTo,
      setup,
      start,
      end
    });
  }
});
const transactionChartsBreakdownRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/transaction/charts/breakdown',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([t.type({
      transactionType: t.string
    }), t.partial({
      transactionName: t.string
    }), _default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt])
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
      transactionName,
      transactionType,
      start,
      end
    } = params.query;
    return (0, _breakdown.getTransactionBreakdown)({
      environment,
      kuery,
      serviceName,
      transactionName,
      transactionType,
      setup,
      start,
      end
    });
  }
});
const transactionChartsErrorRateRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/transactions/charts/error_rate',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([t.type({
      transactionType: t.string
    }), t.partial({
      transactionName: t.string
    }), t.intersection([_default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt, _default_api_types.comparisonRangeRt])])
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
      transactionType,
      transactionName,
      comparisonStart,
      comparisonEnd,
      start,
      end
    } = params.query;
    const searchAggregatedTransactions = await (0, _transactions.getSearchAggregatedTransactions)({ ...setup,
      kuery,
      start,
      end
    });
    return (0, _get_failed_transaction_rate_periods.getFailedTransactionRatePeriods)({
      environment,
      kuery,
      serviceName,
      transactionType,
      transactionName,
      setup,
      searchAggregatedTransactions,
      comparisonStart,
      comparisonEnd,
      start,
      end
    });
  }
});
const transactionChartsColdstartRateRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/transactions/charts/coldstart_rate',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([t.type({
      transactionType: t.string
    }), t.intersection([_default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt, _default_api_types.comparisonRangeRt])])
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
      transactionType,
      comparisonStart,
      comparisonEnd,
      start,
      end
    } = params.query;
    const searchAggregatedTransactions = await (0, _transactions.getSearchAggregatedTransactions)({ ...setup,
      kuery,
      start,
      end
    });
    return (0, _get_coldstart_rate.getColdstartRatePeriods)({
      environment,
      kuery,
      serviceName,
      transactionType,
      setup,
      searchAggregatedTransactions,
      comparisonStart,
      comparisonEnd,
      start,
      end
    });
  }
});
const transactionChartsColdstartRateByTransactionNameRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/transactions/charts/coldstart_rate_by_transaction_name',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([t.type({
      transactionType: t.string,
      transactionName: t.string
    }), t.intersection([_default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt, _default_api_types.comparisonRangeRt])])
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
      transactionType,
      transactionName,
      comparisonStart,
      comparisonEnd,
      start,
      end
    } = params.query;
    const searchAggregatedTransactions = await (0, _transactions.getSearchAggregatedTransactions)({ ...setup,
      kuery,
      start,
      end
    });
    return (0, _get_coldstart_rate.getColdstartRatePeriods)({
      environment,
      kuery,
      serviceName,
      transactionType,
      transactionName,
      setup,
      searchAggregatedTransactions,
      comparisonStart,
      comparisonEnd,
      start,
      end
    });
  }
});
const transactionRouteRepository = { ...transactionGroupsMainStatisticsRoute,
  ...transactionGroupsDetailedStatisticsRoute,
  ...transactionLatencyChartsRoute,
  ...transactionTraceSamplesRoute,
  ...transactionChartsBreakdownRoute,
  ...transactionChartsErrorRateRoute,
  ...transactionChartsColdstartRateRoute,
  ...transactionChartsColdstartRateByTransactionNameRoute
};
exports.transactionRouteRepository = transactionRouteRepository;