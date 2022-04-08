"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBeats = getBeats;
exports.handleResponse = handleResponse;

var _moment = _interopRequireDefault(require("moment"));

var _lodash = require("lodash");

var _error_missing_required = require("../error_missing_required");

var _create_beats_query = require("./create_beats_query");

var _calculate_rate = require("../calculate_rate");

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
// @ts-ignore


function handleResponse(response, start, end) {
  var _response$hits$hits, _response$hits;

  const hits = (_response$hits$hits = (_response$hits = response.hits) === null || _response$hits === void 0 ? void 0 : _response$hits.hits) !== null && _response$hits$hits !== void 0 ? _response$hits$hits : [];
  const initial = {
    ids: new Set(),
    beats: []
  };
  const {
    beats
  } = hits.reduce((accum, hit) => {
    var _hit$_source$beats_st, _hit$_source$beat, _hit$_source$beats_st2, _hit$_source$beats_st3, _hit$_source$beat2, _stats$beat, _hit$inner_hits, _hit$inner_hits$earli, _hit$inner_hits$earli2, _hit$inner_hits2, _hit$inner_hits2$earl, _hit$inner_hits2$earl2, _stats$timestamp, _earliestStats$timest, _earliestStats, _hit$inner_hits3, _hit$inner_hits3$earl, _statsMetrics$libbeat, _statsMetrics$libbeat2, _statsMetrics$libbeat3, _earliestStatsMetrics, _earliestStatsMetrics2, _earliestStatsMetrics3, _earliestStatsMetrics4, _statsMetrics$libbeat4, _statsMetrics$libbeat5, _statsMetrics$libbeat6, _earliestStatsMetrics5, _earliestStatsMetrics6, _earliestStatsMetrics7, _earliestStatsMetrics8, _statsMetrics$libbeat7, _statsMetrics$libbeat8, _statsMetrics$libbeat9, _statsMetrics$libbeat10, _earliestStatsMetrics9, _earliestStatsMetrics10, _earliestStatsMetrics11, _earliestStatsMetrics12, _earliestStatsMetrics13, _statsMetrics$libbeat11, _statsMetrics$libbeat12, _statsMetrics$libbeat13, _statsMetrics$libbeat14, _earliestStatsMetrics14, _earliestStatsMetrics15, _earliestStatsMetrics16, _earliestStatsMetrics17, _earliestStatsMetrics18, _stats$beat2, _stats$beat3, _stats$beat4, _statsMetrics$libbeat15, _statsMetrics$libbeat16, _hit$_source$beats_st4, _hit$_source$beats_st5, _hit$_source$beats_st6, _hit$_source$beats_st7, _hit$_source$beats_st8, _hit$_source$beat3, _hit$_source$beat3$st, _hit$_source$beat3$st2, _hit$_source$beat3$st3, _stats$beat5;

    const stats = (_hit$_source$beats_st = hit._source.beats_stats) !== null && _hit$_source$beats_st !== void 0 ? _hit$_source$beats_st : (_hit$_source$beat = hit._source.beat) === null || _hit$_source$beat === void 0 ? void 0 : _hit$_source$beat.stats;
    const statsMetrics = (_hit$_source$beats_st2 = (_hit$_source$beats_st3 = hit._source.beats_stats) === null || _hit$_source$beats_st3 === void 0 ? void 0 : _hit$_source$beats_st3.metrics) !== null && _hit$_source$beats_st2 !== void 0 ? _hit$_source$beats_st2 : (_hit$_source$beat2 = hit._source.beat) === null || _hit$_source$beat2 === void 0 ? void 0 : _hit$_source$beat2.stats;
    const uuid = stats === null || stats === void 0 ? void 0 : (_stats$beat = stats.beat) === null || _stats$beat === void 0 ? void 0 : _stats$beat.uuid;

    if (!uuid) {
      return accum;
    } // skip this duplicated beat, newer one was already added


    if (accum.ids.has(uuid)) {
      return accum;
    } // add another beat summary


    accum.ids.add(uuid);
    let earliestStats = null;
    let earliestStatsMetrics = null;

    if ((_hit$inner_hits = hit.inner_hits) !== null && _hit$inner_hits !== void 0 && (_hit$inner_hits$earli = _hit$inner_hits.earliest) !== null && _hit$inner_hits$earli !== void 0 && (_hit$inner_hits$earli2 = _hit$inner_hits$earli.hits) !== null && _hit$inner_hits$earli2 !== void 0 && _hit$inner_hits$earli2.hits && ((_hit$inner_hits2 = hit.inner_hits) === null || _hit$inner_hits2 === void 0 ? void 0 : (_hit$inner_hits2$earl = _hit$inner_hits2.earliest) === null || _hit$inner_hits2$earl === void 0 ? void 0 : (_hit$inner_hits2$earl2 = _hit$inner_hits2$earl.hits) === null || _hit$inner_hits2$earl2 === void 0 ? void 0 : _hit$inner_hits2$earl2.hits.length) > 0) {
      var _hit$inner_hits$earli3, _hit$inner_hits$earli4, _hit$inner_hits$earli5, _hit$inner_hits$earli6, _hit$inner_hits$earli7;

      earliestStats = (_hit$inner_hits$earli3 = hit.inner_hits.earliest.hits.hits[0]._source.beats_stats) !== null && _hit$inner_hits$earli3 !== void 0 ? _hit$inner_hits$earli3 : (_hit$inner_hits$earli4 = hit.inner_hits.earliest.hits.hits[0]._source.beat) === null || _hit$inner_hits$earli4 === void 0 ? void 0 : _hit$inner_hits$earli4.stats;
      earliestStatsMetrics = (_hit$inner_hits$earli5 = (_hit$inner_hits$earli6 = hit.inner_hits.earliest.hits.hits[0]._source.beats_stats) === null || _hit$inner_hits$earli6 === void 0 ? void 0 : _hit$inner_hits$earli6.metrics) !== null && _hit$inner_hits$earli5 !== void 0 ? _hit$inner_hits$earli5 : (_hit$inner_hits$earli7 = hit.inner_hits.earliest.hits.hits[0]._source.beat) === null || _hit$inner_hits$earli7 === void 0 ? void 0 : _hit$inner_hits$earli7.stats;
    } //  add the beat


    const rateOptions = {
      hitTimestamp: (_stats$timestamp = stats === null || stats === void 0 ? void 0 : stats.timestamp) !== null && _stats$timestamp !== void 0 ? _stats$timestamp : hit._source['@timestamp'],
      earliestHitTimestamp: (_earliestStats$timest = (_earliestStats = earliestStats) === null || _earliestStats === void 0 ? void 0 : _earliestStats.timestamp) !== null && _earliestStats$timest !== void 0 ? _earliestStats$timest : (_hit$inner_hits3 = hit.inner_hits) === null || _hit$inner_hits3 === void 0 ? void 0 : (_hit$inner_hits3$earl = _hit$inner_hits3.earliest.hits) === null || _hit$inner_hits3$earl === void 0 ? void 0 : _hit$inner_hits3$earl.hits[0]._source['@timestamp'],
      timeWindowMin: start,
      timeWindowMax: end
    };
    const {
      rate: bytesSentRate
    } = (0, _calculate_rate.calculateRate)({
      latestTotal: statsMetrics === null || statsMetrics === void 0 ? void 0 : (_statsMetrics$libbeat = statsMetrics.libbeat) === null || _statsMetrics$libbeat === void 0 ? void 0 : (_statsMetrics$libbeat2 = _statsMetrics$libbeat.output) === null || _statsMetrics$libbeat2 === void 0 ? void 0 : (_statsMetrics$libbeat3 = _statsMetrics$libbeat2.write) === null || _statsMetrics$libbeat3 === void 0 ? void 0 : _statsMetrics$libbeat3.bytes,
      earliestTotal: (_earliestStatsMetrics = earliestStatsMetrics) === null || _earliestStatsMetrics === void 0 ? void 0 : (_earliestStatsMetrics2 = _earliestStatsMetrics.libbeat) === null || _earliestStatsMetrics2 === void 0 ? void 0 : (_earliestStatsMetrics3 = _earliestStatsMetrics2.output) === null || _earliestStatsMetrics3 === void 0 ? void 0 : (_earliestStatsMetrics4 = _earliestStatsMetrics3.write) === null || _earliestStatsMetrics4 === void 0 ? void 0 : _earliestStatsMetrics4.bytes,
      ...rateOptions
    });
    const {
      rate: totalEventsRate
    } = (0, _calculate_rate.calculateRate)({
      latestTotal: statsMetrics === null || statsMetrics === void 0 ? void 0 : (_statsMetrics$libbeat4 = statsMetrics.libbeat) === null || _statsMetrics$libbeat4 === void 0 ? void 0 : (_statsMetrics$libbeat5 = _statsMetrics$libbeat4.pipeline) === null || _statsMetrics$libbeat5 === void 0 ? void 0 : (_statsMetrics$libbeat6 = _statsMetrics$libbeat5.events) === null || _statsMetrics$libbeat6 === void 0 ? void 0 : _statsMetrics$libbeat6.total,
      earliestTotal: (_earliestStatsMetrics5 = earliestStatsMetrics) === null || _earliestStatsMetrics5 === void 0 ? void 0 : (_earliestStatsMetrics6 = _earliestStatsMetrics5.libbeat) === null || _earliestStatsMetrics6 === void 0 ? void 0 : (_earliestStatsMetrics7 = _earliestStatsMetrics6.pipeline) === null || _earliestStatsMetrics7 === void 0 ? void 0 : (_earliestStatsMetrics8 = _earliestStatsMetrics7.events) === null || _earliestStatsMetrics8 === void 0 ? void 0 : _earliestStatsMetrics8.total,
      ...rateOptions
    });
    const errorsWrittenLatest = (_statsMetrics$libbeat7 = statsMetrics === null || statsMetrics === void 0 ? void 0 : (_statsMetrics$libbeat8 = statsMetrics.libbeat) === null || _statsMetrics$libbeat8 === void 0 ? void 0 : (_statsMetrics$libbeat9 = _statsMetrics$libbeat8.output) === null || _statsMetrics$libbeat9 === void 0 ? void 0 : (_statsMetrics$libbeat10 = _statsMetrics$libbeat9.write) === null || _statsMetrics$libbeat10 === void 0 ? void 0 : _statsMetrics$libbeat10.errors) !== null && _statsMetrics$libbeat7 !== void 0 ? _statsMetrics$libbeat7 : 0;
    const errorsWrittenEarliest = (_earliestStatsMetrics9 = (_earliestStatsMetrics10 = earliestStatsMetrics) === null || _earliestStatsMetrics10 === void 0 ? void 0 : (_earliestStatsMetrics11 = _earliestStatsMetrics10.libbeat) === null || _earliestStatsMetrics11 === void 0 ? void 0 : (_earliestStatsMetrics12 = _earliestStatsMetrics11.output) === null || _earliestStatsMetrics12 === void 0 ? void 0 : (_earliestStatsMetrics13 = _earliestStatsMetrics12.write) === null || _earliestStatsMetrics13 === void 0 ? void 0 : _earliestStatsMetrics13.errors) !== null && _earliestStatsMetrics9 !== void 0 ? _earliestStatsMetrics9 : 0;
    const errorsReadLatest = (_statsMetrics$libbeat11 = statsMetrics === null || statsMetrics === void 0 ? void 0 : (_statsMetrics$libbeat12 = statsMetrics.libbeat) === null || _statsMetrics$libbeat12 === void 0 ? void 0 : (_statsMetrics$libbeat13 = _statsMetrics$libbeat12.output) === null || _statsMetrics$libbeat13 === void 0 ? void 0 : (_statsMetrics$libbeat14 = _statsMetrics$libbeat13.read) === null || _statsMetrics$libbeat14 === void 0 ? void 0 : _statsMetrics$libbeat14.errors) !== null && _statsMetrics$libbeat11 !== void 0 ? _statsMetrics$libbeat11 : 0;
    const errorsReadEarliest = (_earliestStatsMetrics14 = (_earliestStatsMetrics15 = earliestStatsMetrics) === null || _earliestStatsMetrics15 === void 0 ? void 0 : (_earliestStatsMetrics16 = _earliestStatsMetrics15.libbeat) === null || _earliestStatsMetrics16 === void 0 ? void 0 : (_earliestStatsMetrics17 = _earliestStatsMetrics16.output) === null || _earliestStatsMetrics17 === void 0 ? void 0 : (_earliestStatsMetrics18 = _earliestStatsMetrics17.read) === null || _earliestStatsMetrics18 === void 0 ? void 0 : _earliestStatsMetrics18.errors) !== null && _earliestStatsMetrics14 !== void 0 ? _earliestStatsMetrics14 : 0;
    const errors = (0, _beats_stats.getDiffCalculation)(errorsWrittenLatest + errorsReadLatest, errorsWrittenEarliest + errorsReadEarliest);
    accum.beats.push({
      uuid: stats === null || stats === void 0 ? void 0 : (_stats$beat2 = stats.beat) === null || _stats$beat2 === void 0 ? void 0 : _stats$beat2.uuid,
      name: stats === null || stats === void 0 ? void 0 : (_stats$beat3 = stats.beat) === null || _stats$beat3 === void 0 ? void 0 : _stats$beat3.name,
      type: (0, _lodash.upperFirst)(stats === null || stats === void 0 ? void 0 : (_stats$beat4 = stats.beat) === null || _stats$beat4 === void 0 ? void 0 : _stats$beat4.type),
      output: (0, _lodash.upperFirst)(statsMetrics === null || statsMetrics === void 0 ? void 0 : (_statsMetrics$libbeat15 = statsMetrics.libbeat) === null || _statsMetrics$libbeat15 === void 0 ? void 0 : (_statsMetrics$libbeat16 = _statsMetrics$libbeat15.output) === null || _statsMetrics$libbeat16 === void 0 ? void 0 : _statsMetrics$libbeat16.type),
      total_events_rate: totalEventsRate,
      bytes_sent_rate: bytesSentRate,
      errors,
      memory: (_hit$_source$beats_st4 = (_hit$_source$beats_st5 = hit._source.beats_stats) === null || _hit$_source$beats_st5 === void 0 ? void 0 : (_hit$_source$beats_st6 = _hit$_source$beats_st5.metrics) === null || _hit$_source$beats_st6 === void 0 ? void 0 : (_hit$_source$beats_st7 = _hit$_source$beats_st6.beat) === null || _hit$_source$beats_st7 === void 0 ? void 0 : (_hit$_source$beats_st8 = _hit$_source$beats_st7.memstats) === null || _hit$_source$beats_st8 === void 0 ? void 0 : _hit$_source$beats_st8.memory_alloc) !== null && _hit$_source$beats_st4 !== void 0 ? _hit$_source$beats_st4 : (_hit$_source$beat3 = hit._source.beat) === null || _hit$_source$beat3 === void 0 ? void 0 : (_hit$_source$beat3$st = _hit$_source$beat3.stats) === null || _hit$_source$beat3$st === void 0 ? void 0 : (_hit$_source$beat3$st2 = _hit$_source$beat3$st.memstats) === null || _hit$_source$beat3$st2 === void 0 ? void 0 : (_hit$_source$beat3$st3 = _hit$_source$beat3$st2.memory) === null || _hit$_source$beat3$st3 === void 0 ? void 0 : _hit$_source$beat3$st3.alloc,
      version: stats === null || stats === void 0 ? void 0 : (_stats$beat5 = stats.beat) === null || _stats$beat5 === void 0 ? void 0 : _stats$beat5.version
    });
    return accum;
  }, initial);
  return beats;
}

