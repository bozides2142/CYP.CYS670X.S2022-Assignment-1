"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterOldShardActivity = filterOldShardActivity;
exports.getLastRecovery = getLastRecovery;
exports.handleLegacyLastRecoveries = handleLegacyLastRecoveries;
exports.handleMbLastRecoveries = handleMbLastRecoveries;

var _moment = _interopRequireDefault(require("moment"));

var _lodash = _interopRequireDefault(require("lodash"));

var _create_query = require("../create_query");

var _metrics = require("../metrics");

var _get_index_patterns = require("../cluster/get_index_patterns");

var _static_globals = require("../../static_globals");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore
// @ts-ignore

/**
 * Filter out shard activity that we do not care about.
 *
 * The shard activity gets returned as a big document with a lot of shard activity reported that is out of date with respect
 * to the date range of the polling window. We only care about any shard activity that isn't finished yet, or that ended
 * after the polling window (it's implied that the activity is relevant for the _end_ time because the document wouldn't
 * have been returned otherwise).
 *
 * @param {Number} startMs Start time in milliseconds of the polling window
 * @returns {boolean} true to keep
 */


function filterOldShardActivity(startMs) {
  return activity => {
    // either it's still going and there is no stop time, or the stop time happened after we started looking for one
    return activity && (!_lodash.default.isNumber(activity.stop_time_in_millis) || activity.stop_time_in_millis >= startMs);
  };
}
/**
 * The response handler for {@link getLastRecovery}.
 *
 * This is exposed for testing.
 * @param {Object} resp The response returned from the search request
 * @param {Date} start The start time from the request payload (expected to be of type {@code Date})
 * @returns {Object[]} An array of shards representing active shard activity from {@code _source.index_recovery.shards}.
 */


function handleLegacyLastRecoveries(resp, start) {
  var _resp$hits;

  if (((_resp$hits = resp.hits) === null || _resp$hits === void 0 ? void 0 : _resp$hits.hits.length) === 1) {
    var _resp$hits$hits$0$_so, _resp$hits2, _resp$hits2$hits$, _resp$hits2$hits$$_so;

    const data = ((_resp$hits$hits$0$_so = (_resp$hits2 = resp.hits) === null || _resp$hits2 === void 0 ? void 0 : (_resp$hits2$hits$ = _resp$hits2.hits[0]) === null || _resp$hits2$hits$ === void 0 ? void 0 : (_resp$hits2$hits$$_so = _resp$hits2$hits$._source.index_recovery) === null || _resp$hits2$hits$$_so === void 0 ? void 0 : _resp$hits2$hits$$_so.shards) !== null && _resp$hits$hits$0$_so !== void 0 ? _resp$hits$hits$0$_so : []).filter(filterOldShardActivity(_moment.default.utc(start).valueOf()));
    data.sort((a, b) => {
      var _b$start_time_in_mill, _a$start_time_in_mill;

      return ((_b$start_time_in_mill = b.start_time_in_millis) !== null && _b$start_time_in_mill !== void 0 ? _b$start_time_in_mill : 0) - ((_a$start_time_in_mill = a.start_time_in_millis) !== null && _a$start_time_in_mill !== void 0 ? _a$start_time_in_mill : 0);
    });
    return data;
  }

  return [];
} // For MB, we index individual documents instead of a single document with a list of recovered shards
// This means we need to query a bit differently to end up with the same result. We need to ensure
// that our recovered shards are within the same time window to match the legacy query (of size: 1)


