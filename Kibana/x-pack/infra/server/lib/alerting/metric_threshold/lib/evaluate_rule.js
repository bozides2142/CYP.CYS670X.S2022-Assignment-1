"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.evaluateRule = void 0;

var _lodash = require("lodash");

var _moment = _interopRequireDefault(require("moment"));

var _metrics = require("../../../../../common/alerting/metrics");

var _create_afterkey_handler = require("../../../../utils/create_afterkey_handler");

var _get_all_composite_data = require("../../../../utils/get_all_composite_data");

var _get_interval_in_seconds = require("../../../../utils/get_interval_in_seconds");

var _messages = require("../../common/messages");

var _utils = require("../../common/utils");

var _create_timerange = require("./create_timerange");

var _metric_query = require("./metric_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function isAggregationWithIntervals(subject) {
  return (0, _lodash.isObject)(subject) && (0, _lodash.has)(subject, 'aggregatedIntervals');
}

const evaluateRule = (esClient, params, config, prevGroups, compositeSize, timeframe) => {
  const {
    criteria,
    groupBy,
    filterQuery,
    shouldDropPartialBuckets
  } = params;
  return Promise.all(criteria.map(async criterion => {
    var _last$key, _last;

    const currentValues = await getMetric(esClient, criterion, config.metricAlias, groupBy, filterQuery, compositeSize, timeframe, shouldDropPartialBuckets);
    const {
      threshold,
      warningThreshold,
      comparator,
      warningComparator
    } = criterion;

    const pointsEvaluator = (points, t, c) => {
      if (!t || !c) return [false];
      const comparisonFunction = comparatorMap[c];
      return Array.isArray(points) ? points.map(point => t && typeof point.value === 'number' && comparisonFunction(point.value, t)) : [false];
    }; // If any previous groups are no longer being reported, backfill them with null values


    const currentGroups = Object.keys(currentValues);
    const missingGroups = (0, _lodash.difference)(prevGroups, currentGroups);

    if (currentGroups.length === 0 && missingGroups.length === 0) {
      missingGroups.push(_utils.UNGROUPED_FACTORY_KEY);
    }

    const backfillTimestamp = (_last$key = (_last = (0, _lodash.last)((0, _lodash.last)(Object.values(currentValues)))) === null || _last === void 0 ? void 0 : _last.key) !== null && _last$key !== void 0 ? _last$key : new Date().toISOString();
    const backfilledPrevGroups = {};

    for (const group of missingGroups) {
      backfilledPrevGroups[group] = [{
        key: backfillTimestamp,
        value: criterion.aggType === _metrics.Aggregators.COUNT ? 0 : null
      }];
    }

    const currentValuesWithBackfilledPrevGroups = { ...currentValues,
      ...backfilledPrevGroups
    };
    return (0, _lodash.mapValues)(currentValuesWithBackfilledPrevGroups, points => {
      var _criterion$metric, _last2, _last3, _last4;

      if ((0, _metrics.isTooManyBucketsPreviewException)(points)) throw points;
      return { ...criterion,
        metric: (_criterion$metric = criterion.metric) !== null && _criterion$metric !== void 0 ? _criterion$metric : _messages.DOCUMENT_COUNT_I18N,
        currentValue: Array.isArray(points) ? (_last2 = (0, _lodash.last)(points)) === null || _last2 === void 0 ? void 0 : _last2.value : NaN,
        timestamp: Array.isArray(points) ? (_last3 = (0, _lodash.last)(points)) === null || _last3 === void 0 ? void 0 : _last3.key : NaN,
        shouldFire: pointsEvaluator(points, threshold, comparator),
        shouldWarn: pointsEvaluator(points, warningThreshold, warningComparator),
        isNoData: Array.isArray(points) ? points.map(point => (point === null || point === void 0 ? void 0 : point.value) === null || point === null) : [points === null],
        isError: (0, _lodash.isNaN)(Array.isArray(points) ? (_last4 = (0, _lodash.last)(points)) === null || _last4 === void 0 ? void 0 : _last4.value : points)
      };
    });
  }));
};

exports.evaluateRule = evaluateRule;

