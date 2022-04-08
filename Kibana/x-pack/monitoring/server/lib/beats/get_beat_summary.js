"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBeatSummary = getBeatSummary;
exports.handleResponse = handleResponse;

var _lodash = require("lodash");

var _error_missing_required = require("../error_missing_required");

var _create_beats_query = require("./create_beats_query");

var _beats_stats = require("./_beats_stats");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore
// @ts-ignore
// @ts-ignore


function handleResponse(response, beatUuid) {
  var _firstHit$inner_hits, _firstHit$inner_hits$, _firstHit$inner_hits$2, _firstHit$inner_hits2, _firstHit$inner_hits3, _firstHit$inner_hits4, _firstHit$_source$bea, _firstHit$_source, _firstHit$_source$bea2, _firstHit$_source$bea3, _firstHit$_source$bea4, _firstHit$_source2, _firstHit$_source2$be, _firstStatsMetrics$li, _firstStatsMetrics, _firstStatsMetrics$li2, _firstStatsMetrics$li3, _firstStatsMetrics$li4, _firstStatsMetrics$li5, _firstStatsMetrics2, _firstStatsMetrics2$l, _firstStatsMetrics2$l2, _firstStatsMetrics2$l3, _firstStatsMetrics$li6, _firstStatsMetrics3, _firstStatsMetrics3$l, _firstStatsMetrics3$l2, _firstStatsMetrics3$l3, _firstStatsMetrics$li7, _firstStatsMetrics4, _firstStatsMetrics4$l, _firstStatsMetrics4$l2, _firstStatsMetrics4$l3, _statsMetrics$libbeat, _statsMetrics$libbeat2, _statsMetrics$libbeat3, _statsMetrics$libbeat4, _statsMetrics$libbeat5, _statsMetrics$libbeat6, _statsMetrics$libbeat7, _statsMetrics$libbeat8, _statsMetrics$libbeat9, _statsMetrics$libbeat10, _statsMetrics$libbeat11, _statsMetrics$libbeat12, _statsMetrics$libbeat13, _statsMetrics$libbeat14, _statsMetrics$libbeat15, _statsMetrics$libbeat16, _ref, _firstHit$_source$bea5, _firstHit$_source$bea6, _firstHit$_source$bea7, _firstHit$_source$bea8, _firstHit$_source$bea9, _firstHit$_source$bea10, _firstHit$_source$bea11, _firstHit$_source$bea12, _firstHit$_source$bea13, _firstHit$_source$bea14, _ref2, _firstHit$_source$bea15, _firstHit$_source$bea16, _firstHit$_source$bea17, _firstHit$_source$bea18, _firstHit$_source$bea19, _firstHit$_source$bea20, _firstHit$_source$bea21, _firstHit$_source$bea22, _firstHit$_source$bea23, _firstHit$_source$bea24, _stats$beat$host, _stats$beat, _stats$beat$version, _stats$beat2, _stats$beat$name, _stats$beat3, _upperFirst, _stats$beat4, _upperFirst2, _statsMetrics$libbeat17, _statsMetrics$libbeat18, _statsMetrics$libbeat19, _statsMetrics$libbeat20, _statsMetrics$libbeat21, _firstHit$_source$bea25, _firstHit$_source$bea26, _firstHit$_source$bea27, _firstHit$_source$bea28, _firstHit$_source$bea29, _firstHit$_source$bea30, _firstHit$_source$bea31, _firstHit$_source$bea32, _firstHit$_source$bea33, _firstHit$_source$bea34, _getDiffCalculation, _getDiffCalculation2, _getDiffCalculation3, _getDiffCalculation4;

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
  const handlesHardLimit = (_ref = (_firstHit$_source$bea5 = (_firstHit$_source$bea6 = firstHit._source.beats_stats) === null || _firstHit$_source$bea6 === void 0 ? void 0 : (_firstHit$_source$bea7 = _firstHit$_source$bea6.metrics) === null || _firstHit$_source$bea7 === void 0 ? void 0 : (_firstHit$_source$bea8 = _firstHit$_source$bea7.beat) === null || _firstHit$_source$bea8 === void 0 ? void 0 : (_firstHit$_source$bea9 = _firstHit$_source$bea8.handles) === null || _firstHit$_source$bea9 === void 0 ? void 0 : (_firstHit$_source$bea10 = _firstHit$_source$bea9.limit) === null || _firstHit$_source$bea10 === void 0 ? void 0 : _firstHit$_source$bea10.hard) !== null && _firstHit$_source$bea5 !== void 0 ? _firstHit$_source$bea5 : (_firstHit$_source$bea11 = firstHit._source.beat) === null || _firstHit$_source$bea11 === void 0 ? void 0 : (_firstHit$_source$bea12 = _firstHit$_source$bea11.stats) === null || _firstHit$_source$bea12 === void 0 ? void 0 : (_firstHit$_source$bea13 = _firstHit$_source$bea12.handles) === null || _firstHit$_source$bea13 === void 0 ? void 0 : (_firstHit$_source$bea14 = _firstHit$_source$bea13.limit) === null || _firstHit$_source$bea14 === void 0 ? void 0 : _firstHit$_source$bea14.hard) !== null && _ref !== void 0 ? _ref : null;
  const handlesSoftLimit = (_ref2 = (_firstHit$_source$bea15 = (_firstHit$_source$bea16 = firstHit._source.beats_stats) === null || _firstHit$_source$bea16 === void 0 ? void 0 : (_firstHit$_source$bea17 = _firstHit$_source$bea16.metrics) === null || _firstHit$_source$bea17 === void 0 ? void 0 : (_firstHit$_source$bea18 = _firstHit$_source$bea17.beat) === null || _firstHit$_source$bea18 === void 0 ? void 0 : (_firstHit$_source$bea19 = _firstHit$_source$bea18.handles) === null || _firstHit$_source$bea19 === void 0 ? void 0 : (_firstHit$_source$bea20 = _firstHit$_source$bea19.limit) === null || _firstHit$_source$bea20 === void 0 ? void 0 : _firstHit$_source$bea20.soft) !== null && _firstHit$_source$bea15 !== void 0 ? _firstHit$_source$bea15 : (_firstHit$_source$bea21 = firstHit._source.beat) === null || _firstHit$_source$bea21 === void 0 ? void 0 : (_firstHit$_source$bea22 = _firstHit$_source$bea21.stats) === null || _firstHit$_source$bea22 === void 0 ? void 0 : (_firstHit$_source$bea23 = _firstHit$_source$bea22.handles) === null || _firstHit$_source$bea23 === void 0 ? void 0 : (_firstHit$_source$bea24 = _firstHit$_source$bea23.limit) === null || _firstHit$_source$bea24 === void 0 ? void 0 : _firstHit$_source$bea24.soft) !== null && _ref2 !== void 0 ? _ref2 : null;
  return {
    uuid: beatUuid,
    transportAddress: (_stats$beat$host = stats === null || stats === void 0 ? void 0 : (_stats$beat = stats.beat) === null || _stats$beat === void 0 ? void 0 : _stats$beat.host) !== null && _stats$beat$host !== void 0 ? _stats$beat$host : null,
    version: (_stats$beat$version = stats === null || stats === void 0 ? void 0 : (_stats$beat2 = stats.beat) === null || _stats$beat2 === void 0 ? void 0 : _stats$beat2.version) !== null && _stats$beat$version !== void 0 ? _stats$beat$version : null,
    name: (_stats$beat$name = stats === null || stats === void 0 ? void 0 : (_stats$beat3 = stats.beat) === null || _stats$beat3 === void 0 ? void 0 : _stats$beat3.name) !== null && _stats$beat$name !== void 0 ? _stats$beat$name : null,
    type: (_upperFirst = (0, _lodash.upperFirst)(stats === null || stats === void 0 ? void 0 : (_stats$beat4 = stats.beat) === null || _stats$beat4 === void 0 ? void 0 : _stats$beat4.type)) !== null && _upperFirst !== void 0 ? _upperFirst : null,
    output: (_upperFirst2 = (0, _lodash.upperFirst)(statsMetrics === null || statsMetrics === void 0 ? void 0 : (_statsMetrics$libbeat17 = statsMetrics.libbeat) === null || _statsMetrics$libbeat17 === void 0 ? void 0 : (_statsMetrics$libbeat18 = _statsMetrics$libbeat17.output) === null || _statsMetrics$libbeat18 === void 0 ? void 0 : _statsMetrics$libbeat18.type)) !== null && _upperFirst2 !== void 0 ? _upperFirst2 : null,
    configReloads: (_statsMetrics$libbeat19 = statsMetrics === null || statsMetrics === void 0 ? void 0 : (_statsMetrics$libbeat20 = statsMetrics.libbeat) === null || _statsMetrics$libbeat20 === void 0 ? void 0 : (_statsMetrics$libbeat21 = _statsMetrics$libbeat20.config) === null || _statsMetrics$libbeat21 === void 0 ? void 0 : _statsMetrics$libbeat21.reloads) !== null && _statsMetrics$libbeat19 !== void 0 ? _statsMetrics$libbeat19 : null,
    uptime: (_firstHit$_source$bea25 = (_firstHit$_source$bea26 = firstHit._source.beats_stats) === null || _firstHit$_source$bea26 === void 0 ? void 0 : (_firstHit$_source$bea27 = _firstHit$_source$bea26.metrics) === null || _firstHit$_source$bea27 === void 0 ? void 0 : (_firstHit$_source$bea28 = _firstHit$_source$bea27.beat) === null || _firstHit$_source$bea28 === void 0 ? void 0 : (_firstHit$_source$bea29 = _firstHit$_source$bea28.info) === null || _firstHit$_source$bea29 === void 0 ? void 0 : (_firstHit$_source$bea30 = _firstHit$_source$bea29.uptime) === null || _firstHit$_source$bea30 === void 0 ? void 0 : _firstHit$_source$bea30.ms) !== null && _firstHit$_source$bea25 !== void 0 ? _firstHit$_source$bea25 : (_firstHit$_source$bea31 = firstHit._source.beat) === null || _firstHit$_source$bea31 === void 0 ? void 0 : (_firstHit$_source$bea32 = _firstHit$_source$bea31.stats) === null || _firstHit$_source$bea32 === void 0 ? void 0 : (_firstHit$_source$bea33 = _firstHit$_source$bea32.info) === null || _firstHit$_source$bea33 === void 0 ? void 0 : (_firstHit$_source$bea34 = _firstHit$_source$bea33.uptime) === null || _firstHit$_source$bea34 === void 0 ? void 0 : _firstHit$_source$bea34.ms,
    eventsTotal: (_getDiffCalculation = (0, _beats_stats.getDiffCalculation)(eventsTotalLast, eventsTotalFirst)) !== null && _getDiffCalculation !== void 0 ? _getDiffCalculation : null,
    eventsEmitted: (_getDiffCalculation2 = (0, _beats_stats.getDiffCalculation)(eventsEmittedLast, eventsEmittedFirst)) !== null && _getDiffCalculation2 !== void 0 ? _getDiffCalculation2 : null,
    eventsDropped: (_getDiffCalculation3 = (0, _beats_stats.getDiffCalculation)(eventsDroppedLast, eventsDroppedFirst)) !== null && _getDiffCalculation3 !== void 0 ? _getDiffCalculation3 : null,
    bytesWritten: (_getDiffCalculation4 = (0, _beats_stats.getDiffCalculation)(Number(bytesWrittenLast), Number(bytesWrittenFirst))) !== null && _getDiffCalculation4 !== void 0 ? _getDiffCalculation4 : null,
    handlesHardLimit,
    handlesSoftLimit
  };
}

