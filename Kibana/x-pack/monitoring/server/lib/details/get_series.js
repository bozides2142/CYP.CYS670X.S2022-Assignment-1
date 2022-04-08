"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSeries = getSeries;

var _lodash = require("lodash");

var _moment = _interopRequireDefault(require("moment"));

var _error_missing_required = require("../error_missing_required");

var _metrics = require("../metrics");

var _create_query = require("../create_query");

var _common = require("../../../common");

var _constants = require("../../../common/constants");

var _format_timezone = require("../format_timezone");

var _get_index_patterns = require("../cluster/get_index_patterns");

var _static_globals = require("../../static_globals");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Derivative metrics for the first two agg buckets are unusable. For the first bucket, there
 * simply is no derivative metric (as calculating a derivative requires two adjacent buckets). For
 * the second bucket the derivative value can be artificially high if the first bucket was a partial
 * bucket (can happen with date_histogram buckets). Such a high value shows up as a spike in charts.
 * For such cases, to have accurate derivative values, it becomes necessary to discard the first two
 * buckets. Rather than discarding the _actual_ first two buckets, this function offsets the `min`
 * timestamp value (i.e. the lower bound of the timepicker range) into the past by two buckets. That
 * way, we can later discard these two buckets without affecting the actual buckets.
 *
 * @param {int} minInMsSinceEpoch Lower bound of timepicker range, in ms-since-epoch
 * @param {int} bucketSizeInSeconds Size of a single date_histogram bucket, in seconds
 */


function offsetMinForDerivativeMetric(minInMsSinceEpoch, bucketSizeInSeconds) {
  return minInMsSinceEpoch - 2 * bucketSizeInSeconds * 1000;
} // Use the metric object as the source of truth on where to find the UUID


function getUuid(req, metric) {
  if (metric.app === 'kibana') {
    return req.params.kibanaUuid;
  } else if (metric.app === 'logstash') {
    return req.params.logstashUuid;
  } else if (metric.app === 'elasticsearch') {
    return req.params.nodeUuid;
  }
}

function defaultCalculation(bucket, key) {
  var _bucket$metric_mb_der, _bucket$metric_mb_der2;

  const legacyValue = (0, _lodash.get)(bucket, key, null);
  const mbValue = (_bucket$metric_mb_der = (_bucket$metric_mb_der2 = bucket.metric_mb_deriv) === null || _bucket$metric_mb_der2 === void 0 ? void 0 : _bucket$metric_mb_der2.normalized_value) !== null && _bucket$metric_mb_der !== void 0 ? _bucket$metric_mb_der : null;
  let value;

  if (mbValue !== null && !isNaN(mbValue) && mbValue > 0) {
    value = mbValue;
  } else {
    value = legacyValue;
  } // negatives suggest derivatives that have been reset (usually due to restarts that reset the count)


  if (value < 0) {
    return null;
  }

  return value;
}

function createMetricAggs(metric) {
  if (metric.derivative) {
    const mbDerivative = metric.mbField ? {
      metric_mb_deriv: {
        derivative: {
          buckets_path: 'metric_mb',
          gap_policy: 'skip',
          unit: _constants.NORMALIZED_DERIVATIVE_UNIT
        }
      }
    } : {};
    return {
      metric_deriv: {
        derivative: {
          buckets_path: 'metric',
          gap_policy: 'skip',
          unit: _constants.NORMALIZED_DERIVATIVE_UNIT
        }
      },
      ...mbDerivative,
      ...metric.aggs
    };
  }

  return metric.aggs;
}