const getMetric = async function (esClient, params, index, groupBy, filterQuery, compositeSize, timeframe, shouldDropPartialBuckets) {
  const {
    aggType,
    timeSize,
    timeUnit
  } = params;
  const hasGroupBy = groupBy && groupBy.length;
  const interval = `${timeSize}${timeUnit}`;
  const intervalAsSeconds = (0, _get_interval_in_seconds.getIntervalInSeconds)(interval);
  const intervalAsMS = intervalAsSeconds * 1000;
  const calculatedTimerange = (0, _create_timerange.createTimerange)(intervalAsMS, aggType, timeframe);
  const searchBody = (0, _metric_query.getElasticsearchMetricQuery)(params, calculatedTimerange, compositeSize, hasGroupBy ? groupBy : undefined, filterQuery);
  const dropPartialBucketsOptions = // Rate aggs always drop partial buckets; guard against this boolean being passed as false
  shouldDropPartialBuckets || aggType === _metrics.Aggregators.RATE ? {
    from: calculatedTimerange.start,
    to: calculatedTimerange.end,
    bucketSizeInMillis: intervalAsMS
  } : null;

  try {
    var _result$hits$total$va, _result$hits$total;

    if (hasGroupBy) {
      const bucketSelector = response => {
        var _response$aggregation, _response$aggregation2;

        return ((_response$aggregation = response.aggregations) === null || _response$aggregation === void 0 ? void 0 : (_response$aggregation2 = _response$aggregation.groupings) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.buckets) || [];
      };

      const afterKeyHandler = (0, _create_afterkey_handler.createAfterKeyHandler)('aggs.groupings.composite.after', response => {
        var _response$aggregation3, _response$aggregation4;

        return (_response$aggregation3 = response.aggregations) === null || _response$aggregation3 === void 0 ? void 0 : (_response$aggregation4 = _response$aggregation3.groupings) === null || _response$aggregation4 === void 0 ? void 0 : _response$aggregation4.after_key;
      });
      const compositeBuckets = await (0, _get_all_composite_data.getAllCompositeData)( // @ts-expect-error @elastic/elasticsearch SearchResponse.body.timeout is not required
      body => esClient.search({
        body,
        index
      }), searchBody, bucketSelector, afterKeyHandler);
      const groupedResults = {};

      for (const bucket of compositeBuckets) {
        const key = Object.values(bucket.key).join(', ');
        const value = getValuesFromAggregations(bucket, aggType, dropPartialBucketsOptions, calculatedTimerange, bucket.doc_count);
        groupedResults[key] = value;
      }

      return groupedResults;
    }

    const {
      body: result
    } = await esClient.search({
      body: searchBody,
      index
    });
    return {
      [_utils.UNGROUPED_FACTORY_KEY]: getValuesFromAggregations(result.aggregations, aggType, dropPartialBucketsOptions, calculatedTimerange, result.hits ? (0, _lodash.isNumber)(result.hits.total) ? result.hits.total : (_result$hits$total$va = (_result$hits$total = result.hits.total) === null || _result$hits$total === void 0 ? void 0 : _result$hits$total.value) !== null && _result$hits$total$va !== void 0 ? _result$hits$total$va : 0 : 0)
    };
  } catch (e) {
    if (timeframe) {
      var _e$body, _e$body$error, _e$body$error$caused_; // This code should only ever be reached when previewing the alert, not executing it


      const causedByType = (_e$body = e.body) === null || _e$body === void 0 ? void 0 : (_e$body$error = _e$body.error) === null || _e$body$error === void 0 ? void 0 : (_e$body$error$caused_ = _e$body$error.caused_by) === null || _e$body$error$caused_ === void 0 ? void 0 : _e$body$error$caused_.type;

      if (causedByType === 'too_many_buckets_exception') {
        return {
          [_utils.UNGROUPED_FACTORY_KEY]: {
            [_metrics.TOO_MANY_BUCKETS_PREVIEW_EXCEPTION]: true,
            maxBuckets: e.body.error.caused_by.max_buckets
          }
        };
      }
    }

    return {
      [_utils.UNGROUPED_FACTORY_KEY]: NaN
    }; // Trigger an Error state
  }
};

const dropPartialBuckets = ({
  from,
  to,
  bucketSizeInMillis
}) => row => {
  if (row == null) return null;
  const timestamp = new Date(row.key).valueOf();
  return timestamp >= from && timestamp + bucketSizeInMillis <= to;
};

