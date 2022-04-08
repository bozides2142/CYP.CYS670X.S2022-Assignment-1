"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGlobalApmServerRouteRepository = void 0;

var _route = require("../correlations/route");

var _route2 = require("../alerts/route");

var _route3 = require("../backends/route");

var _route4 = require("../environments/route");

var _route5 = require("../errors/route");

var _route6 = require("../fleet/route");

var _route7 = require("../data_view/route");

var _route8 = require("../latency_distribution/route");

var _route9 = require("../metrics/route");

var _route10 = require("../observability_overview/route");

var _route11 = require("../rum_client/route");

var _route12 = require("../fallback_to_transactions/route");

var _route13 = require("../services/route");

var _route14 = require("../service_map/route");

var _route15 = require("../service_nodes/route");

var _route16 = require("../settings/agent_configuration/route");

var _route17 = require("../settings/anomaly_detection/route");

var _route18 = require("../settings/apm_indices/route");

var _route19 = require("../settings/custom_link/route");

var _route20 = require("../source_maps/route");

var _route21 = require("../traces/route");

var _route22 = require("../transactions/route");

var _route23 = require("../historical_data/route");

var _route24 = require("../event_metadata/route");

var _route25 = require("../suggestions/route");

var _route26 = require("../agent_keys/route");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getTypedGlobalApmServerRouteRepository = () => {
  const repository = { ..._route7.dataViewRouteRepository,
    ..._route4.environmentsRouteRepository,
    ..._route5.errorsRouteRepository,
    ..._route8.latencyDistributionRouteRepository,
    ..._route9.metricsRouteRepository,
    ..._route10.observabilityOverviewRouteRepository,
    ..._route11.rumRouteRepository,
    ..._route14.serviceMapRouteRepository,
    ..._route15.serviceNodeRouteRepository,
    ..._route13.serviceRouteRepository,
    ..._route25.suggestionsRouteRepository,
    ..._route21.traceRouteRepository,
    ..._route22.transactionRouteRepository,
    ..._route2.alertsChartPreviewRouteRepository,
    ..._route16.agentConfigurationRouteRepository,
    ..._route17.anomalyDetectionRouteRepository,
    ..._route18.apmIndicesRouteRepository,
    ..._route19.customLinkRouteRepository,
    ..._route20.sourceMapsRouteRepository,
    ..._route6.apmFleetRouteRepository,
    ..._route3.backendsRouteRepository,
    ..._route.correlationsRouteRepository,
    ..._route12.fallbackToTransactionsRouteRepository,
    ..._route23.historicalDataRouteRepository,
    ..._route24.eventMetadataRouteRepository,
    ..._route26.agentKeysRouteRepository
  };
  return repository;
};

const getGlobalApmServerRouteRepository = () => {
  return getTypedGlobalApmServerRouteRepository();
};

exports.getGlobalApmServerRouteRepository = getGlobalApmServerRouteRepository;

function assertType() {} // if any endpoint has an array-like return type, the assertion below will fail


assertType();