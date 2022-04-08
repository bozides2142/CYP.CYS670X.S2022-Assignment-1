"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceDependenciesBreakdown = getServiceDependenciesBreakdown;

var _lodash = require("lodash");

var _connections = require("../../../common/connections");

var _server = require("../../../../observability/server");

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _environment_query = require("../../../common/utils/environment_query");

var _get_connection_stats = require("../../lib/connections/get_connection_stats");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getServiceDependenciesBreakdown({
  setup,
  start,
  end,
  serviceName,
  environment,
  kuery
}) {
  const items = await (0, _get_connection_stats.getConnectionStats)({
    setup,
    start,
    end,
    numBuckets: 100,
    collapseBy: 'downstream',
    filter: [...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery), {
      term: {
        [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
      }
    }]
  });
  return (0, _lodash.take)((0, _lodash.sortBy)(items, item => {
    var _item$stats$totalTime;

    return (_item$stats$totalTime = item.stats.totalTime) !== null && _item$stats$totalTime !== void 0 ? _item$stats$totalTime : 0;
  }).reverse(), 20).map(item => {
    const {
      stats,
      location
    } = item;
    return {
      title: (0, _connections.getNodeName)(location),
      data: stats.totalTime.timeseries
    };
  });
}