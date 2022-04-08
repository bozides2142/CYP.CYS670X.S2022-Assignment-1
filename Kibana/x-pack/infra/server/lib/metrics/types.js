"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TopMetricsTypeRT = exports.TermsWithMetrics = exports.PercentilesTypeRT = exports.PercentilesKeyedTypeRT = exports.NormalizedMetricValueRT = exports.MetricValueTypeRT = exports.HistogramResponseRT = exports.HistogramBucketRT = exports.GroupingResponseRT = exports.BasicMetricValueRT = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const NumberOrNullRT = rt.union([rt.number, rt.null]);
const BasicMetricValueRT = rt.type({
  value: NumberOrNullRT
});
exports.BasicMetricValueRT = BasicMetricValueRT;
const NormalizedMetricValueRT = rt.intersection([BasicMetricValueRT, rt.type({
  normalized_value: NumberOrNullRT
})]);
exports.NormalizedMetricValueRT = NormalizedMetricValueRT;
const PercentilesTypeRT = rt.type({
  values: rt.record(rt.string, NumberOrNullRT)
});
exports.PercentilesTypeRT = PercentilesTypeRT;
const PercentilesKeyedTypeRT = rt.type({
  values: rt.array(rt.type({
    key: rt.string,
    value: NumberOrNullRT
  }))
});
exports.PercentilesKeyedTypeRT = PercentilesKeyedTypeRT;
const TopMetricsTypeRT = rt.type({
  top: rt.array(rt.type({
    sort: rt.union([rt.array(rt.number), rt.array(rt.string)]),
    metrics: rt.record(rt.string, rt.union([rt.number, rt.string, rt.null]))
  }))
});
exports.TopMetricsTypeRT = TopMetricsTypeRT;
const MetricValueTypeRT = rt.union([BasicMetricValueRT, NormalizedMetricValueRT, PercentilesTypeRT, PercentilesKeyedTypeRT, TopMetricsTypeRT]);
exports.MetricValueTypeRT = MetricValueTypeRT;
const TermsWithMetrics = rt.intersection([rt.type({
  buckets: rt.array(rt.record(rt.string, rt.union([rt.number, rt.string, MetricValueTypeRT])))
}), rt.partial({
  sum_other_doc_count: rt.number,
  doc_count_error_upper_bound: rt.number
})]);
exports.TermsWithMetrics = TermsWithMetrics;
const HistogramBucketRT = rt.record(rt.string, rt.union([rt.number, rt.string, MetricValueTypeRT, TermsWithMetrics]));
exports.HistogramBucketRT = HistogramBucketRT;
const HistogramResponseRT = rt.type({
  histogram: rt.type({
    buckets: rt.array(HistogramBucketRT)
  }),
  metricsets: rt.type({
    buckets: rt.array(rt.type({
      key: rt.string,
      doc_count: rt.number
    }))
  })
});
exports.HistogramResponseRT = HistogramResponseRT;
const GroupingBucketRT = rt.intersection([rt.type({
  key: rt.record(rt.string, rt.string),
  doc_count: rt.number
}), HistogramResponseRT]);
const GroupingResponseRT = rt.type({
  groupings: rt.intersection([rt.type({
    buckets: rt.array(GroupingBucketRT)
  }), rt.partial({
    after_key: rt.record(rt.string, rt.string)
  })])
});
exports.GroupingResponseRT = GroupingResponseRT;