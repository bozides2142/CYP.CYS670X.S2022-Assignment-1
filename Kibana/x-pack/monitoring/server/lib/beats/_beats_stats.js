"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDiffCalculation = exports.beatsUuidsAgg = exports.beatsAggResponseHandler = exports.beatsAggFilterPath = void 0;

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getDiffCalculation = (max, min) => {
  // no need to test max >= 0, but min <= 0 which is normal for a derivative after restart
  // because we are aggregating/collapsing on ephemeral_ids
  if (max !== null && min !== null && max >= 0 && min >= 0 && max >= min) {
    return max - min;
  }

  return null;
};

exports.getDiffCalculation = getDiffCalculation;
const beatsAggFilterPath = ['aggregations.total', 'aggregations.types.buckets.key', 'aggregations.types.buckets.uuids.buckets.doc_count', 'aggregations.min_events_total.value', 'aggregations.max_events_total.value', 'aggregations.min_bytes_sent_total.value', 'aggregations.max_bytes_sent_total.value'];
exports.beatsAggFilterPath = beatsAggFilterPath;

const beatsUuidsAgg = maxBucketSize => ({
  types: {
    terms: {
      field: 'beats_stats.beat.type',
      size: 1000 // 1000 different types of beats possible seems like enough

    },
    aggs: {
      uuids: {
        terms: {
          field: 'beats_stats.beat.uuid',
          size: maxBucketSize
        }
      }
    }
  },
  total: {
    cardinality: {
      field: 'beats_stats.beat.uuid',
      precision_threshold: 10000
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
      min_bytes_sent: {
        min: {
          field: 'beats_stats.metrics.libbeat.output.write.bytes'
        }
      },
      max_bytes_sent: {
        max: {
          field: 'beats_stats.metrics.libbeat.output.write.bytes'
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
  min_bytes_sent_total: {
    sum_bucket: {
      buckets_path: 'ephemeral_ids>min_bytes_sent'
    }
  },
  max_bytes_sent_total: {
    sum_bucket: {
      buckets_path: 'ephemeral_ids>max_bytes_sent'
    }
  }
});

exports.beatsUuidsAgg = beatsUuidsAgg;

const beatsAggResponseHandler = response => {
  var _response$aggregation, _response$aggregation2, _response$aggregation3, _response$aggregation4, _response$aggregation5, _response$aggregation6, _response$aggregation7, _response$aggregation8, _response$aggregation9, _response$aggregation10, _response$aggregation11, _response$aggregation12, _response$aggregation13; // beat types stat


  const buckets = (_response$aggregation = response === null || response === void 0 ? void 0 : (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : (_response$aggregation3 = _response$aggregation2.types) === null || _response$aggregation3 === void 0 ? void 0 : _response$aggregation3.buckets) !== null && _response$aggregation !== void 0 ? _response$aggregation : [];
  const beatTotal = (_response$aggregation4 = response === null || response === void 0 ? void 0 : (_response$aggregation5 = response.aggregations) === null || _response$aggregation5 === void 0 ? void 0 : _response$aggregation5.total.value) !== null && _response$aggregation4 !== void 0 ? _response$aggregation4 : 0;
  const beatTypes = buckets.reduce((types, typeBucket) => {
    return [...types, {
      type: (0, _lodash.upperFirst)(typeBucket.key),
      count: typeBucket.uuids.buckets.length
    }];
  }, []);
  const eventsTotalMax = (_response$aggregation6 = response === null || response === void 0 ? void 0 : (_response$aggregation7 = response.aggregations) === null || _response$aggregation7 === void 0 ? void 0 : _response$aggregation7.max_events_total.value) !== null && _response$aggregation6 !== void 0 ? _response$aggregation6 : 0;
  const eventsTotalMin = (_response$aggregation8 = response === null || response === void 0 ? void 0 : (_response$aggregation9 = response.aggregations) === null || _response$aggregation9 === void 0 ? void 0 : _response$aggregation9.min_events_total.value) !== null && _response$aggregation8 !== void 0 ? _response$aggregation8 : 0;
  const bytesSentMax = (_response$aggregation10 = response === null || response === void 0 ? void 0 : (_response$aggregation11 = response.aggregations) === null || _response$aggregation11 === void 0 ? void 0 : _response$aggregation11.max_bytes_sent_total.value) !== null && _response$aggregation10 !== void 0 ? _response$aggregation10 : 0;
  const bytesSentMin = (_response$aggregation12 = response === null || response === void 0 ? void 0 : (_response$aggregation13 = response.aggregations) === null || _response$aggregation13 === void 0 ? void 0 : _response$aggregation13.min_bytes_sent_total.value) !== null && _response$aggregation12 !== void 0 ? _response$aggregation12 : 0;
  return {
    beatTotal,
    beatTypes,
    totalEvents: getDiffCalculation(eventsTotalMax, eventsTotalMin),
    bytesSent: getDiffCalculation(bytesSentMax, bytesSentMin)
  };
};

exports.beatsAggResponseHandler = beatsAggResponseHandler;