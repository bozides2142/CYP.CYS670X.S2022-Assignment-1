"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getApmInfo = getApmInfo;
exports.handleResponse = handleResponse;

var _lodash = require("lodash");

var _error_missing_required = require("../error_missing_required");

var _create_query = require("../create_query");

var _beats_stats = require("../beats/_beats_stats");

var _metrics = require("../metrics");

var _get_time_of_last_event = require("./_get_time_of_last_event");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore
// @ts-ignore
// @ts-ignore
// @ts-ignore


function handleResponse(response, apmUuid, config) {
  var _firstHit$inner_hits, _firstHit$inner_hits$, _firstHit$inner_hits$2, _firstHit$inner_hits2, _firstHit$inner_hits3, _firstHit$inner_hits4, _firstHit$_source$bea, _firstHit$_source, _firstHit$_source$bea2, _firstHit$_source$bea3, _firstHit$_source$bea4, _firstHit$_source2, _firstHit$_source2$be, _firstStatsMetrics$li, _firstStatsMetrics, _firstStatsMetrics$li2, _firstStatsMetrics$li3, _firstStatsMetrics$li4, _firstStatsMetrics$li5, _firstStatsMetrics2, _firstStatsMetrics2$l, _firstStatsMetrics2$l2, _firstStatsMetrics2$l3, _firstStatsMetrics$li6, _firstStatsMetrics3, _firstStatsMetrics3$l, _firstStatsMetrics3$l2, _firstStatsMetrics3$l3, _firstStatsMetrics$li7, _firstStatsMetrics4, _firstStatsMetrics4$l, _firstStatsMetrics4$l2, _firstStatsMetrics4$l3, _statsMetrics$libbeat, _statsMetrics$libbeat2, _statsMetrics$libbeat3, _statsMetrics$libbeat4, _statsMetrics$libbeat5, _statsMetrics$libbeat6, _statsMetrics$libbeat7, _statsMetrics$libbeat8, _statsMetrics$libbeat9, _statsMetrics$libbeat10, _statsMetrics$libbeat11, _statsMetrics$libbeat12, _statsMetrics$libbeat13, _statsMetrics$libbeat14, _statsMetrics$libbeat15, _statsMetrics$libbeat16, _stats$beat, _stats$beat2, _stats$beat3, _stats$beat4, _upperFirst, _statsMetrics$libbeat17, _statsMetrics$libbeat18, _statsMetrics$libbeat19, _statsMetrics$libbeat20, _statsMetrics$libbeat21, _firstHit$_source$bea5, _firstHit$_source$bea6, _firstHit$_source$bea7, _firstHit$_source$bea8, _firstHit$_source$bea9, _firstHit$_source$bea10, _firstHit$_source$bea11, _firstHit$_source$bea12, _firstHit$_source$bea13, _firstHit$_source$bea14;

  if (!response.hits || response.hits.hits.length === 0) {
    return {};
  }

  const firstHit = response.hits.hits[0];
  let firstStatsMetrics = null;

  if ((_firstHit$inner_hits = firstHit.inner_hits) !== null && _firstHit$inner_hits !== void 0 && (_firstHit$inner_hits$ = _firstHit$inner_hits.first_hit) !== null && _firstHit$inner_hits$ !== void 0 && (_firstHit$inner_hits$2 = _firstHit$inner_hits$.hits) !== null && _firstHit$inner_hits$2 !== void 0 && _firstHit$inner_hits$2.hits && ((_firstHit$inner_hits2 = firstHit.inner_hits) === null || _firstHit$inner_hits2 === void 0 ? void 0 : (_firstHit$inner_hits3 = _firstHit$inner_hits2.first_hit) === null || _firstHit$inner_hits3 === void 0 ? void 0 : (_firstHit$inner_hits4 = _firstHit$inner_hits3.hits) === null || _firstHit$inner_hits4 === void 0 ? void 0 : _firstHit$inner_hits4.hits.length) > 0) {
    var _firstHit$inner_hits$3, _firstHit$inner_hits$4, _firstHit$inner_hits$5;

    firstStatsMetrics = (_firstHit$inner_hits$3 = (_firstHit$inner_hits$4 = firstHit.inner_hits.first_hit.hits.hits[0]._source.beats_stats) === null || _firstHit$inner_hits$4 === void 0 ? void 0 : _firstHit$inner_hits$4.metrics) !== null && _firstHit$inner_hits$3 !== void 0 ? _firstHit$inner_hits$3 : (_firstHit$inner_hits$5 = firstHit.inner_hits.first_hit.hits.hits[0]._source.beat) === null || _firstHit$inner_hits$5 === void 0 ? void 0 : _firstHit$inner_hits$5.stats;
  }

  const stats = (_firstHit$_source$bea = firstHit._source.beats_stats) !== null && _firstHit$_source$bea !== void 0 ? _firstHit$_source$bea : (_firstHit$_source = firstHit._source) === null || _firstHit$_source === void 0 ? void 0 : (_firstHit$_source$bea2 = _firstHit$_source.beat) === null || _firstHit$_source$bea2 === void 0 ? void 0 : _firstHit$_source$bea2.stats;
  const statsMetrics = (_firstHit$_source$bea3 = (_firstHit$_source$bea4 = firstHit._source.beats_stats) === null || _firstHit$_source$bea4 === void 0 ? void 0 : _firstHit$_source$bea4.metrics) !== null && _firstHit$_source$bea3 !== void 0 ? _firstHit$_source$bea3 : (_firstHit$_source2 = firstHit._source) === null || _firstHit$_source2 === void 0 ? void 0 : (_firstHit$_source2$be = _firstHit$_source2.beat) === null || _firstHit$_source2$be === void 0 ? void 0 : _firstHit$_source2$be.stats;
  const eventsTotalFirst = (_firstStatsMetrics$li = (_firstStatsMetrics = firstStatsMetrics) === null || _firstStatsMetrics === void 0 ? void 0 : (_firstStatsMetrics$li2 = _firstStatsMetrics.libbeat) === null || _firstStatsMetrics$li2 === void 0 ? void 0 : (_firstStatsMetrics$li3 = _firstStatsMetrics$li2.pipeline) === null || _firstStatsMetrics$li3 === void 0 ? void 0 : (_firstStatsMetrics$li4 = _firstStatsMetrics$li3.events) === null || _firstStatsMetrics$li4 === void 0 ? void 0 : _firstStatsMetrics$li4.total) !== null && _firstStatsMetrics$li !== void 0 ? _firstStatsMetrics$li : null;
  const eventsEmittedFirst = (_firstStatsMetrics$li5 = (_firstStatsMetrics2 = firstStatsMetrics) === null || _firstStatsMetrics2 === void 0 ? void 0 : (_firstStatsMetrics2$l = _firstStatsMetrics2.libbeat) === null || _firstStatsMetrics2$l === void 0 ? void 0 : (_firstStatsMetrics2$l2 = _firstStatsMetrics2$l.pipeline) === null || _firstStatsMetrics2$l2 === void 0 ? void 0 : (_firstStatsMetrics2$l3 = _firstStatsMetrics2$l2.events) === null || _firstStatsMetrics2$l3 === void 0 ? void 0 : _firstStatsMetrics2$l3.published) !== null && _firstStatsMetrics$li5 !== void 0 ? _firstStatsMetrics$li5 : null;
  const eventsDroppedFirst = (_firstStatsMetrics$li6 = (_firstStatsMetrics3 = firstStatsMetrics) === null || _firstStatsMetrics3 === void 0 ? void 0 : (_firstStatsMetrics3$l = _firstStatsMetrics3.libbeat) === null || _firstStatsMetrics3$l === void 0 ? void 0 : (_firstStatsMetrics3$l2 = _firstStatsMetrics3$l.pipeline) === null || _firstStatsMetrics3$l2 === void 0 ? void 0 : (_firstStatsMetrics3$l3 = _firstStatsMetrics3$l2.events) === null || _firstStatsMetrics3$l3 === void 0 ? void 0 : _firstStatsMetrics3$l3.dropped) !== null && _firstStatsMetrics$li6 !== void 0 ? _firstStatsMetrics$li6 : null;
  const bytesWrittenFirst = (_firstStatsMetrics$li7 = (_firstStatsMetrics4 = firstStatsMetrics) === null || _firstStatsMetrics4 === void 0 ? void 0 : (_firstStatsMetrics4$l = _firstStatsMetrics4.libbeat) === null || _firstStatsMetrics4$l === void 0 ? void 0 : (_firstStatsMetrics4$l2 = _firstStatsMetrics4$l.output) === null || _firstStatsMetrics4$l2 === void 0 ? void 0 : (_firstStatsMetrics4$l3 = _firstStatsMetrics4$l2.write) === null || _firstStatsMetrics4$l3 === void 0 ? void 0 : _firstStatsMetrics4$l3.bytes) !== null && _firstStatsMetrics$li7 !== void 0 ? _firstStatsMetrics$li7 : null;
  const eventsTotalLast = (_statsMetrics$libbeat = statsMetrics === null || statsMetrics === void 0 ? void 0 : (_statsMetrics$libbeat2 = statsMetrics.libbeat) === null || _statsMetrics$libbeat2 === void 0 ? void 0 : (_statsMetrics$libbeat3 = _statsMetrics$libbeat2.pipeline) === null || _statsMetrics$libbeat3 === void 0 ? void 0 : (_statsMetrics$libbeat4 = _statsMetrics$libbeat3.events) === null || _statsMetrics$libbeat4 === void 0 ? void 0 : _statsMetrics$libbeat4.total) !== null && _statsMetrics$libbeat !== void 0 ? _statsMetrics$libbeat : null;
  const eventsEmittedLast = (_statsMetrics$libbeat5 = statsMetrics === null || statsMetrics === void 0 ? void 0 : (_statsMetrics$libbeat6 = statsMetrics.libbeat) === null || _statsMetrics$libbeat6 === void 0 ? void 0 : (_statsMetrics$libbeat7 = _statsMetrics$libbeat6.pipeline) === null || _statsMetrics$libbeat7 === void 0 ? void 0 : (_statsMetrics$libbeat8 = _statsMetrics$libbeat7.events) === null || _statsMetrics$libbeat8 === void 0 ? void 0 : _statsMetrics$libbeat8.published) !== null && _statsMetrics$libbeat5 !== void 0 ? _statsMetrics$libbeat5 : null;
  const eventsDroppedLast = (_statsMetrics$libbeat9 = statsMetrics === null || statsMetrics === void 0 ? void 0 : (_statsMetrics$libbeat10 = statsMetrics.libbeat) === null || _statsMetrics$libbeat10 === void 0 ? void 0 : (_statsMetrics$libbeat11 = _statsMetrics$libbeat10.pipeline) === null || _statsMetrics$libbeat11 === void 0 ? void 0 : (_statsMetrics$libbeat12 = _statsMetrics$libbeat11.events) === null || _statsMetrics$libbeat12 === void 0 ? void 0 : _statsMetrics$libbeat12.dropped) !== null && _statsMetrics$libbeat9 !== void 0 ? _statsMetrics$libbeat9 : null;
  const bytesWrittenLast = (_statsMetrics$libbeat13 = statsMetrics === null || statsMetrics === void 0 ? void 0 : (_statsMetrics$libbeat14 = statsMetrics.libbeat) === null || _statsMetrics$libbeat14 === void 0 ? void 0 : (_statsMetrics$libbeat15 = _statsMetrics$libbeat14.output) === null || _statsMetrics$libbeat15 === void 0 ? void 0 : (_statsMetrics$libbeat16 = _statsMetrics$libbeat15.write) === null || _statsMetrics$libbeat16 === void 0 ? void 0 : _statsMetrics$libbeat16.bytes) !== null && _statsMetrics$libbeat13 !== void 0 ? _statsMetrics$libbeat13 : null;
  return {
    uuid: apmUuid,
    transportAddress: stats === null || stats === void 0 ? void 0 : (_stats$beat = stats.beat) === null || _stats$beat === void 0 ? void 0 : _stats$beat.host,
    version: stats === null || stats === void 0 ? void 0 : (_stats$beat2 = stats.beat) === null || _stats$beat2 === void 0 ? void 0 : _stats$beat2.version,
    name: stats === null || stats === void 0 ? void 0 : (_stats$beat3 = stats.beat) === null || _stats$beat3 === void 0 ? void 0 : _stats$beat3.name,
    type: (0, _lodash.upperFirst)(stats === null || stats === void 0 ? void 0 : (_stats$beat4 = stats.beat) === null || _stats$beat4 === void 0 ? void 0 : _stats$beat4.type) || null,
    output: (_upperFirst = (0, _lodash.upperFirst)(statsMetrics === null || statsMetrics === void 0 ? void 0 : (_statsMetrics$libbeat17 = statsMetrics.libbeat) === null || _statsMetrics$libbeat17 === void 0 ? void 0 : (_statsMetrics$libbeat18 = _statsMetrics$libbeat17.output) === null || _statsMetrics$libbeat18 === void 0 ? void 0 : _statsMetrics$libbeat18.type)) !== null && _upperFirst !== void 0 ? _upperFirst : null,
    configReloads: (_statsMetrics$libbeat19 = statsMetrics === null || statsMetrics === void 0 ? void 0 : (_statsMetrics$libbeat20 = statsMetrics.libbeat) === null || _statsMetrics$libbeat20 === void 0 ? void 0 : (_statsMetrics$libbeat21 = _statsMetrics$libbeat20.config) === null || _statsMetrics$libbeat21 === void 0 ? void 0 : _statsMetrics$libbeat21.reloads) !== null && _statsMetrics$libbeat19 !== void 0 ? _statsMetrics$libbeat19 : null,
    uptime: (_firstHit$_source$bea5 = (_firstHit$_source$bea6 = firstHit._source.beats_stats) === null || _firstHit$_source$bea6 === void 0 ? void 0 : (_firstHit$_source$bea7 = _firstHit$_source$bea6.metrics) === null || _firstHit$_source$bea7 === void 0 ? void 0 : (_firstHit$_source$bea8 = _firstHit$_source$bea7.beat) === null || _firstHit$_source$bea8 === void 0 ? void 0 : (_firstHit$_source$bea9 = _firstHit$_source$bea8.info) === null || _firstHit$_source$bea9 === void 0 ? void 0 : (_firstHit$_source$bea10 = _firstHit$_source$bea9.uptime) === null || _firstHit$_source$bea10 === void 0 ? void 0 : _firstHit$_source$bea10.ms) !== null && _firstHit$_source$bea5 !== void 0 ? _firstHit$_source$bea5 : (_firstHit$_source$bea11 = firstHit._source.beat) === null || _firstHit$_source$bea11 === void 0 ? void 0 : (_firstHit$_source$bea12 = _firstHit$_source$bea11.stats) === null || _firstHit$_source$bea12 === void 0 ? void 0 : (_firstHit$_source$bea13 = _firstHit$_source$bea12.info) === null || _firstHit$_source$bea13 === void 0 ? void 0 : (_firstHit$_source$bea14 = _firstHit$_source$bea13.uptime) === null || _firstHit$_source$bea14 === void 0 ? void 0 : _firstHit$_source$bea14.ms,
    eventsTotal: (0, _beats_stats.getDiffCalculation)(eventsTotalLast, eventsTotalFirst),
    eventsEmitted: (0, _beats_stats.getDiffCalculation)(eventsEmittedLast, eventsEmittedFirst),
    eventsDropped: (0, _beats_stats.getDiffCalculation)(eventsDroppedLast, eventsDroppedFirst),
    bytesWritten: (0, _beats_stats.getDiffCalculation)(Number(bytesWrittenLast), Number(bytesWrittenFirst)),
    config: {
      container: config.ui.container.apm.enabled
    }
  };
}

