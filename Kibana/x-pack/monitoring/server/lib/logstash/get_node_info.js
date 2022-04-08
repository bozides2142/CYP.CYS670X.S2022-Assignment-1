"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNodeInfo = getNodeInfo;
exports.handleResponse = handleResponse;

var _lodash = require("lodash");

var _error_missing_required = require("../error_missing_required");

var _calculate_availability = require("../calculate_availability");

var _constants = require("../../../common/constants");

var _standalone_cluster_query_filter = require("../standalone_clusters/standalone_cluster_query_filter");

var _get_index_patterns = require("../cluster/get_index_patterns");

var _static_globals = require("../../static_globals");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function handleResponse(resp) {
  var _resp$hits, _resp$hits$hits$, _resp$hits$hits$$_sou, _resp$hits2, _resp$hits2$hits$, _resp$hits2$hits$$_so, _resp$hits2$hits$$_so2, _resp$hits2$hits$$_so3, _mbStats$logstash, _mbStats$timestamp, _mbStats$events, _mbStats$reloads, _mbStats$queue$type, _mbStats$queue, _legacyStats$queue, _mbStats$jvm$uptime_i, _mbStats$jvm, _legacyStats$jvm;

  const legacyStats = (_resp$hits = resp.hits) === null || _resp$hits === void 0 ? void 0 : (_resp$hits$hits$ = _resp$hits.hits[0]) === null || _resp$hits$hits$ === void 0 ? void 0 : (_resp$hits$hits$$_sou = _resp$hits$hits$._source) === null || _resp$hits$hits$$_sou === void 0 ? void 0 : _resp$hits$hits$$_sou.logstash_stats;
  const mbStats = (_resp$hits2 = resp.hits) === null || _resp$hits2 === void 0 ? void 0 : (_resp$hits2$hits$ = _resp$hits2.hits[0]) === null || _resp$hits2$hits$ === void 0 ? void 0 : (_resp$hits2$hits$$_so = _resp$hits2$hits$._source) === null || _resp$hits2$hits$$_so === void 0 ? void 0 : (_resp$hits2$hits$$_so2 = _resp$hits2$hits$$_so.logstash) === null || _resp$hits2$hits$$_so2 === void 0 ? void 0 : (_resp$hits2$hits$$_so3 = _resp$hits2$hits$$_so2.node) === null || _resp$hits2$hits$$_so3 === void 0 ? void 0 : _resp$hits2$hits$$_so3.stats;
  const logstash = (_mbStats$logstash = mbStats === null || mbStats === void 0 ? void 0 : mbStats.logstash) !== null && _mbStats$logstash !== void 0 ? _mbStats$logstash : legacyStats === null || legacyStats === void 0 ? void 0 : legacyStats.logstash;
  const availabilityTimestamp = (_mbStats$timestamp = mbStats === null || mbStats === void 0 ? void 0 : mbStats.timestamp) !== null && _mbStats$timestamp !== void 0 ? _mbStats$timestamp : legacyStats === null || legacyStats === void 0 ? void 0 : legacyStats.timestamp;

  if (!availabilityTimestamp) {
    throw new _error_missing_required.MissingRequiredError('timestamp');
  }

  const info = (0, _lodash.merge)(logstash, {
    availability: (0, _calculate_availability.calculateAvailability)(availabilityTimestamp),
    events: (_mbStats$events = mbStats === null || mbStats === void 0 ? void 0 : mbStats.events) !== null && _mbStats$events !== void 0 ? _mbStats$events : legacyStats === null || legacyStats === void 0 ? void 0 : legacyStats.events,
    reloads: (_mbStats$reloads = mbStats === null || mbStats === void 0 ? void 0 : mbStats.reloads) !== null && _mbStats$reloads !== void 0 ? _mbStats$reloads : legacyStats === null || legacyStats === void 0 ? void 0 : legacyStats.reloads,
    queue_type: (_mbStats$queue$type = mbStats === null || mbStats === void 0 ? void 0 : (_mbStats$queue = mbStats.queue) === null || _mbStats$queue === void 0 ? void 0 : _mbStats$queue.type) !== null && _mbStats$queue$type !== void 0 ? _mbStats$queue$type : legacyStats === null || legacyStats === void 0 ? void 0 : (_legacyStats$queue = legacyStats.queue) === null || _legacyStats$queue === void 0 ? void 0 : _legacyStats$queue.type,
    uptime: (_mbStats$jvm$uptime_i = mbStats === null || mbStats === void 0 ? void 0 : (_mbStats$jvm = mbStats.jvm) === null || _mbStats$jvm === void 0 ? void 0 : _mbStats$jvm.uptime_in_millis) !== null && _mbStats$jvm$uptime_i !== void 0 ? _mbStats$jvm$uptime_i : legacyStats === null || legacyStats === void 0 ? void 0 : (_legacyStats$jvm = legacyStats.jvm) === null || _legacyStats$jvm === void 0 ? void 0 : _legacyStats$jvm.uptime_in_millis
  });
  return info;
}

function getNodeInfo(req, {
  clusterUuid,
  logstashUuid
}) {
  const isStandaloneCluster = clusterUuid === _constants.STANDALONE_CLUSTER_CLUSTER_UUID;
  const clusterFilter = isStandaloneCluster ? _standalone_cluster_query_filter.standaloneClusterFilter : {
    term: {
      cluster_uuid: clusterUuid
    }
  };
  const dataset = 'node_stats';
  const moduleType = 'logstash';
  const indexPatterns = (0, _get_index_patterns.getNewIndexPatterns)({
    config: _static_globals.Globals.app.config,
    ccs: req.payload.ccs,
    moduleType,
    dataset
  });
  const params = {
    index: indexPatterns,
    size: 1,
    ignore_unavailable: true,
    filter_path: ['hits.hits._source.logstash_stats.events', 'hits.hits._source.logstash.node.stats.events', 'hits.hits._source.logstash_stats.jvm.uptime_in_millis', 'hits.hits._source.logstash.node.stats.jvm.uptime_in_millis', 'hits.hits._source.logstash_stats.logstash', 'hits.hits._source.logstash.node.stats.logstash', 'hits.hits._source.logstash_stats.queue.type', 'hits.hits._source.logstash.node.stats.queue.type', 'hits.hits._source.logstash_stats.reloads', 'hits.hits._source.logstash.node.stats.reloads', 'hits.hits._source.logstash_stats.timestamp', 'hits.hits._source.logstash.node.stats.timestamp'],
    body: {
      query: {
        bool: {
          filter: [clusterFilter, {
            term: {
              'logstash_stats.logstash.uuid': logstashUuid
            }
          }]
        }
      },
      collapse: {
        field: 'logstash_stats.logstash.uuid'
      },
      sort: [{
        timestamp: {
          order: 'desc',
          unmapped_type: 'long'
        }
      }]
    }
  };
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  return callWithRequest(req, 'search', params).then(handleResponse);
}