"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getConnections = getConnections;
exports.getServiceMapFromTraceIds = getServiceMapFromTraceIds;

var _lodash = require("lodash");

var _fetch_service_paths_from_trace_ids = require("./fetch_service_paths_from_trace_ids");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getConnections({
  paths
}) {
  if (!paths) {
    return [];
  }

  const connectionsArr = paths.flatMap(path => {
    return path.reduce((conns, location, index) => {
      const prev = path[index - 1];

      if (prev) {
        return conns.concat({
          source: prev,
          destination: location
        });
      }

      return conns;
    }, []);
  }, []);
  const connections = (0, _lodash.uniqBy)(connectionsArr, value => (0, _lodash.find)(connectionsArr, value));
  return connections;
}

async function getServiceMapFromTraceIds({
  setup,
  traceIds,
  start,
  end
}) {
  var _serviceMapFromTraceI, _serviceMapScriptedAg;

  const serviceMapFromTraceIdsScriptResponse = await (0, _fetch_service_paths_from_trace_ids.fetchServicePathsFromTraceIds)(setup, traceIds, start, end);
  const serviceMapScriptedAggValue = (_serviceMapFromTraceI = serviceMapFromTraceIdsScriptResponse.aggregations) === null || _serviceMapFromTraceI === void 0 ? void 0 : _serviceMapFromTraceI.service_map.value;
  return {
    connections: getConnections({
      paths: serviceMapScriptedAggValue === null || serviceMapScriptedAggValue === void 0 ? void 0 : serviceMapScriptedAggValue.paths
    }),
    discoveredServices: (_serviceMapScriptedAg = serviceMapScriptedAggValue === null || serviceMapScriptedAggValue === void 0 ? void 0 : serviceMapScriptedAggValue.discoveredServices) !== null && _serviceMapScriptedAg !== void 0 ? _serviceMapScriptedAg : []
  };
}