async function getBeats(req, beatsIndexPattern, clusterUuid) {
  (0, _error_missing_required.checkParam)(beatsIndexPattern, 'beatsIndexPattern in getBeats');
  const config = req.server.config;

  const start = _moment.default.utc(req.payload.timeRange.min).valueOf();

  const end = _moment.default.utc(req.payload.timeRange.max).valueOf();

  const params = {
    index: beatsIndexPattern,
    size: config.ui.max_bucket_size,
    ignore_unavailable: true,
    filter_path: [// only filter path can filter for inner_hits
    'hits.hits._source.beats_stats.beat.uuid', 'hits.hits._source.beat.stats.beat.uuid', 'hits.hits._source.beats_stats.beat.name', 'hits.hits._source.beat.stats.beat.name', 'hits.hits._source.beats_stats.beat.host', 'hits.hits._source.beat.stats.beat.host', 'hits.hits._source.beats_stats.beat.type', 'hits.hits._source.beat.stats.beat.type', 'hits.hits._source.beats_stats.beat.version', 'hits.hits._source.beat.stats.beat.version', 'hits.hits._source.beats_stats.metrics.libbeat.output.type', 'hits.hits._source.beat.stats.libbeat.output.type', 'hits.hits._source.beats_stats.metrics.libbeat.output.read.errors', 'hits.hits._source.beat.stats.libbeat.output.read.errors', 'hits.hits._source.beats_stats.metrics.libbeat.output.write.errors', 'hits.hits._source.beat.stats.libbeat.output.write.errors', 'hits.hits._source.beats_stats.metrics.beat.memstats.memory_alloc', 'hits.hits._source.beat.stats.memstats.memory.alloc', // latest hits for calculating metrics
    'hits.hits._source.beats_stats.timestamp', 'hits.hits._source.@timestamp', 'hits.hits._source.beats_stats.metrics.libbeat.output.write.bytes', 'hits.hits._source.beat.stats.libbeat.output.write.bytes', 'hits.hits._source.beats_stats.metrics.libbeat.pipeline.events.total', 'hits.hits._source.beat.stats.libbeat.pipeline.events.total', // earliest hits for calculating metrics
    'hits.hits.inner_hits.earliest.hits.hits._source.beats_stats.timestamp', 'hits.hits.inner_hits.earliest.hits.hits._source.@timestamp', 'hits.hits.inner_hits.earliest.hits.hits._source.beat.stats.libbeat.output.write.bytes', 'hits.hits.inner_hits.earliest.hits.hits._source.beats_stats.metrics.libbeat.output.write.bytes', 'hits.hits.inner_hits.earliest.hits.hits._source.beat.stats.libbeat.pipeline.events.total', 'hits.hits.inner_hits.earliest.hits.hits._source.beats_stats.metrics.libbeat.pipeline.events.total', // earliest hits for calculating diffs
    'hits.hits.inner_hits.earliest.hits.hits._source.beats_stats.metrics.libbeat.output.read.errors', 'hits.hits.inner_hits.earliest.hits.hits._source.beat.stats.libbeat.output.read.errors', 'hits.hits.inner_hits.earliest.hits.hits._source.beats_stats.metrics.libbeat.output.write.errors', 'hits.hits.inner_hits.earliest.hits.hits._source.beat.stats.libbeat.output.write.errors'],
    body: {
      query: (0, _create_beats_query.createBeatsQuery)({
        start,
        end,
        clusterUuid
      }),
      collapse: {
        field: 'beats_stats.metrics.beat.info.ephemeral_id',
        // collapse on ephemeral_id to handle restarts
        inner_hits: {
          name: 'earliest',
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
      },
      sort: [{
        'beats_stats.beat.uuid': {
          order: 'asc',
          unmapped_type: 'long'
        }
      }, // need to keep duplicate uuids grouped
      {
        timestamp: {
          order: 'desc',
          unmapped_type: 'long'
        }
      } // need oldest timestamp to come first for rate calcs to work
      ]
    }
  };
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  const response = await callWithRequest(req, 'search', params);
  return handleResponse(response, start, end);
}