async function getBeatSummary(req, beatsIndexPattern, {
  clusterUuid,
  beatUuid,
  start,
  end
}) {
  (0, _error_missing_required.checkParam)(beatsIndexPattern, 'beatsIndexPattern in beats/getBeatSummary');
  const filters = [{
    term: {
      'beats_stats.beat.uuid': beatUuid
    }
  }];
  const params = {
    index: beatsIndexPattern,
    size: 1,
    ignore_unavailable: true,
    filter_path: ['hits.hits._source.beats_stats.beat.host', 'hits.hits._source.beat.stats.beat.host', 'hits.hits._source.beats_stats.beat.version', 'hits.hits._source.beat.stats.beat.version', 'hits.hits._source.beats_stats.beat.name', 'hits.hits._source.beat.stats.beat.name', 'hits.hits._source.beats_stats.beat.type', 'hits.hits._source.beat.stats.beat.type', 'hits.hits._source.beats_stats.metrics.libbeat.output.type', 'hits.hits._source.beat.stats.libbeat.output.type', 'hits.hits._source.beats_stats.metrics.libbeat.pipeline.events.published', 'hits.hits._source.beat.stats.libbeat.pipeline.events.published', 'hits.hits._source.beats_stats.metrics.libbeat.pipeline.events.total', 'hits.hits._source.beat.stats.libbeat.pipeline.events.total', 'hits.hits._source.beats_stats.metrics.libbeat.pipeline.events.dropped', 'hits.hits._source.beat.stats.libbeat.pipeline.events.dropped', 'hits.hits._source.beats_stats.metrics.libbeat.output.write.bytes', 'hits.hits._source.beat.stats.libbeat.output.write.bytes', 'hits.hits._source.beats_stats.metrics.libbeat.config.reloads', 'hits.hits._source.beat.stats.libbeat.config.reloads', 'hits.hits._source.beats_stats.metrics.beat.info.uptime.ms', 'hits.hits._source.beat.stats.info.uptime.ms', 'hits.hits._source.beats_stats.metrics.beat.handles.limit.s', 'hits.hits._source.beat.stats.handles.limit.hard', 'hits.hits._source.beats_stats.metrics.beat.handles.limit.soft', 'hits.hits._source.beat.stats.handles.limit.soft', 'hits.hits.inner_hits.first_hit.hits.hits._source.beats_stats.metrics.libbeat.pipeline.events.published', 'hits.hits.inner_hits.first_hit.hits.hits._source.beat.stats.libbeat.pipeline.events.published', 'hits.hits.inner_hits.first_hit.hits.hits._source.beats_stats.metrics.libbeat.pipeline.events.total', 'hits.hits.inner_hits.first_hit.hits.hits._source.beat.stats.libbeat.pipeline.events.total', 'hits.hits.inner_hits.first_hit.hits.hits._source.beats_stats.metrics.libbeat.pipeline.events.dropped', 'hits.hits.inner_hits.first_hit.hits.hits._source.beat.stats.libbeat.pipeline.events.dropped', 'hits.hits.inner_hits.first_hit.hits.hits._source.beats_stats.metrics.libbeat.output.write.bytes', 'hits.hits.inner_hits.first_hit.hits.hits._source.beat.stats.libbeat.output.write.bytes'],
    body: {
      sort: {
        timestamp: {
          order: 'desc',
          unmapped_type: 'long'
        }
      },
      query: (0, _create_beats_query.createBeatsQuery)({
        start,
        end,
        clusterUuid,
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
  const response = await callWithRequest(req, 'search', params);
  return handleResponse(response, beatUuid);
}