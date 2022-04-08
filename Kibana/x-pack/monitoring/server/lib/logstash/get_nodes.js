"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNodes = getNodes;

var _moment = _interopRequireDefault(require("moment"));

var _create_query = require("../create_query");

var _calculate_availability = require("../calculate_availability");

var _metrics = require("../metrics");

var _get_index_patterns = require("../cluster/get_index_patterns");

var _static_globals = require("../../static_globals");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * Get detailed info for Logstash's in the cluster
 * for Logstash nodes listing page
 * For each instance:
 *  - name
 *  - status
 *  - JVM memory
 *  - os load average
 *  - events
 *  - config reloads
 */


async function getNodes(req, {
  clusterUuid
}) {
  var _response$hits;

  const dataset = 'node_stats';
  const type = 'logstash_stats';
  const moduleType = 'logstash';
  const indexPatterns = (0, _get_index_patterns.getNewIndexPatterns)({
    config: _static_globals.Globals.app.config,
    ccs: req.payload.ccs,
    moduleType,
    dataset
  });
  const config = req.server.config;

  const start = _moment.default.utc(req.payload.timeRange.min).valueOf();

  const end = _moment.default.utc(req.payload.timeRange.max).valueOf();

  const filters = [{
    exists: {
      field: 'logstash_stats.logstash.uuid'
    }
  }];
  const params = {
    index: indexPatterns,
    size: config.ui.max_bucket_size,
    ignore_unavailable: true,
    body: {
      query: (0, _create_query.createQuery)({
        type,
        dsDataset: `${moduleType}.${dataset}`,
        metricset: dataset,
        filters,
        start,
        end,
        clusterUuid,
        metric: _metrics.LogstashMetric.getMetricFields()
      }),
      collapse: {
        field: 'logstash_stats.logstash.uuid'
      },
      sort: [{
        timestamp: {
          order: 'desc',
          unmapped_type: 'long'
        }
      }],
      _source: ['timestamp', '@timestamp', 'logstash_stats.process.cpu.percent', 'logstash.node.stats.process.cpu.percent', 'logstash_stats.jvm.mem.heap_used_percent', 'logstash.node.stats.jvm.mem.heap_used_percent', 'logstash_stats.os.cpu.load_average.1m', 'logstash.node.stats.os.cpu.load_average.1m', 'logstash_stats.events.out', 'logstash.node.stats.events.out', 'logstash_stats.logstash.http_address', 'logstash.node.stats.logstash.http_address', 'logstash_stats.logstash.name', 'logstash.node.stats.logstash.name', 'logstash_stats.logstash.host', 'logstash.node.stats.logstash.host', 'logstash_stats.logstash.uuid', 'logstash.node.stats.logstash.uuid', 'logstash_stats.logstash.status', 'logstash.node.stats.logstash.status', 'logstash_stats.logstash.pipeline', 'logstash.node.stats.logstash.pipeline', 'logstash_stats.reloads', 'logstash.node.stats.reloads', 'logstash_stats.logstash.version', 'logstash.node.stats.logstash.version']
    }
  };
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  const response = await callWithRequest(req, 'search', params);
  return (_response$hits = response.hits) === null || _response$hits === void 0 ? void 0 : _response$hits.hits.map(hit => {
    var _hit$_source$logstash, _hit$_source$logstash2, _mbStats$logstash, _mbStats$jvm$mem$heap, _mbStats$jvm, _mbStats$jvm$mem, _legacyStats$jvm, _legacyStats$jvm$mem, _mbStats$process$cpu$, _mbStats$process, _mbStats$process$cpu, _legacyStats$process, _legacyStats$process$, _mbStats$os$cpu$load_, _mbStats$os, _mbStats$os$cpu, _mbStats$os$cpu$load_2, _legacyStats$os, _legacyStats$os$cpu, _legacyStats$os$cpu$l, _mbStats$events$out, _mbStats$events, _legacyStats$events, _mbStats$reloads$fail, _mbStats$reloads, _legacyStats$reloads, _mbStats$reloads$succ, _mbStats$reloads2, _legacyStats$reloads2, _hit$_source$Timesta;

    const legacyStats = hit._source.logstash_stats;
    const mbStats = (_hit$_source$logstash = hit._source.logstash) === null || _hit$_source$logstash === void 0 ? void 0 : (_hit$_source$logstash2 = _hit$_source$logstash.node) === null || _hit$_source$logstash2 === void 0 ? void 0 : _hit$_source$logstash2.stats;
    const logstash = {
      logstash: (_mbStats$logstash = mbStats === null || mbStats === void 0 ? void 0 : mbStats.logstash) !== null && _mbStats$logstash !== void 0 ? _mbStats$logstash : legacyStats === null || legacyStats === void 0 ? void 0 : legacyStats.logstash,
      jvm: {
        mem: {
          heap_used_percent: (_mbStats$jvm$mem$heap = mbStats === null || mbStats === void 0 ? void 0 : (_mbStats$jvm = mbStats.jvm) === null || _mbStats$jvm === void 0 ? void 0 : (_mbStats$jvm$mem = _mbStats$jvm.mem) === null || _mbStats$jvm$mem === void 0 ? void 0 : _mbStats$jvm$mem.heap_used_percent) !== null && _mbStats$jvm$mem$heap !== void 0 ? _mbStats$jvm$mem$heap : legacyStats === null || legacyStats === void 0 ? void 0 : (_legacyStats$jvm = legacyStats.jvm) === null || _legacyStats$jvm === void 0 ? void 0 : (_legacyStats$jvm$mem = _legacyStats$jvm.mem) === null || _legacyStats$jvm$mem === void 0 ? void 0 : _legacyStats$jvm$mem.heap_used_percent
        }
      },
      process: {
        cpu: {
          percent: (_mbStats$process$cpu$ = mbStats === null || mbStats === void 0 ? void 0 : (_mbStats$process = mbStats.process) === null || _mbStats$process === void 0 ? void 0 : (_mbStats$process$cpu = _mbStats$process.cpu) === null || _mbStats$process$cpu === void 0 ? void 0 : _mbStats$process$cpu.percent) !== null && _mbStats$process$cpu$ !== void 0 ? _mbStats$process$cpu$ : legacyStats === null || legacyStats === void 0 ? void 0 : (_legacyStats$process = legacyStats.process) === null || _legacyStats$process === void 0 ? void 0 : (_legacyStats$process$ = _legacyStats$process.cpu) === null || _legacyStats$process$ === void 0 ? void 0 : _legacyStats$process$.percent
        }
      },
      os: {
        cpu: {
          load_average: {
            '1m': (_mbStats$os$cpu$load_ = mbStats === null || mbStats === void 0 ? void 0 : (_mbStats$os = mbStats.os) === null || _mbStats$os === void 0 ? void 0 : (_mbStats$os$cpu = _mbStats$os.cpu) === null || _mbStats$os$cpu === void 0 ? void 0 : (_mbStats$os$cpu$load_2 = _mbStats$os$cpu.load_average) === null || _mbStats$os$cpu$load_2 === void 0 ? void 0 : _mbStats$os$cpu$load_2['1m']) !== null && _mbStats$os$cpu$load_ !== void 0 ? _mbStats$os$cpu$load_ : legacyStats === null || legacyStats === void 0 ? void 0 : (_legacyStats$os = legacyStats.os) === null || _legacyStats$os === void 0 ? void 0 : (_legacyStats$os$cpu = _legacyStats$os.cpu) === null || _legacyStats$os$cpu === void 0 ? void 0 : (_legacyStats$os$cpu$l = _legacyStats$os$cpu.load_average) === null || _legacyStats$os$cpu$l === void 0 ? void 0 : _legacyStats$os$cpu$l['1m']
          }
        }
      },
      events: {
        out: (_mbStats$events$out = mbStats === null || mbStats === void 0 ? void 0 : (_mbStats$events = mbStats.events) === null || _mbStats$events === void 0 ? void 0 : _mbStats$events.out) !== null && _mbStats$events$out !== void 0 ? _mbStats$events$out : legacyStats === null || legacyStats === void 0 ? void 0 : (_legacyStats$events = legacyStats.events) === null || _legacyStats$events === void 0 ? void 0 : _legacyStats$events.out
      },
      reloads: {
        failures: (_mbStats$reloads$fail = mbStats === null || mbStats === void 0 ? void 0 : (_mbStats$reloads = mbStats.reloads) === null || _mbStats$reloads === void 0 ? void 0 : _mbStats$reloads.failures) !== null && _mbStats$reloads$fail !== void 0 ? _mbStats$reloads$fail : legacyStats === null || legacyStats === void 0 ? void 0 : (_legacyStats$reloads = legacyStats.reloads) === null || _legacyStats$reloads === void 0 ? void 0 : _legacyStats$reloads.failures,
        successes: (_mbStats$reloads$succ = mbStats === null || mbStats === void 0 ? void 0 : (_mbStats$reloads2 = mbStats.reloads) === null || _mbStats$reloads2 === void 0 ? void 0 : _mbStats$reloads2.successes) !== null && _mbStats$reloads$succ !== void 0 ? _mbStats$reloads$succ : legacyStats === null || legacyStats === void 0 ? void 0 : (_legacyStats$reloads2 = legacyStats.reloads) === null || _legacyStats$reloads2 === void 0 ? void 0 : _legacyStats$reloads2.successes
      },
      availability: (0, _calculate_availability.calculateAvailability)((_hit$_source$Timesta = hit._source['@timestamp']) !== null && _hit$_source$Timesta !== void 0 ? _hit$_source$Timesta : hit._source.timestamp)
    };
    return logstash;
  });
}