async function fetchSeries(req, moduleType, metric, metricOptions, groupBy, min, max, bucketSize, filters) {
  // if we're using a derivative metric, offset the min (also @see comment on offsetMinForDerivativeMetric function)
  const adjustedMin = metric.derivative ? offsetMinForDerivativeMetric(Number(min), bucketSize) : Number(min);
  let dateHistogramSubAggs = null;

  if (metric.getDateHistogramSubAggs) {
    dateHistogramSubAggs = metric.getDateHistogramSubAggs(metricOptions);
  } else if (metric.dateHistogramSubAggs) {
    dateHistogramSubAggs = metric.dateHistogramSubAggs;
  } else {
    dateHistogramSubAggs = {
      metric: {
        [metric.metricAgg]: {
          field: metric.field
        }
      },
      ...createMetricAggs(metric)
    };

    if (metric.mbField) {
      Reflect.set(dateHistogramSubAggs, 'metric_mb', {
        [metric.metricAgg]: {
          field: metric.mbField
        }
      });
    }
  }

  let aggs = {
    check: {
      date_histogram: {
        field: metric.timestampField,
        fixed_interval: bucketSize + 's'
      },
      aggs: { ...dateHistogramSubAggs
      }
    }
  };

  if (groupBy) {
    aggs = {
      groupBy: {
        terms: groupBy,
        aggs
      }
    };
  }

  const indexPatterns = (0, _get_index_patterns.getNewIndexPatterns)({
    config: _static_globals.Globals.app.config,
    moduleType,
    ccs: req.payload.ccs
  });
  const params = {
    index: indexPatterns,
    size: 0,
    ignore_unavailable: true,
    body: {
      query: (0, _create_query.createQuery)({
        start: adjustedMin,
        end: Number(max),
        metric,
        clusterUuid: metricOptions.skipClusterUuidFilter ? _constants.STANDALONE_CLUSTER_CLUSTER_UUID : req.params.clusterUuid,
        // TODO: Pass in the UUID as an explicit function parameter
        uuid: getUuid(req, metric),
        filters
      }),
      aggs
    }
  };
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  return await callWithRequest(req, 'search', params);
}
/**
 * Find the first usable index in the {@code buckets} that should be used based on the {@code min} timeframe.
 *
 * @param {Array} buckets The buckets keyed by the timestamp.
 * @param {String} min Max timestamp for results to exist within.
 * @return {Number} Index position to use for the first bucket. {@code buckets.length} if none should be used.
 */


function findFirstUsableBucketIndex(buckets, min) {
  const minInMillis = _moment.default.utc(min).valueOf();

  for (let i = 0; i < buckets.length; ++i) {
    const bucketTime = buckets[i].key;

    const bucketTimeInMillis = _moment.default.utc(bucketTime).valueOf(); // if the bucket start time, without knowing the bucket size, is before the filter time, then it's inherently a partial bucket


    if (bucketTimeInMillis >= minInMillis) {
      return i;
    }
  }

  return buckets.length;
}
/**
 * Find the last usable index in the {@code buckets} that should be used based on the {@code max} timeframe.
 *
 * Setting the bucket size to anything above 0 means that partial buckets will be EXCLUDED because the bucket's
 * start time is considered with the bucket's size.
 *
 * @param {Array} buckets The buckets keyed by the timestamp.
 * @param {String} max Max timestamp for results to exist within.
 * @param {Number} firstUsableBucketIndex The index of the first used bucket (so we can stop looking after it is found).
 * @param {Number} bucketSizeInMillis Size of a bucket in milliseconds. Set to 0 to allow partial trailing buckets.
 * @return {Number} Index position to use for the last bucket. {@code -1} if none should be used.
 */


function findLastUsableBucketIndex(buckets, max, firstUsableBucketIndex, bucketSizeInMillis = 0) {
  const maxInMillis = _moment.default.utc(max).valueOf();

  for (let i = buckets.length - 1; i > firstUsableBucketIndex - 1; --i) {
    const bucketTime = buckets[i].key;
    const bucketTimeInMillis = _moment.default.utc(bucketTime).valueOf() + bucketSizeInMillis;

    if (bucketTimeInMillis <= maxInMillis) {
      return i;
    }
  } // note: the -1 forces any comparisons with this value and the first index to fail


  return -1;
}

