"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rumRouteRepository = exports.percentileRangeRt = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _ioTsUtils = require("@kbn/io-ts-utils");

var _setup_request = require("../../lib/helpers/setup_request");

var _get_client_metrics = require("./get_client_metrics");

var _get_js_errors = require("./get_js_errors");

var _get_long_task_metrics = require("./get_long_task_metrics");

var _get_page_load_distribution = require("./get_page_load_distribution");

var _get_page_view_trends = require("./get_page_view_trends");

var _get_pl_dist_breakdown = require("./get_pl_dist_breakdown");

var _get_rum_services = require("./get_rum_services");

var _get_url_search = require("./get_url_search");

var _get_visitor_breakdown = require("./get_visitor_breakdown");

var _get_web_core_vitals = require("./get_web_core_vitals");

var _has_rum_data = require("./has_rum_data");

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


const percentileRangeRt = t.partial({
  minPercentile: t.string,
  maxPercentile: t.string
});
exports.percentileRangeRt = percentileRangeRt;
const uiFiltersRt = t.type({
  uiFilters: t.string
});
const uxQueryRt = t.intersection([uiFiltersRt, _default_api_types.rangeRt, t.partial({
  urlQuery: t.string,
  percentile: t.string
})]);
const rumClientMetricsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/ux/client-metrics',
  params: t.type({
    query: uxQueryRt
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const setup = await setupUXRequest(resources);
    const {
      query: {
        urlQuery,
        percentile,
        start,
        end
      }
    } = resources.params;
    return (0, _get_client_metrics.getClientMetrics)({
      setup,
      urlQuery,
      percentile: percentile ? Number(percentile) : undefined,
      start,
      end
    });
  }
});
const rumPageLoadDistributionRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/ux/page-load-distribution',
  params: t.type({
    query: t.intersection([uxQueryRt, percentileRangeRt])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const setup = await setupUXRequest(resources);
    const {
      query: {
        minPercentile,
        maxPercentile,
        urlQuery,
        start,
        end
      }
    } = resources.params;
    const pageLoadDistribution = await (0, _get_page_load_distribution.getPageLoadDistribution)({
      setup,
      minPercentile,
      maxPercentile,
      urlQuery,
      start,
      end
    });
    return {
      pageLoadDistribution
    };
  }
});
const rumPageLoadDistBreakdownRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/ux/page-load-distribution/breakdown',
  params: t.type({
    query: t.intersection([uxQueryRt, percentileRangeRt, t.type({
      breakdown: t.string
    })])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const setup = await setupUXRequest(resources);
    const {
      query: {
        minPercentile,
        maxPercentile,
        breakdown,
        urlQuery,
        start,
        end
      }
    } = resources.params;
    const pageLoadDistBreakdown = await (0, _get_pl_dist_breakdown.getPageLoadDistBreakdown)({
      setup,
      minPercentile: Number(minPercentile),
      maxPercentile: Number(maxPercentile),
      breakdown,
      urlQuery,
      start,
      end
    });
    return {
      pageLoadDistBreakdown
    };
  }
});
const rumPageViewsTrendRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/ux/page-view-trends',
  params: t.type({
    query: t.intersection([uxQueryRt, t.partial({
      breakdowns: t.string
    })])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const setup = await setupUXRequest(resources);
    const {
      query: {
        breakdowns,
        urlQuery,
        start,
        end
      }
    } = resources.params;
    return (0, _get_page_view_trends.getPageViewTrends)({
      setup,
      breakdowns,
      urlQuery,
      start,
      end
    });
  }
});
const rumServicesRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/ux/services',
  params: t.type({
    query: t.intersection([uiFiltersRt, _default_api_types.rangeRt])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const setup = await setupUXRequest(resources);
    const {
      query: {
        start,
        end
      }
    } = resources.params;
    const rumServices = await (0, _get_rum_services.getRumServices)({
      setup,
      start,
      end
    });
    return {
      rumServices
    };
  }
});
const rumVisitorsBreakdownRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/ux/visitor-breakdown',
  params: t.type({
    query: uxQueryRt
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const setup = await setupUXRequest(resources);
    const {
      query: {
        urlQuery,
        start,
        end
      }
    } = resources.params;
    return (0, _get_visitor_breakdown.getVisitorBreakdown)({
      setup,
      urlQuery,
      start,
      end
    });
  }
});
const rumWebCoreVitals = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/ux/web-core-vitals',
  params: t.type({
    query: uxQueryRt
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const setup = await setupUXRequest(resources);
    const {
      query: {
        urlQuery,
        percentile,
        start,
        end
      }
    } = resources.params;
    return (0, _get_web_core_vitals.getWebCoreVitals)({
      setup,
      urlQuery,
      percentile: percentile ? Number(percentile) : undefined,
      start,
      end
    });
  }
});
const rumLongTaskMetrics = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/ux/long-task-metrics',
  params: t.type({
    query: uxQueryRt
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const setup = await setupUXRequest(resources);
    const {
      query: {
        urlQuery,
        percentile,
        start,
        end
      }
    } = resources.params;
    return (0, _get_long_task_metrics.getLongTaskMetrics)({
      setup,
      urlQuery,
      percentile: percentile ? Number(percentile) : undefined,
      start,
      end
    });
  }
});
const rumUrlSearch = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/ux/url-search',
  params: t.type({
    query: uxQueryRt
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const setup = await setupUXRequest(resources);
    const {
      query: {
        urlQuery,
        percentile,
        start,
        end
      }
    } = resources.params;
    return (0, _get_url_search.getUrlSearch)({
      setup,
      urlQuery,
      percentile: Number(percentile),
      start,
      end
    });
  }
});
const rumJSErrors = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/ux/js-errors',
  params: t.type({
    query: t.intersection([uiFiltersRt, _default_api_types.rangeRt, t.type({
      pageSize: t.string,
      pageIndex: t.string
    }), t.partial({
      urlQuery: t.string
    })])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const setup = await setupUXRequest(resources);
    const {
      query: {
        pageSize,
        pageIndex,
        urlQuery,
        start,
        end
      }
    } = resources.params;
    return (0, _get_js_errors.getJSErrors)({
      setup,
      urlQuery,
      pageSize: Number(pageSize),
      pageIndex: Number(pageIndex),
      start,
      end
    });
  }
});
const rumHasDataRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /api/apm/observability_overview/has_rum_data',
  params: t.partial({
    query: t.partial({
      uiFilters: t.string,
      start: _ioTsUtils.isoToEpochRt,
      end: _ioTsUtils.isoToEpochRt
    })
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const setup = await setupUXRequest(resources);
    const {
      query: {
        start,
        end
      }
    } = resources.params;
    return await (0, _has_rum_data.hasRumData)({
      setup,
      start,
      end
    });
  }
});

function decodeUiFilters(logger, uiFiltersEncoded) {
  if (!uiFiltersEncoded) {
    return {};
  }

  try {
    return JSON.parse(uiFiltersEncoded);
  } catch (error) {
    logger.error(error);
    return {};
  }
} // eslint-disable-next-line @typescript-eslint/explicit-function-return-type


async function setupUXRequest(resources) {
  const setup = await (0, _setup_request.setupRequest)(resources);
  return { ...setup,
    uiFilters: decodeUiFilters(resources.logger, resources.params.query.uiFilters)
  };
}

const rumRouteRepository = { ...rumClientMetricsRoute,
  ...rumPageLoadDistributionRoute,
  ...rumPageLoadDistBreakdownRoute,
  ...rumPageViewsTrendRoute,
  ...rumServicesRoute,
  ...rumVisitorsBreakdownRoute,
  ...rumWebCoreVitals,
  ...rumLongTaskMetrics,
  ...rumUrlSearch,
  ...rumJSErrors,
  ...rumHasDataRoute
};
exports.rumRouteRepository = rumRouteRepository;