async function getApmInfo(req, apmIndexPattern, {
  clusterUuid,
  apmUuid,
  start,
  end
}) {
  (0, _error_missing_required.checkParam)(apmIndexPattern, 'apmIndexPattern in beats/getBeatSummary');
  const filters = [{
    term: {
      'beats_stats.beat.uuid': apmUuid
    }
  }, {
    term: {
      'beats_stats.beat.type': 'apm-server'
    }
  }];
  const params = {
    index: apmIndexPattern,
    size: 1,
    ignore_unavailable: true,
    filter_path: ['hits.hits._source.beats_stats.beat.host', 'hits.hits._source.beats_stats.beat.version', 'hits.hits._source.beats_stats.beat.name', 'hits.hits._source.beats_stats.beat.type', 'hits.hits._source.beats_stats.metrics.libbeat.output.type', 'hits.hits._source.beats_stats.metrics.libbeat.pipeline.events.published', 'hits.hits._source.beats_stats.metrics.libbeat.pipeline.events.total', 'hits.hits._source.beats_stats.metrics.libbeat.pipeline.events.dropped', 'hits.hits._source.beats_stats.metrics.libbeat.output.write.bytes', 'hits.hits._source.beats_stats.metrics.libbeat.config.reloads', 'hits.hits._source.beats_stats.metrics.beat.info.uptime.ms', 'hits.hits.inner_hits.first_hit.hits.hits._source.beats_stats.metrics.libbeat.pipeline.events.published', 'hits.hits.inner_hits.first_hit.hits.hits._source.beats_stats.metrics.libbeat.pipeline.events.total', 'hits.hits.inner_hits.first_hit.hits.hits._source.beats_stats.metrics.libbeat.pipeline.events.dropped', 'hits.hits.inner_hits.first_hit.hits.hits._source.beats_stats.metrics.libbeat.output.write.bytes', 'hits.hits._source.beat.stats.beat.host', 'hits.hits._source.beat.stats.beat.version', 'hits.hits._source.beat.stats.beat.name', 'hits.hits._source.beat.stats.beat.type', 'hits.hits._source.beat.stats.libbeat.output.type', 'hits.hits._source.beat.stats.libbeat.pipeline.events.published', 'hits.hits._source.beat.stats.libbeat.pipeline.events.total', 'hits.hits._source.beat.stats.libbeat.pipeline.events.dropped', 'hits.hits._source.beat.stats.libbeat.output.write.bytes', 'hits.hits._source.beat.stats.libbeat.config.reloads', 'hits.hits._source.beat.stats.info.uptime.ms', 'hits.hits.inner_hits.first_hit.hits.hits._source.beat.stats.libbeat.pipeline.events.published', 'hits.hits.inner_hits.first_hit.hits.hits._source.beat.stats.libbeat.pipeline.events.total', 'hits.hits.inner_hits.first_hit.hits.hits._source.beat.stats.libbeat.pipeline.events.dropped', 'hits.hits.inner_hits.first_hit.hits.hits._source.beat.stats.libbeat.output.write.bytes'],
    body: {
      sort: {
        timestamp: {
          order: 'desc',
          unmapped_type: 'long'
        }
      },
      query: (0, _create_query.createQuery)({
        start,
        end,
        clusterUuid,
        metric: _metrics.ApmMetric.getMetricFields(),
        filters
      }),
      collapse: {
        field: 'beats_stats.metrics.beat.info.ephemeral_id',
        // collapse on ephemeral_id to handle restart
        inner_hits: {
          name: 'first_hit',
          size: 1,
          sort: [{
            'beats_stats.timestamp': {
              order: 'asc',
              unmapped_type: 'long'
            }
          }, {
            '@timestamp': {
              order: 'asc',
              unmapped_type: 'long'
            }
          }]
        }
      }
    }
  };
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  const [response, timeOfLastEvent] = await Promise.all([callWithRequest(req, 'search', params), (0, _get_time_of_last_event.getTimeOfLastEvent)({
    req,
    callWithRequest,
    apmIndexPattern,
    start,
    end,
    clusterUuid
  })]);
  const formattedResponse = handleResponse(response, apmUuid, req.server.config);
  return { ...formattedResponse,
    timeOfLastEvent
  };
}