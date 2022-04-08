"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDiffCalculation = exports.apmUuidsAgg = exports.apmAggResponseHandler = exports.apmAggFilterPath = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getMemPath = cgroup => cgroup ? 'beats_stats.metrics.beat.cgroup.memory.mem.usage.bytes' : 'beats_stats.metrics.beat.memstats.rss';

const getDiffCalculation = (max, min) => {
  // no need to test max >= 0, but min <= 0 which is normal for a derivative after restart
  // because we are aggregating/collapsing on ephemeral_ids
  if (max !== null && min !== null && max >= 0 && min >= 0 && max >= min) {
    return max - min;
  }

  return null;
};

exports.getDiffCalculation = getDiffCalculation;
const apmAggFilterPath = ['aggregations.total', 'aggregations.min_events_total.value', 'aggregations.max_events_total.value', 'aggregations.min_mem_total.value', 'aggregations.max_mem_total.value', 'aggregations.versions.buckets'];
exports.apmAggFilterPath = apmAggFilterPath;

const apmUuidsAgg = (maxBucketSize, cgroup) => ({
  total: {
    cardinality: {
      field: 'beats_stats.beat.uuid',
      precision_threshold: 10000
    }
  },
  versions: {
    terms: {
      field: 'beats_stats.beat.version'
    }
  },
  ephemeral_ids: {
    terms: {
      field: 'beats_stats.metrics.beat.info.ephemeral_id',
      size: maxBucketSize
    },
    aggs: {
      min_events: {
        min: {
          field: 'beats_stats.metrics.libbeat.pipeline.events.total'
        }
      },
      max_events: {
        max: {
          field: 'beats_stats.metrics.libbeat.pipeline.events.total'
        }
      },
      min_mem: {
        min: {
          field: getMemPath(cgroup)
        }
      },
      max_mem: {
        max: {
          field: getMemPath(cgroup)
        }
      }
    }
  },
  min_events_total: {
    sum_bucket: {
      buckets_path: 'ephemeral_ids>min_events'
    }
  },
  max_events_total: {
    sum_bucket: {
      buckets_path: 'ephemeral_ids>max_events'
    }
  },
  min_mem_total: {
    sum_bucket: {
      buckets_path: 'ephemeral_ids>min_mem'
    }
  },
  max_mem_total: {
    sum_bucket: {
      buckets_path: 'ephemeral_ids>max_mem'
    }
  }
});

exports.apmUuidsAgg = apmUuidsAgg;

const apmAggResponseHandler = response => {
  var _response$aggregation, _response$aggregation2, _response$aggregation3, _response$aggregation4, _response$aggregation5, _response$aggregation6, _response$aggregation7, _response$aggregation8, _response$aggregation9, _response$aggregation10, _response$aggregation11, _response$aggregation12;

  const apmTotal = (_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.total.value) !== null && _response$aggregation !== void 0 ? _response$aggregation : 0;
  const eventsTotalMax = (_response$aggregation3 = (_response$aggregation4 = response.aggregations) === null || _response$aggregation4 === void 0 ? void 0 : _response$aggregation4.max_events_total.value) !== null && _response$aggregation3 !== void 0 ? _response$aggregation3 : 0;
  const eventsTotalMin = (_response$aggregation5 = (_response$aggregation6 = response.aggregations) === null || _response$aggregation6 === void 0 ? void 0 : _response$aggregation6.min_events_total.value) !== null && _response$aggregation5 !== void 0 ? _response$aggregation5 : 0;
  const memMax = (_response$aggregation7 = (_response$aggregation8 = response.aggregations) === null || _response$aggregation8 === void 0 ? void 0 : _response$aggregation8.max_mem_total.value) !== null && _response$aggregation7 !== void 0 ? _response$aggregation7 : 0;
  const memMin = (_response$aggregation9 = (_response$aggregation10 = response.aggregations) === null || _response$aggregation10 === void 0 ? void 0 : _response$aggregation10.min_mem_total.value) !== null && _response$aggregation9 !== void 0 ? _response$aggregation9 : 0;
  const versions = ((_response$aggregation11 = (_response$aggregation12 = response.aggregations) === null || _response$aggregation12 === void 0 ? void 0 : _response$aggregation12.versions.buckets) !== null && _response$aggregation11 !== void 0 ? _response$aggregation11 : []).map(({
    key
  }) => key);
  return {
    apmTotal,
    totalEvents: getDiffCalculation(eventsTotalMax, eventsTotalMin),
    memRss: getDiffCalculation(memMax, memMin),
    versions
  };
};

exports.apmAggResponseHandler = apmAggResponseHandler;