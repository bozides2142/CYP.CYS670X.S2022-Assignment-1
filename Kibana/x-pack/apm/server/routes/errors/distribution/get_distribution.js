"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getErrorDistribution = getErrorDistribution;

var _offset_previous_period_coordinate = require("../../../../common/utils/offset_previous_period_coordinate");

var _constants = require("../../transactions/constants");

var _get_buckets = require("./get_buckets");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getBucketSize({
  start,
  end
}) {
  return Math.floor((end - start) / _constants.BUCKET_TARGET_COUNT);
}

async function getErrorDistribution({
  environment,
  kuery,
  serviceName,
  groupId,
  setup,
  start,
  end,
  comparisonStart,
  comparisonEnd
}) {
  const bucketSize = getBucketSize({
    start,
    end
  });
  const commonProps = {
    environment,
    kuery,
    serviceName,
    groupId,
    setup,
    bucketSize
  };
  const currentPeriodPromise = (0, _get_buckets.getBuckets)({ ...commonProps,
    start,
    end
  });
  const previousPeriodPromise = comparisonStart && comparisonEnd ? (0, _get_buckets.getBuckets)({ ...commonProps,
    start: comparisonStart,
    end: comparisonEnd
  }) : {
    buckets: [],
    bucketSize: null
  };
  const [currentPeriod, previousPeriod] = await Promise.all([currentPeriodPromise, previousPeriodPromise]);
  return {
    currentPeriod: currentPeriod.buckets,
    previousPeriod: (0, _offset_previous_period_coordinate.offsetPreviousPeriodCoordinates)({
      currentPeriodTimeseries: currentPeriod.buckets,
      previousPeriodTimeseries: previousPeriod.buckets
    }),
    bucketSize
  };
}