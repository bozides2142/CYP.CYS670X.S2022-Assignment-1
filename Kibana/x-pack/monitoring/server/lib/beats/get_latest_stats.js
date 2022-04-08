"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLatestStats = getLatestStats;
exports.handleResponse = handleResponse;

var _lodash = require("lodash");

var _error_missing_required = require("../error_missing_required");

var _create_beats_query = require("./create_beats_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function handleResponse(response) {
  var _aggs$versions$bucket, _aggs$versions, _aggs$types$buckets, _aggs$types;

  const aggs = response === null || response === void 0 ? void 0 : response.aggregations;

  const getTimeRangeCount = name => {
    var _aggs$active_counts$b, _aggs$active_counts;

    const lastActiveBuckets = (_aggs$active_counts$b = aggs === null || aggs === void 0 ? void 0 : (_aggs$active_counts = aggs.active_counts) === null || _aggs$active_counts === void 0 ? void 0 : _aggs$active_counts.buckets) !== null && _aggs$active_counts$b !== void 0 ? _aggs$active_counts$b : [];
    const rangeBucket = lastActiveBuckets.find(bucket => bucket.key === name);
    return rangeBucket === null || rangeBucket === void 0 ? void 0 : rangeBucket.uuids.buckets.length;
  }; // aggregations are not ordered, so we find the bucket for each timestamp range
  // counts are the number of uuid bucket in the inner aggregation


  const last1mCount = getTimeRangeCount('last1m');
  const last5mCount = getTimeRangeCount('last5m');
  const last20mCount = getTimeRangeCount('last20m');
  const last1hCount = getTimeRangeCount('last1h');
  const last1dCount = getTimeRangeCount('last1d');
  const latestActive = [{
    range: 'last1m',
    count: last1mCount
  }, {
    range: 'last5m',
    count: last5mCount
  }, {
    range: 'last20m',
    count: last20mCount
  }, {
    range: 'last1h',
    count: last1hCount
  }, {
    range: 'last1d',
    count: last1dCount
  }];
  const latestVersions = ((_aggs$versions$bucket = aggs === null || aggs === void 0 ? void 0 : (_aggs$versions = aggs.versions) === null || _aggs$versions === void 0 ? void 0 : _aggs$versions.buckets) !== null && _aggs$versions$bucket !== void 0 ? _aggs$versions$bucket : []).reduce((accum, current) => {
    return [...accum, {
      version: current.key,
      count: current.uuids.buckets.length
    }];
  }, []);
  const latestTypes = ((_aggs$types$buckets = aggs === null || aggs === void 0 ? void 0 : (_aggs$types = aggs.types) === null || _aggs$types === void 0 ? void 0 : _aggs$types.buckets) !== null && _aggs$types$buckets !== void 0 ? _aggs$types$buckets : []).reduce((accum, current) => {
    return [...accum, {
      type: (0, _lodash.upperFirst)(current.key),
      count: current.uuids.buckets.length
    }];
  }, []);
  return {
    latestActive,
    latestVersions,
    latestTypes
  };
}

function getLatestStats(req, beatsIndexPattern, clusterUuid) {
  (0, _error_missing_required.checkParam)(beatsIndexPattern, 'beatsIndexPattern in getBeats');
  const config = req.server.config;
  const lastDayFilter = {
    range: {
      timestamp: {
        gte: 'now-1d/d',
        lte: 'now/d'
      }
    }
  };
  const beatUuidAgg = {
    // size of these buckets determines actual # of beats in each kind of aggregation
    aggs: {
      uuids: {
        terms: {
          field: 'beats_stats.beat.uuid',
          size: config.ui.max_bucket_size
        }
      }
    }
  };
  const params = {
    index: beatsIndexPattern,
    size: 0,
    ignore_unavailable: true,
    filter_path: 'aggregations',
    body: {
      query: (0, _create_beats_query.createBeatsQuery)({
        clusterUuid,
        filters: [lastDayFilter]
      }),
      aggs: {
        active_counts: {
          date_range: {
            field: 'timestamp',
            ranges: [{
              key: 'last1m',
              from: 'now-1m/m',
              to: 'now'
            }, {
              key: 'last5m',
              from: 'now-5m/m',
              to: 'now'
            }, {
              key: 'last20m',
              from: 'now-20m/m',
              to: 'now'
            }, {
              key: 'last1h',
              from: 'now-1h/h',
              to: 'now'
            }, {
              key: 'last1d',
              from: 'now-1d/d',
              to: 'now'
            }]
          },
          ...beatUuidAgg
        },
        versions: {
          terms: {
            field: 'beats_stats.beat.version',
            size: 5
          },
          ...beatUuidAgg
        },
        types: {
          terms: {
            field: 'beats_stats.beat.type',
            size: 5
          },
          ...beatUuidAgg
        }
      }
    }
  };
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  return callWithRequest(req, 'search', params).then(handleResponse);
}