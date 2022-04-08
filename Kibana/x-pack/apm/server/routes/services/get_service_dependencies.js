"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceDependencies = getServiceDependencies;

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _environment_query = require("../../../common/utils/environment_query");

var _get_connection_stats = require("../../lib/connections/get_connection_stats");

var _get_connection_stats_items_with_relative_impact = require("../../lib/connections/get_connection_stats/get_connection_stats_items_with_relative_impact");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getServiceDependencies({
  setup,
  start,
  end,
  serviceName,
  numBuckets,
  environment,
  offset
}) {
  const statsItems = await (0, _get_connection_stats.getConnectionStats)({
    setup,
    start,
    end,
    numBuckets,
    filter: [{
      term: {
        [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
      }
    }, ...(0, _environment_query.environmentQuery)(environment)],
    offset,
    collapseBy: 'downstream'
  });
  return (0, _get_connection_stats_items_with_relative_impact.getConnectionStatsItemsWithRelativeImpact)(statsItems);
}