function handleMbLastRecoveries(resp, start) {
  var _resp$hits$hits, _resp$hits3, _resp$aggregations, _resp$aggregations$ma, _groupedByTimestamp$m;

  const hits = (_resp$hits$hits = (_resp$hits3 = resp.hits) === null || _resp$hits3 === void 0 ? void 0 : _resp$hits3.hits) !== null && _resp$hits$hits !== void 0 ? _resp$hits$hits : [];
  const groupedByTimestamp = hits.reduce((accum, hit) => {
    var _hit$_source$Timesta;

    const timestamp = (_hit$_source$Timesta = hit._source['@timestamp']) !== null && _hit$_source$Timesta !== void 0 ? _hit$_source$Timesta : '';
    accum[timestamp] = accum[timestamp] || [];
    accum[timestamp].push(hit);
    return accum;
  }, {});
  const maxTimestamp = (_resp$aggregations = resp.aggregations) === null || _resp$aggregations === void 0 ? void 0 : (_resp$aggregations$ma = _resp$aggregations.max_timestamp) === null || _resp$aggregations$ma === void 0 ? void 0 : _resp$aggregations$ma.value_as_string;
  const mapped = ((_groupedByTimestamp$m = groupedByTimestamp[maxTimestamp]) !== null && _groupedByTimestamp$m !== void 0 ? _groupedByTimestamp$m : []).map(hit => {
    var _hit$_source$elastics, _hit$_source$elastics2;

    return (_hit$_source$elastics = hit._source.elasticsearch) === null || _hit$_source$elastics === void 0 ? void 0 : (_hit$_source$elastics2 = _hit$_source$elastics.index) === null || _hit$_source$elastics2 === void 0 ? void 0 : _hit$_source$elastics2.recovery;
  });
  const filtered = mapped.filter(filterOldShardActivity(_moment.default.utc(start).valueOf()));
  filtered.sort((a, b) => {
    var _b$start_time_in_mill2, _a$start_time_in_mill2;

    return a && b ? ((_b$start_time_in_mill2 = b.start_time_in_millis) !== null && _b$start_time_in_mill2 !== void 0 ? _b$start_time_in_mill2 : 0) - ((_a$start_time_in_mill2 = a.start_time_in_millis) !== null && _a$start_time_in_mill2 !== void 0 ? _a$start_time_in_mill2 : 0) : 0;
  });
  return filtered;
}

async function getLastRecovery(req, size) {
  const start = req.payload.timeRange.min;
  const end = req.payload.timeRange.max;
  const clusterUuid = req.params.clusterUuid;

  const metric = _metrics.ElasticsearchMetric.getMetricFields();

  const dataset = 'index_recovery';
  const moduleType = 'elasticsearch';
  const indexPattern = (0, _get_index_patterns.getNewIndexPatterns)({
    config: _static_globals.Globals.app.config,
    moduleType,
    dataset,
    ccs: req.payload.ccs
  });
  const legacyParams = {
    index: indexPattern,
    size: 1,
    ignore_unavailable: true,
    body: {
      _source: ['index_recovery.shards'],
      sort: {
        timestamp: {
          order: 'desc',
          unmapped_type: 'long'
        }
      },
      query: (0, _create_query.createQuery)({
        type: dataset,
        metricset: dataset,
        start,
        end,
        clusterUuid,
        metric
      })
    }
  };
  const indexPatternEcs = (0, _get_index_patterns.getNewIndexPatterns)({
    config: _static_globals.Globals.app.config,
    moduleType,
    dataset,
    ccs: req.payload.ccs,
    ecsLegacyOnly: true
  });
  const ecsParams = {
    index: indexPatternEcs,
    size,
    ignore_unavailable: true,
    body: {
      _source: ['elasticsearch.index.recovery', '@timestamp'],
      sort: {
        timestamp: {
          order: 'desc',
          unmapped_type: 'long'
        }
      },
      query: (0, _create_query.createQuery)({
        type: dataset,
        dsDataset: `${moduleType}.${dataset}`,
        metricset: dataset,
        start,
        end,
        clusterUuid,
        metric
      }),
      aggs: {
        max_timestamp: {
          max: {
            field: '@timestamp'
          }
        }
      }
    }
  };
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  const [legacyResp, mbResp] = await Promise.all([callWithRequest(req, 'search', legacyParams), callWithRequest(req, 'search', ecsParams)]);
  const legacyResult = handleLegacyLastRecoveries(legacyResp, start);
  const mbResult = handleMbLastRecoveries(mbResp, start);
  return [...legacyResult, ...mbResult];
}