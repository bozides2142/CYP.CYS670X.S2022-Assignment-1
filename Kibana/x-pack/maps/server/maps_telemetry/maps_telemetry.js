"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMapsTelemetry = getMapsTelemetry;

var _kibana_server_services = require("../kibana_server_services");

var _server = require("../../../../../src/core/server");

var _map_stats = require("./map_stats");

var _index_pattern_stats = require("./index_pattern_stats");

var _find_maps = require("./find_maps");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getReadOnlyIndexPatternsService() {
  const factory = (0, _kibana_server_services.getIndexPatternsServiceFactory)();
  return factory(new _server.SavedObjectsClient((0, _kibana_server_services.getSavedObjectClient)()), (0, _kibana_server_services.getElasticsearch)().client.asInternalUser);
}

async function getMapsTelemetry() {
  const mapStatsCollector = new _map_stats.MapStatsCollector();
  const indexPatternService = await getReadOnlyIndexPatternsService();
  const indexPatternStatsCollector = new _index_pattern_stats.IndexPatternStatsCollector(indexPatternService);
  await (0, _find_maps.findMaps)((0, _kibana_server_services.getSavedObjectClient)(), async savedObject => {
    mapStatsCollector.push(savedObject.attributes);
    await indexPatternStatsCollector.push(savedObject);
  });
  return { ...(await indexPatternStatsCollector.getStats()),
    ...mapStatsCollector.getStats()
  };
}