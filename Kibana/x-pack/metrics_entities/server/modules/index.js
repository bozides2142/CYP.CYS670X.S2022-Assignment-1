"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.installableTransforms = exports.installableMappings = exports.ModuleNames = void 0;

var _host_metrics = require("./host_metrics");

var _user_metrics = require("./user_metrics");

var _network_metrics = require("./network_metrics");

var _host_entities = require("./host_entities");

var _network_entities = require("./network_entities");

var _user_entities = require("./user_entities");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * These module names will map 1 to 1 to the REST interface.
 */


let ModuleNames;
/**
 * Add any new folders as modules with their names below and grouped with
 * key values.
 */

exports.ModuleNames = ModuleNames;

(function (ModuleNames) {
  ModuleNames["hostSummaryMetrics"] = "host_metrics";
  ModuleNames["hostSummaryEntities"] = "host_entities";
  ModuleNames["networkSummaryEntities"] = "network_entities";
  ModuleNames["networkSummaryMetrics"] = "network_metrics";
  ModuleNames["userSummaryEntities"] = "user_entities";
  ModuleNames["userSummaryMetrics"] = "user_metrics";
})(ModuleNames || (exports.ModuleNames = ModuleNames = {}));

const installableTransforms = {
  [ModuleNames.hostSummaryMetrics]: [_host_metrics.hostMetrics],
  [ModuleNames.hostSummaryEntities]: [_host_entities.hostEntities],
  [ModuleNames.networkSummaryEntities]: [_network_entities.destinationIpEntities, _network_entities.sourceIpEntities, _network_entities.destinationCountryIsoCodeEntities, _network_entities.sourceCountryIsoCodeEntities],
  [ModuleNames.networkSummaryMetrics]: [_network_metrics.ipMetrics],
  [ModuleNames.userSummaryEntities]: [_user_entities.userEntities],
  [ModuleNames.userSummaryMetrics]: [_user_metrics.userMetrics]
};
/**
 * For all the mapping types, add each with their names below and grouped with
 * key values.
 */

exports.installableTransforms = installableTransforms;
const installableMappings = {
  [ModuleNames.hostSummaryMetrics]: [_host_metrics.hostMetricsMapping],
  [ModuleNames.hostSummaryEntities]: [_host_entities.hostEntitiesMapping],
  [ModuleNames.networkSummaryEntities]: [_network_entities.sourceIpEntitiesMapping, _network_entities.destinationIpEntitiesMapping, _network_entities.destinationCountryIsoCodeEntitiesMapping, _network_entities.sourceCountryIsoCodeEntitiesMapping],
  [ModuleNames.networkSummaryMetrics]: [_network_metrics.ipMetricsMapping],
  [ModuleNames.userSummaryEntities]: [_user_entities.userEntitiesMapping],
  [ModuleNames.userSummaryMetrics]: [_user_metrics.userMetricsMapping]
};
exports.installableMappings = installableMappings;