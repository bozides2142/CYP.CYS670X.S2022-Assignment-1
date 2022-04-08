"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getErrorGroupDetailedStatistics = getErrorGroupDetailedStatistics;
exports.getErrorGroupPeriods = getErrorGroupPeriods;

var _lodash = require("lodash");

var _offset_previous_period_coordinate = require("../../../../common/utils/offset_previous_period_coordinate");

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _processor_event = require("../../../../common/processor_event");

var _server = require("../../../../../observability/server");

var _environment_query = require("../../../../common/utils/environment_query");

var _get_bucket_size = require("../../../lib/helpers/get_bucket_size");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getErrorGroupDetailedStatistics({
  kuery,
  serviceName,
  setup,
  numBuckets,
  groupIds,
  environment,
  start,
  end
}) {
  const {
    apmEventClient
  } = setup;
  const {
    intervalString
  } = (0, _get_bucket_size.getBucketSize)({
    start,
    end,
    numBuckets
  });
  const timeseriesResponse = await apmEventClient.search('get_service_error_group_detailed_statistics', {
    apm: {
      events: [_processor_event.ProcessorEvent.error]
    },
    body: {
      size: 0,
      query: {
        bool: {
          filter: [{
            terms: {
              [_elasticsearch_fieldnames.ERROR_GROUP_ID]: groupIds
            }
          }, {
            term: {
              [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
            }
          }, ...(0, _server.rangeQuery)(start, end), ...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery)]
        }
      },
      aggs: {
        error_groups: {
          terms: {
            field: _elasticsearch_fieldnames.ERROR_GROUP_ID,
            size: 500
          },
          aggs: {
            timeseries: {
              date_histogram: {
                field: '@timestamp',
                fixed_interval: intervalString,
                min_doc_count: 0,
                extended_bounds: {
                  min: start,
                  max: end
                }
              }
            }
          }
        }
      }
    }
  });

  if (!timeseriesResponse.aggregations) {
    return [];
  }

  return timeseriesResponse.aggregations.error_groups.buckets.map(bucket => {
    const groupId = bucket.key;
    return {
      groupId,
      timeseries: bucket.timeseries.buckets.map(timeseriesBucket => {
        return {
          x: timeseriesBucket.key,
          y: timeseriesBucket.doc_count
        };
      })
    };
  });
}

async function getErrorGroupPeriods({
  kuery,
  serviceName,
  setup,
  numBuckets,
  groupIds,
  environment,
  comparisonStart,
  comparisonEnd,
  start,
  end
}) {
  const commonProps = {
    environment,
    kuery,
    serviceName,
    setup,
    numBuckets,
    groupIds
  };
  const currentPeriodPromise = getErrorGroupDetailedStatistics({ ...commonProps,
    start,
    end
  });
  const previousPeriodPromise = comparisonStart && comparisonEnd ? getErrorGroupDetailedStatistics({ ...commonProps,
    start: comparisonStart,
    end: comparisonEnd
  }) : [];
  const [currentPeriod, previousPeriod] = await Promise.all([currentPeriodPromise, previousPeriodPromise]);
  const firstCurrentPeriod = currentPeriod === null || currentPeriod === void 0 ? void 0 : currentPeriod[0];
  return {
    currentPeriod: (0, _lodash.keyBy)(currentPeriod, 'groupId'),
    previousPeriod: (0, _lodash.keyBy)(previousPeriod.map(errorRateGroup => ({ ...errorRateGroup,
      timeseries: (0, _offset_previous_period_coordinate.offsetPreviousPeriodCoordinates)({
        currentPeriodTimeseries: firstCurrentPeriod === null || firstCurrentPeriod === void 0 ? void 0 : firstCurrentPeriod.timeseries,
        previousPeriodTimeseries: errorRateGroup.timeseries
      })
    })), 'groupId')
  };
}