const getValuesFromAggregations = (aggregations, aggType, dropPartialBucketsOptions, timeFrame, docCount) => {
  try {
    let buckets;

    if (aggType === _metrics.Aggregators.COUNT) {
      buckets = [{
        doc_count: docCount,
        to_as_string: (0, _moment.default)(timeFrame.end).toISOString(),
        from_as_string: (0, _moment.default)(timeFrame.start).toISOString(),
        key_as_string: (0, _moment.default)(timeFrame.start).toISOString()
      }];
    } else if (isAggregationWithIntervals(aggregations)) {
      buckets = aggregations.aggregatedIntervals.buckets;
    } else {
      buckets = [{ ...aggregations,
        doc_count: docCount,
        to_as_string: (0, _moment.default)(timeFrame.end).toISOString(),
        from_as_string: (0, _moment.default)(timeFrame.start).toISOString(),
        key_as_string: (0, _moment.default)(timeFrame.start).toISOString()
      }];
    }

    if (!buckets.length) return null; // No Data state

    let mappedBuckets;

    if (aggType === _metrics.Aggregators.COUNT) {
      mappedBuckets = buckets.map(bucket => ({
        key: bucket.from_as_string,
        value: bucket.doc_count || null
      }));
    } else if (aggType === _metrics.Aggregators.P95 || aggType === _metrics.Aggregators.P99) {
      mappedBuckets = buckets.map(bucket => {
        var _bucket$aggregatedVal;

        const values = ((_bucket$aggregatedVal = bucket.aggregatedValue) === null || _bucket$aggregatedVal === void 0 ? void 0 : _bucket$aggregatedVal.values) || [];
        const firstValue = (0, _lodash.first)(values);
        if (!firstValue) return null;
        return {
          key: bucket.from_as_string,
          value: firstValue.value
        };
      });
    } else if (aggType === _metrics.Aggregators.AVERAGE) {
      mappedBuckets = buckets.map(bucket => {
        var _bucket$key_as_string, _bucket$aggregatedVal2, _bucket$aggregatedVal3;

        return {
          key: (_bucket$key_as_string = bucket.key_as_string) !== null && _bucket$key_as_string !== void 0 ? _bucket$key_as_string : bucket.from_as_string,
          value: (_bucket$aggregatedVal2 = (_bucket$aggregatedVal3 = bucket.aggregatedValue) === null || _bucket$aggregatedVal3 === void 0 ? void 0 : _bucket$aggregatedVal3.value) !== null && _bucket$aggregatedVal2 !== void 0 ? _bucket$aggregatedVal2 : null
        };
      });
    } else if (aggType === _metrics.Aggregators.RATE) {
      mappedBuckets = buckets.map(bucket => {
        var _bucket$key_as_string2, _bucket$aggregatedVal4, _bucket$aggregatedVal5;

        return {
          key: (_bucket$key_as_string2 = bucket.key_as_string) !== null && _bucket$key_as_string2 !== void 0 ? _bucket$key_as_string2 : bucket.from_as_string,
          value: (_bucket$aggregatedVal4 = (_bucket$aggregatedVal5 = bucket.aggregatedValue) === null || _bucket$aggregatedVal5 === void 0 ? void 0 : _bucket$aggregatedVal5.value) !== null && _bucket$aggregatedVal4 !== void 0 ? _bucket$aggregatedVal4 : null
        };
      });
    } else {
      mappedBuckets = buckets.map(bucket => {
        var _bucket$key_as_string3, _bucket$aggregatedVal6, _bucket$aggregatedVal7;

        return {
          key: (_bucket$key_as_string3 = bucket.key_as_string) !== null && _bucket$key_as_string3 !== void 0 ? _bucket$key_as_string3 : bucket.from_as_string,
          value: (_bucket$aggregatedVal6 = (_bucket$aggregatedVal7 = bucket.aggregatedValue) === null || _bucket$aggregatedVal7 === void 0 ? void 0 : _bucket$aggregatedVal7.value) !== null && _bucket$aggregatedVal6 !== void 0 ? _bucket$aggregatedVal6 : null
        };
      });
    }

    if (dropPartialBucketsOptions) {
      return mappedBuckets.filter(dropPartialBuckets(dropPartialBucketsOptions));
    }

    return mappedBuckets;
  } catch (e) {
    return NaN; // Error state
  }
};

const comparatorMap = {
  [_metrics.Comparator.BETWEEN]: (value, [a, b]) => value >= Math.min(a, b) && value <= Math.max(a, b),
  [_metrics.Comparator.OUTSIDE_RANGE]: (value, [a, b]) => value < a || value > b,
  // `threshold` is always an array of numbers in case the BETWEEN/OUTSIDE_RANGE comparator is
  // used; all other compartors will just destructure the first value in the array
  [_metrics.Comparator.GT]: (a, [b]) => a > b,
  [_metrics.Comparator.LT]: (a, [b]) => a < b,
  [_metrics.Comparator.GT_OR_EQ]: (a, [b]) => a >= b,
  [_metrics.Comparator.LT_OR_EQ]: (a, [b]) => a <= b
};