const formatBucketSize = bucketSizeInSeconds => {
  const now = (0, _moment.default)();
  const timestamp = (0, _moment.default)(now).add(bucketSizeInSeconds, 'seconds'); // clone the `now` object

  return (0, _common.formatTimestampToDuration)(timestamp, _constants.CALCULATE_DURATION_UNTIL, now);
};

function handleSeries(metric, groupBy, min, max, bucketSizeInSeconds, timezone, response) {
  var _response$aggregation4, _response$aggregation5, _response$aggregation6;

  const {
    derivative,
    calculation: customCalculation
  } = metric;

  function getAggregatedData(buckets) {
    const firstUsableBucketIndex = findFirstUsableBucketIndex(buckets, min);
    const lastUsableBucketIndex = findLastUsableBucketIndex(buckets, max, firstUsableBucketIndex, bucketSizeInSeconds * 1000);
    let data = [];

    if (firstUsableBucketIndex <= lastUsableBucketIndex) {
      // map buckets to values for charts
      const key = derivative ? 'metric_deriv.normalized_value' : 'metric.value';
      const calculation = customCalculation !== undefined ? customCalculation : defaultCalculation;
      data = buckets.slice(firstUsableBucketIndex, lastUsableBucketIndex + 1) // take only the buckets we know are usable
      .map(bucket => [(0, _format_timezone.formatUTCTimestampForTimezone)(bucket.key, timezone), calculation(bucket, key, metric, bucketSizeInSeconds)]); // map buckets to X/Y coords for Flot charting
    }

    return {
      bucket_size: formatBucketSize(bucketSizeInSeconds),
      timeRange: {
        min: (0, _format_timezone.formatUTCTimestampForTimezone)(min, timezone),
        max: (0, _format_timezone.formatUTCTimestampForTimezone)(max, timezone)
      },
      metric: metric.serialize(),
      data
    };
  }

  if (groupBy) {
    var _response$aggregation, _response$aggregation2, _response$aggregation3;

    return ((_response$aggregation = response === null || response === void 0 ? void 0 : (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : (_response$aggregation3 = _response$aggregation2.groupBy) === null || _response$aggregation3 === void 0 ? void 0 : _response$aggregation3.buckets) !== null && _response$aggregation !== void 0 ? _response$aggregation : []).map(bucket => {
      var _bucket$check$buckets;

      return {
        groupedBy: bucket.key,
        ...getAggregatedData((_bucket$check$buckets = bucket.check.buckets) !== null && _bucket$check$buckets !== void 0 ? _bucket$check$buckets : [])
      };
    });
  }

  return getAggregatedData((_response$aggregation4 = (_response$aggregation5 = response.aggregations) === null || _response$aggregation5 === void 0 ? void 0 : (_response$aggregation6 = _response$aggregation5.check) === null || _response$aggregation6 === void 0 ? void 0 : _response$aggregation6.buckets) !== null && _response$aggregation4 !== void 0 ? _response$aggregation4 : []);
}
/**
 * Calculate the series (aka, time-plotted) values for a single metric.
 *
 * TODO: This should be expanded to accept multiple metrics in a single request to allow a single date histogram to be used.
 *
 * @param {Object} req The incoming user's request.
 * @param {String} moduleType The relevant module eg: elasticsearch, kibana, logstash.
 * @param {String} metricName The name of the metric being plotted.
 * @param {Array} filters Any filters that should be applied to the query.
 * @return {Promise} The object response containing the {@code timeRange}, {@code metric}, and {@code data}.
 */


async function getSeries(req, moduleType, metricName, metricOptions, filters, groupBy, {
  min,
  max,
  bucketSize,
  timezone
}) {
  (0, _error_missing_required.checkParam)(moduleType, 'moduleType in details/getSeries');
  const metric = _metrics.metrics[metricName];

  if (!metric) {
    throw new Error(`Not a valid metric: ${metricName}`);
  }

  const response = await fetchSeries(req, moduleType, metric, metricOptions, groupBy, min, max, bucketSize, filters);
  return handleSeries(metric, groupBy, min, max, bucketSize, timezone, response);
}