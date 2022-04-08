"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serviceRouteRepository = exports.serviceInstancesMetadataDetails = exports.serviceDependenciesRoute = exports.serviceDependenciesBreakdownRoute = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _ioTsUtils = require("@kbn/io-ts-utils");

var t = _interopRequireWildcard(require("io-ts"));

var _lodash = require("lodash");

var _latency_aggregation_types = require("../../../common/latency_aggregation_types");

var _profiling = require("../../../common/profiling");

var _transactions = require("../../lib/helpers/transactions");

var _setup_request = require("../../lib/helpers/setup_request");

var _annotations = require("./annotations");

var _get_services = require("./get_services");

var _get_service_agent = require("./get_service_agent");

var _get_service_alerts = require("./get_service_alerts");

var _get_service_dependencies = require("./get_service_dependencies");

var _get_service_instance_metadata_details = require("./get_service_instance_metadata_details");

var _main_statistics = require("./get_service_instances/main_statistics");

var _get_service_metadata_details = require("./get_service_metadata_details");

var _get_service_metadata_icons = require("./get_service_metadata_icons");

var _get_service_node_metadata = require("./get_service_node_metadata");

var _get_service_transaction_types = require("./get_service_transaction_types");

var _get_throughput = require("./get_throughput");

var _get_service_profiling_statistics = require("./profiling/get_service_profiling_statistics");

var _get_service_profiling_timeline = require("./profiling/get_service_profiling_timeline");

var _get_service_infrastructure = require("./get_service_infrastructure");

var _with_apm_span = require("../../utils/with_apm_span");

var _create_apm_server_route = require("../apm_routes/create_apm_server_route");

var _default_api_types = require("../default_api_types");

var _offset_previous_period_coordinate = require("../../../common/utils/offset_previous_period_coordinate");

var _get_services_detailed_statistics = require("./get_services_detailed_statistics");

var _get_service_dependencies_breakdown = require("./get_service_dependencies_breakdown");

var _get_bucket_size_for_aggregated_transactions = require("../../lib/helpers/get_bucket_size_for_aggregated_transactions");

var _get_anomaly_timeseries = require("../../lib/anomaly_detection/get_anomaly_timeseries");

var _server = require("../../../../ml/server");

var _detailed_statistics = require("./get_service_instances/detailed_statistics");

var _anomaly_detection = require("../../../common/anomaly_detection");

var _annotations2 = require("./../../../../observability/common/annotations");

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


const servicesRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services',
  params: t.type({
    query: t.intersection([_default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt])
  }),
  options: {
    tags: ['access:apm']
  },

  async handler(resources) {
    const setup = await (0, _setup_request.setupRequest)(resources);
    const {
      params,
      logger
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
    return (0, _get_services.getServices)({
      environment,
      kuery,
      setup,
      searchAggregatedTransactions,
      logger,
      start,
      end
    });
  }

});
const servicesDetailedStatisticsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/detailed_statistics',
  params: t.type({
    query: t.intersection([_default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt, _default_api_types.offsetRt, t.type({
      serviceNames: _ioTsUtils.jsonRt.pipe(t.array(t.string))
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
      environment,
      kuery,
      offset,
      serviceNames,
      start,
      end
    } = params.query;
    const searchAggregatedTransactions = await (0, _transactions.getSearchAggregatedTransactions)({ ...setup,
      start,
      end,
      kuery
    });

    if (!serviceNames.length) {
      throw _boom.default.badRequest(`serviceNames cannot be empty`);
    }

    return (0, _get_services_detailed_statistics.getServicesDetailedStatistics)({
      environment,
      kuery,
      setup,
      searchAggregatedTransactions,
      offset,
      serviceNames,
      start,
      end
    });
  }
});
const serviceMetadataDetailsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/metadata/details',
  params: t.type({
    path: t.type({
      serviceName: t.string
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
      serviceName
    } = params.path;
    const {
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
    return (0, _get_service_metadata_details.getServiceMetadataDetails)({
      serviceName,
      setup,
      searchAggregatedTransactions,
      start,
      end
    });
  }
});
const serviceMetadataIconsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/metadata/icons',
  params: t.type({
    path: t.type({
      serviceName: t.string
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
      serviceName
    } = params.path;
    const {
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
    return (0, _get_service_metadata_icons.getServiceMetadataIcons)({
      serviceName,
      setup,
      searchAggregatedTransactions,
      start,
      end
    });
  }
});
const serviceAgentRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/agent',
  params: t.type({
    path: t.type({
      serviceName: t.string
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
      serviceName
    } = params.path;
    const {
      start,
      end
    } = params.query;
    return (0, _get_service_agent.getServiceAgent)({
      serviceName,
      setup,
      start,
      end
    });
  }
});
const serviceTransactionTypesRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/transaction_types',
  params: t.type({
    path: t.type({
      serviceName: t.string
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
      serviceName
    } = params.path;
    const {
      start,
      end
    } = params.query;
    return (0, _get_service_transaction_types.getServiceTransactionTypes)({
      serviceName,
      setup,
      searchAggregatedTransactions: await (0, _transactions.getSearchAggregatedTransactions)({
        apmEventClient: setup.apmEventClient,
        config: setup.config,
        start,
        end,
        kuery: ''
      }),
      start,
      end
    });
  }
});
const serviceNodeMetadataRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/node/{serviceNodeName}/metadata',
  params: t.type({
    path: t.type({
      serviceName: t.string,
      serviceNodeName: t.string
    }),
    query: t.intersection([_default_api_types.kueryRt, _default_api_types.rangeRt])
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
      serviceName,
      serviceNodeName
    } = params.path;
    const {
      kuery,
      start,
      end
    } = params.query;
    return (0, _get_service_node_metadata.getServiceNodeMetadata)({
      kuery,
      setup,
      serviceName,
      serviceNodeName,
      start,
      end
    });
  }
});
const serviceAnnotationsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /api/apm/services/{serviceName}/annotation/search',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([_default_api_types.environmentRt, _default_api_types.rangeRt])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const setup = await (0, _setup_request.setupRequest)(resources);
    const {
      params,
      plugins,
      context,
      request,
      logger
    } = resources;
    const {
      serviceName
    } = params.path;
    const {
      environment,
      start,
      end
    } = params.query;
    const {
      observability
    } = plugins;
    const [annotationsClient, searchAggregatedTransactions] = await Promise.all([observability ? (0, _with_apm_span.withApmSpan)('get_scoped_annotations_client', () => observability.setup.getScopedAnnotationsClient(context, request)) : undefined, (0, _transactions.getSearchAggregatedTransactions)({
      apmEventClient: setup.apmEventClient,
      config: setup.config,
      start,
      end,
      kuery: ''
    })]);
    return (0, _annotations.getServiceAnnotations)({
      environment,
      setup,
      searchAggregatedTransactions,
      serviceName,
      annotationsClient,
      client: context.core.elasticsearch.client.asCurrentUser,
      logger,
      start,
      end
    });
  }
});
const serviceAnnotationsCreateRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'POST /api/apm/services/{serviceName}/annotation',
  options: {
    tags: ['access:apm', 'access:apm_write']
  },
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    body: t.intersection([t.type({
      '@timestamp': _ioTsUtils.isoToEpochRt,
      service: t.intersection([t.type({
        version: t.string
      }), t.partial({
        environment: t.string
      })])
    }), t.partial({
      message: t.string,
      tags: t.array(t.string)
    })])
  }),
  handler: async resources => {
    const {
      request,
      context,
      plugins: {
        observability
      },
      params
    } = resources;
    const annotationsClient = observability ? await (0, _with_apm_span.withApmSpan)('get_scoped_annotations_client', () => observability.setup.getScopedAnnotationsClient(context, request)) : undefined;

    if (!annotationsClient) {
      throw _boom.default.notFound();
    }

    const {
      body,
      path
    } = params;
    return (0, _with_apm_span.withApmSpan)('create_annotation', () => {
      var _body$tags;

      return annotationsClient.create({
        message: body.service.version,
        ...body,
        '@timestamp': new Date(body['@timestamp']).toISOString(),
        annotation: {
          type: 'deployment'
        },
        service: { ...body.service,
          name: path.serviceName
        },
        tags: (0, _lodash.uniq)(['apm'].concat((_body$tags = body.tags) !== null && _body$tags !== void 0 ? _body$tags : []))
      });
    });
  }
});
const serviceThroughputRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/throughput',
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
    const {
      bucketSize,
      intervalString
    } = (0, _get_bucket_size_for_aggregated_transactions.getBucketSizeForAggregatedTransactions)({
      start,
      end,
      searchAggregatedTransactions
    });
    const commonProps = {
      environment,
      kuery,
      searchAggregatedTransactions,
      serviceName,
      setup,
      transactionType,
      transactionName,
      intervalString,
      bucketSize
    };
    const [currentPeriod, previousPeriod] = await Promise.all([(0, _get_throughput.getThroughput)({ ...commonProps,
      start,
      end
    }), comparisonStart && comparisonEnd ? (0, _get_throughput.getThroughput)({ ...commonProps,
      start: comparisonStart,
      end: comparisonEnd
    }) : []]);
    return {
      currentPeriod,
      previousPeriod: (0, _offset_previous_period_coordinate.offsetPreviousPeriodCoordinates)({
        currentPeriodTimeseries: currentPeriod,
        previousPeriodTimeseries: previousPeriod
      })
    };
  }
});
const serviceInstancesMainStatisticsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/service_overview_instances/main_statistics',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([t.type({
      latencyAggregationType: _latency_aggregation_types.latencyAggregationTypeRt,
      transactionType: t.string
    }), _default_api_types.comparisonRangeRt, _default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt])
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
    const [currentPeriod, previousPeriod] = await Promise.all([(0, _main_statistics.getServiceInstancesMainStatistics)({
      environment,
      kuery,
      latencyAggregationType,
      serviceName,
      setup,
      transactionType,
      searchAggregatedTransactions,
      start,
      end
    }), ...(comparisonStart && comparisonEnd ? [(0, _main_statistics.getServiceInstancesMainStatistics)({
      environment,
      kuery,
      latencyAggregationType,
      serviceName,
      setup,
      transactionType,
      searchAggregatedTransactions,
      start: comparisonStart,
      end: comparisonEnd
    })] : [])]);
    return {
      currentPeriod,
      previousPeriod
    };
  }
});
const serviceInstancesDetailedStatisticsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/service_overview_instances/detailed_statistics',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([t.type({
      latencyAggregationType: _latency_aggregation_types.latencyAggregationTypeRt,
      transactionType: t.string,
      serviceNodeIds: _ioTsUtils.jsonRt.pipe(t.array(t.string)),
      numBuckets: _ioTsUtils.toNumberRt
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
      transactionType,
      comparisonStart,
      comparisonEnd,
      serviceNodeIds,
      numBuckets,
      latencyAggregationType,
      start,
      end
    } = params.query;
    const searchAggregatedTransactions = await (0, _transactions.getSearchAggregatedTransactions)({ ...setup,
      kuery,
      start,
      end
    });
    return (0, _detailed_statistics.getServiceInstancesDetailedStatisticsPeriods)({
      environment,
      kuery,
      latencyAggregationType,
      serviceName,
      setup,
      transactionType,
      searchAggregatedTransactions,
      numBuckets,
      serviceNodeIds,
      comparisonStart,
      comparisonEnd,
      start,
      end
    });
  }
});
const serviceInstancesMetadataDetails = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/service_overview_instances/details/{serviceNodeName}',
  params: t.type({
    path: t.type({
      serviceName: t.string,
      serviceNodeName: t.string
    }),
    query: _default_api_types.rangeRt
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const setup = await (0, _setup_request.setupRequest)(resources);
    const {
      serviceName,
      serviceNodeName
    } = resources.params.path;
    const {
      start,
      end
    } = resources.params.query;
    return await (0, _get_service_instance_metadata_details.getServiceInstanceMetadataDetails)({
      setup,
      serviceName,
      serviceNodeName,
      start,
      end
    });
  }
});
exports.serviceInstancesMetadataDetails = serviceInstancesMetadataDetails;
const serviceDependenciesRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/dependencies',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([t.type({
      numBuckets: _ioTsUtils.toNumberRt
    }), _default_api_types.environmentRt, _default_api_types.rangeRt, _default_api_types.offsetRt])
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
      numBuckets,
      start,
      end,
      offset
    } = params.query;
    const opts = {
      setup,
      start,
      end,
      serviceName,
      environment,
      numBuckets
    };
    const [currentPeriod, previousPeriod] = await Promise.all([(0, _get_service_dependencies.getServiceDependencies)(opts), ...(offset ? [(0, _get_service_dependencies.getServiceDependencies)({ ...opts,
      offset
    })] : [[]])]);
    return {
      serviceDependencies: currentPeriod.map(item => {
        const {
          stats,
          ...rest
        } = item;
        const previousPeriodItem = previousPeriod.find(prevItem => item.location.id === prevItem.location.id);
        return { ...rest,
          currentStats: stats,
          previousStats: (previousPeriodItem === null || previousPeriodItem === void 0 ? void 0 : previousPeriodItem.stats) || null
        };
      })
    };
  }
});
exports.serviceDependenciesRoute = serviceDependenciesRoute;
const serviceDependenciesBreakdownRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/dependencies/breakdown',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([_default_api_types.environmentRt, _default_api_types.rangeRt, _default_api_types.kueryRt])
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
      start,
      end,
      kuery
    } = params.query;
    const breakdown = await (0, _get_service_dependencies_breakdown.getServiceDependenciesBreakdown)({
      setup,
      start,
      end,
      serviceName,
      environment,
      kuery
    });
    return {
      breakdown
    };
  }
});
exports.serviceDependenciesBreakdownRoute = serviceDependenciesBreakdownRoute;
const serviceProfilingTimelineRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/profiling/timeline',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
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
      path: {
        serviceName
      },
      query: {
        environment,
        kuery,
        start,
        end
      }
    } = params;
    const profilingTimeline = await (0, _get_service_profiling_timeline.getServiceProfilingTimeline)({
      kuery,
      setup,
      serviceName,
      environment,
      start,
      end
    });
    return {
      profilingTimeline
    };
  }
});
const serviceProfilingStatisticsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/profiling/statistics',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([_default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt, t.type({
      valueType: t.union([t.literal(_profiling.ProfilingValueType.wallTime), t.literal(_profiling.ProfilingValueType.cpuTime), t.literal(_profiling.ProfilingValueType.samples), t.literal(_profiling.ProfilingValueType.allocObjects), t.literal(_profiling.ProfilingValueType.allocSpace), t.literal(_profiling.ProfilingValueType.inuseObjects), t.literal(_profiling.ProfilingValueType.inuseSpace)])
    })])
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
      path: {
        serviceName
      },
      query: {
        environment,
        kuery,
        valueType,
        start,
        end
      }
    } = params;
    return (0, _get_service_profiling_statistics.getServiceProfilingStatistics)({
      kuery,
      serviceName,
      environment,
      valueType,
      setup,
      logger,
      start,
      end
    });
  }
});
const serviceAlertsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/alerts',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([_default_api_types.rangeRt, _default_api_types.environmentRt, t.type({
      transactionType: t.string
    })])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async ({
    context,
    params,
    ruleDataClient
  }) => {
    const {
      query: {
        start,
        end,
        environment,
        transactionType
      },
      path: {
        serviceName
      }
    } = params;
    return {
      alerts: await (0, _get_service_alerts.getServiceAlerts)({
        ruleDataClient,
        start,
        end,
        serviceName,
        environment,
        transactionType
      })
    };
  }
});
const serviceInfrastructureRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/infrastructure',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([_default_api_types.kueryRt, _default_api_types.rangeRt, _default_api_types.environmentRt])
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
        start,
        end
      }
    } = params;
    const serviceInfrastructure = await (0, _get_service_infrastructure.getServiceInfrastructure)({
      setup,
      serviceName,
      environment,
      kuery,
      start,
      end
    });
    return {
      serviceInfrastructure
    };
  }
});
const serviceAnomalyChartsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/anomaly_charts',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([_default_api_types.rangeRt, t.type({
      transactionType: t.string
    })])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const setup = await (0, _setup_request.setupRequest)(resources);

    if (!setup.ml) {
      throw _boom.default.notImplemented(_anomaly_detection.ML_ERRORS.ML_NOT_AVAILABLE);
    }

    const {
      path: {
        serviceName
      },
      query: {
        start,
        end,
        transactionType
      }
    } = resources.params;

    try {
      const allAnomalyTimeseries = await (0, _get_anomaly_timeseries.getAnomalyTimeseries)({
        serviceName,
        transactionType,
        start,
        end,
        mlSetup: setup.ml,
        logger: resources.logger
      });
      return {
        allAnomalyTimeseries
      };
    } catch (error) {
      if (error instanceof _server.UnknownMLCapabilitiesError || error instanceof _server.InsufficientMLCapabilities || error instanceof _server.MLPrivilegesUninitialized) {
        throw _boom.default.forbidden(error.message);
      }

      throw error;
    }
  }
});
const serviceRouteRepository = { ...servicesRoute,
  ...servicesDetailedStatisticsRoute,
  ...serviceMetadataDetailsRoute,
  ...serviceMetadataIconsRoute,
  ...serviceAgentRoute,
  ...serviceTransactionTypesRoute,
  ...serviceNodeMetadataRoute,
  ...serviceAnnotationsRoute,
  ...serviceAnnotationsCreateRoute,
  ...serviceInstancesMetadataDetails,
  ...serviceThroughputRoute,
  ...serviceInstancesMainStatisticsRoute,
  ...serviceInstancesDetailedStatisticsRoute,
  ...serviceDependenciesRoute,
  ...serviceDependenciesBreakdownRoute,
  ...serviceProfilingTimelineRoute,
  ...serviceProfilingStatisticsRoute,
  ...serviceAlertsRoute,
  ...serviceInfrastructureRoute,
  ...serviceAnomalyChartsRoute
};
exports.serviceRouteRepository = serviceRouteRepository;