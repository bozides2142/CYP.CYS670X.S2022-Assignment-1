"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getKibanaInfo = getKibanaInfo;
exports.handleResponse = handleResponse;

var _lodash = require("lodash");

var _error_missing_required = require("../error_missing_required");

var _calculate_availability = require("../calculate_availability");

var _get_index_patterns = require("../cluster/get_index_patterns");

var _static_globals = require("../../static_globals");

var _build_kibana_info = require("./build_kibana_info");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore
// @ts-ignore


function handleResponse(resp) {
  var _resp$hits, _hit$_source$kibana, _hit$_source$Timesta, _mbSource$os$memory$f, _mbSource$os, _mbSource$os$memory, _legacySource$os, _legacySource$os$memo, _mbSource$process$upt, _mbSource$process, _mbSource$process$upt2, _legacySource$process;

  const hit = (_resp$hits = resp.hits) === null || _resp$hits === void 0 ? void 0 : _resp$hits.hits[0];
  const legacySource = hit === null || hit === void 0 ? void 0 : hit._source.kibana_stats;
  const mbSource = hit === null || hit === void 0 ? void 0 : (_hit$_source$kibana = hit._source.kibana) === null || _hit$_source$kibana === void 0 ? void 0 : _hit$_source$kibana.stats;
  const availabilityTimestamp = (_hit$_source$Timesta = hit === null || hit === void 0 ? void 0 : hit._source['@timestamp']) !== null && _hit$_source$Timesta !== void 0 ? _hit$_source$Timesta : legacySource === null || legacySource === void 0 ? void 0 : legacySource.timestamp;

  if (!availabilityTimestamp) {
    throw new _error_missing_required.MissingRequiredError('timestamp');
  }

  return (0, _lodash.merge)((0, _build_kibana_info.buildKibanaInfo)(hit), {
    availability: (0, _calculate_availability.calculateAvailability)(availabilityTimestamp),
    os_memory_free: (_mbSource$os$memory$f = mbSource === null || mbSource === void 0 ? void 0 : (_mbSource$os = mbSource.os) === null || _mbSource$os === void 0 ? void 0 : (_mbSource$os$memory = _mbSource$os.memory) === null || _mbSource$os$memory === void 0 ? void 0 : _mbSource$os$memory.free_in_bytes) !== null && _mbSource$os$memory$f !== void 0 ? _mbSource$os$memory$f : legacySource === null || legacySource === void 0 ? void 0 : (_legacySource$os = legacySource.os) === null || _legacySource$os === void 0 ? void 0 : (_legacySource$os$memo = _legacySource$os.memory) === null || _legacySource$os$memo === void 0 ? void 0 : _legacySource$os$memo.free_in_bytes,
    uptime: (_mbSource$process$upt = mbSource === null || mbSource === void 0 ? void 0 : (_mbSource$process = mbSource.process) === null || _mbSource$process === void 0 ? void 0 : (_mbSource$process$upt2 = _mbSource$process.uptime) === null || _mbSource$process$upt2 === void 0 ? void 0 : _mbSource$process$upt2.ms) !== null && _mbSource$process$upt !== void 0 ? _mbSource$process$upt : legacySource === null || legacySource === void 0 ? void 0 : (_legacySource$process = legacySource.process) === null || _legacySource$process === void 0 ? void 0 : _legacySource$process.uptime_in_millis
  });
}

function getKibanaInfo(req, {
  clusterUuid,
  kibanaUuid
}) {
  const moduleType = 'kibana';
  const indexPatterns = (0, _get_index_patterns.getNewIndexPatterns)({
    config: _static_globals.Globals.app.config,
    ccs: req.payload.ccs,
    moduleType
  });
  const params = {
    index: indexPatterns,
    size: 1,
    ignore_unavailable: true,
    filter_path: ['hits.hits._source.kibana_stats.kibana', 'hits.hits._source.kibana.stats', 'hits.hits._source.kibana_stats.os.memory.free_in_bytes', 'hits.hits._source.kibana.stats.os.memory.free_in_bytes', 'hits.hits._source.kibana_stats.process.uptime_in_millis', 'hits.hits._source.kibana.stats.process.uptime.ms', 'hits.hits._source.kibana_stats.timestamp', 'hits.hits._source.@timestamp', 'hits.hits._source.service.id', 'hits.hits._source.service.version'],
    body: {
      query: {
        bool: {
          filter: [{
            term: {
              cluster_uuid: clusterUuid
            }
          }, {
            term: {
              'kibana_stats.kibana.uuid': kibanaUuid
            }
          }]
        }
      },
      collapse: {
        field: 'kibana_stats.kibana.uuid'
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