"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getKibanas = getKibanas;

var _moment = _interopRequireDefault(require("moment"));

var _create_query = require("../create_query");

var _calculate_availability = require("../calculate_availability");

var _metrics = require("../metrics");

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
// @ts-ignore

/*
 * Get detailed info for Kibanas in the cluster
 * for Kibana listing page
 * For each instance:
 *  - name
 *  - status
 *  - memory
 *  - os load average
 *  - requests
 *  - response times
 */


async function getKibanas(req, {
  clusterUuid
}) {
  var _response$hits$hits, _response$hits;

  const config = req.server.config;

  const start = _moment.default.utc(req.payload.timeRange.min).valueOf();

  const end = _moment.default.utc(req.payload.timeRange.max).valueOf();

  const moduleType = 'kibana';
  const type = 'kibana_stats';
  const dataset = 'stats';
  const indexPatterns = (0, _get_index_patterns.getNewIndexPatterns)({
    config: _static_globals.Globals.app.config,
    ccs: req.payload.ccs,
    moduleType,
    dataset
  });
  const params = {
    index: indexPatterns,
    size: config.ui.max_bucket_size,
    ignore_unavailable: true,
    body: {
      query: (0, _create_query.createQuery)({
        type,
        dsDataset: `${moduleType}.${dataset}`,
        metricset: dataset,
        start,
        end,
        clusterUuid,
        metric: _metrics.KibanaMetric.getMetricFields()
      }),
      collapse: {
        field: 'kibana_stats.kibana.uuid'
      },
      sort: [{
        timestamp: {
          order: 'desc',
          unmapped_type: 'long'
        }
      }],
      _source: ['timestamp', '@timestamp', 'kibana_stats.process.memory.resident_set_size_in_bytes', 'kibana.stats.process.memory.resident_set_size.bytes', 'kibana_stats.os.load.1m', 'kibana.stats.os.load.1m', 'kibana_stats.response_times.average', 'kibana.stats.response_time.avg.ms', 'kibana_stats.response_times.max', 'kibana.stats.response_time.max.ms', 'kibana_stats.requests.total', 'kibana.stats.request.total', 'kibana_stats.kibana.transport_address', 'kibana.stats.transport_address', 'kibana_stats.kibana.name', 'kibana.stats.name', 'kibana_stats.kibana.host', 'kibana.stats.host.name', 'kibana_stats.kibana.uuid', 'service.id', 'kibana_stats.kibana.status', 'kibana.stats.status', 'kibana_stats.concurrent_connections', 'kibana.stats.concurrent_connections']
    }
  };
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  const response = await callWithRequest(req, 'search', params);
  const instances = (_response$hits$hits = (_response$hits = response.hits) === null || _response$hits === void 0 ? void 0 : _response$hits.hits) !== null && _response$hits$hits !== void 0 ? _response$hits$hits : [];
  return instances.map(hit => {
    var _hit$_source$kibana, _mbStats$concurrent_c, _mbStats$process$memo, _mbStats$process, _mbStats$process$memo2, _mbStats$process$memo3, _legacyStats$process, _legacyStats$process$, _mbStats$os$load$1m, _mbStats$os, _mbStats$os$load, _legacyStats$os, _legacyStats$os$load, _mbStats$response_tim, _mbStats$response_tim2, _mbStats$response_tim3, _legacyStats$response, _mbStats$response_tim4, _mbStats$response_tim5, _mbStats$response_tim6, _legacyStats$response2, _mbStats$request$tota, _mbStats$request, _legacyStats$requests, _hit$_source$Timesta;

    const legacyStats = hit._source.kibana_stats;
    const mbStats = (_hit$_source$kibana = hit._source.kibana) === null || _hit$_source$kibana === void 0 ? void 0 : _hit$_source$kibana.stats;
    const kibana = {
      kibana: (0, _build_kibana_info.buildKibanaInfo)(hit),
      concurrent_connections: (_mbStats$concurrent_c = mbStats === null || mbStats === void 0 ? void 0 : mbStats.concurrent_connections) !== null && _mbStats$concurrent_c !== void 0 ? _mbStats$concurrent_c : legacyStats === null || legacyStats === void 0 ? void 0 : legacyStats.concurrent_connections,
      process: {
        memory: {
          resident_set_size_in_bytes: (_mbStats$process$memo = mbStats === null || mbStats === void 0 ? void 0 : (_mbStats$process = mbStats.process) === null || _mbStats$process === void 0 ? void 0 : (_mbStats$process$memo2 = _mbStats$process.memory) === null || _mbStats$process$memo2 === void 0 ? void 0 : (_mbStats$process$memo3 = _mbStats$process$memo2.resident_set_size) === null || _mbStats$process$memo3 === void 0 ? void 0 : _mbStats$process$memo3.bytes) !== null && _mbStats$process$memo !== void 0 ? _mbStats$process$memo : legacyStats === null || legacyStats === void 0 ? void 0 : (_legacyStats$process = legacyStats.process) === null || _legacyStats$process === void 0 ? void 0 : (_legacyStats$process$ = _legacyStats$process.memory) === null || _legacyStats$process$ === void 0 ? void 0 : _legacyStats$process$.resident_set_size_in_bytes
        }
      },
      os: {
        load: {
          '1m': (_mbStats$os$load$1m = mbStats === null || mbStats === void 0 ? void 0 : (_mbStats$os = mbStats.os) === null || _mbStats$os === void 0 ? void 0 : (_mbStats$os$load = _mbStats$os.load) === null || _mbStats$os$load === void 0 ? void 0 : _mbStats$os$load['1m']) !== null && _mbStats$os$load$1m !== void 0 ? _mbStats$os$load$1m : legacyStats === null || legacyStats === void 0 ? void 0 : (_legacyStats$os = legacyStats.os) === null || _legacyStats$os === void 0 ? void 0 : (_legacyStats$os$load = _legacyStats$os.load) === null || _legacyStats$os$load === void 0 ? void 0 : _legacyStats$os$load['1m']
        }
      },
      response_times: {
        average: (_mbStats$response_tim = mbStats === null || mbStats === void 0 ? void 0 : (_mbStats$response_tim2 = mbStats.response_time) === null || _mbStats$response_tim2 === void 0 ? void 0 : (_mbStats$response_tim3 = _mbStats$response_tim2.avg) === null || _mbStats$response_tim3 === void 0 ? void 0 : _mbStats$response_tim3.ms) !== null && _mbStats$response_tim !== void 0 ? _mbStats$response_tim : legacyStats === null || legacyStats === void 0 ? void 0 : (_legacyStats$response = legacyStats.response_times) === null || _legacyStats$response === void 0 ? void 0 : _legacyStats$response.average,
        max: (_mbStats$response_tim4 = mbStats === null || mbStats === void 0 ? void 0 : (_mbStats$response_tim5 = mbStats.response_time) === null || _mbStats$response_tim5 === void 0 ? void 0 : (_mbStats$response_tim6 = _mbStats$response_tim5.max) === null || _mbStats$response_tim6 === void 0 ? void 0 : _mbStats$response_tim6.ms) !== null && _mbStats$response_tim4 !== void 0 ? _mbStats$response_tim4 : legacyStats === null || legacyStats === void 0 ? void 0 : (_legacyStats$response2 = legacyStats.response_times) === null || _legacyStats$response2 === void 0 ? void 0 : _legacyStats$response2.max
      },
      requests: {
        total: (_mbStats$request$tota = mbStats === null || mbStats === void 0 ? void 0 : (_mbStats$request = mbStats.request) === null || _mbStats$request === void 0 ? void 0 : _mbStats$request.total) !== null && _mbStats$request$tota !== void 0 ? _mbStats$request$tota : legacyStats === null || legacyStats === void 0 ? void 0 : (_legacyStats$requests = legacyStats.requests) === null || _legacyStats$requests === void 0 ? void 0 : _legacyStats$requests.total
      },
      availability: (0, _calculate_availability.calculateAvailability)((_hit$_source$Timesta = hit._source['@timestamp']) !== null && _hit$_source$Timesta !== void 0 ? _hit$_source$Timesta : hit._source.timestamp)
    };
    return kibana;
  });
}