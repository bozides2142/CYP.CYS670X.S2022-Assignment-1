"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformRequestToMetricsAPIRequest = void 0;

var _constants = require("../../../../common/constants");

var _inventory_models = require("../../../../common/inventory_models");

var _create_timerange_with_interval = require("./create_timerange_with_interval");

var _serialized_query = require("../../../utils/serialized_query");

var _transform_snapshot_metrics_to_metrics_api_metrics = require("./transform_snapshot_metrics_to_metrics_api_metrics");

var _constants2 = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const transformRequestToMetricsAPIRequest = async ({
  client,
  source,
  snapshotRequest,
  compositeSize,
  sourceOverrides
}) => {
  var _sourceOverrides$inde;

  const timeRangeWithIntervalApplied = await (0, _create_timerange_with_interval.createTimeRangeWithInterval)(client, { ...snapshotRequest,
    filterQuery: (0, _serialized_query.parseFilterQuery)(snapshotRequest.filterQuery),
    sourceConfiguration: source.configuration
  });
  const metricsApiRequest = {
    indexPattern: (_sourceOverrides$inde = sourceOverrides === null || sourceOverrides === void 0 ? void 0 : sourceOverrides.indexPattern) !== null && _sourceOverrides$inde !== void 0 ? _sourceOverrides$inde : source.configuration.metricAlias,
    timerange: {
      from: timeRangeWithIntervalApplied.from,
      to: timeRangeWithIntervalApplied.to,
      interval: timeRangeWithIntervalApplied.interval
    },
    metrics: (0, _transform_snapshot_metrics_to_metrics_api_metrics.transformSnapshotMetricsToMetricsAPIMetrics)(snapshotRequest),
    limit: snapshotRequest.overrideCompositeSize ? snapshotRequest.overrideCompositeSize : compositeSize,
    alignDataToEnd: true,
    dropPartialBuckets: true
  };
  const filters = [];
  const parsedFilters = (0, _serialized_query.parseFilterQuery)(snapshotRequest.filterQuery);

  if (parsedFilters) {
    filters.push(parsedFilters);
  }

  if (snapshotRequest.accountId) {
    filters.push({
      term: {
        'cloud.account.id': snapshotRequest.accountId
      }
    });
  }

  if (snapshotRequest.region) {
    filters.push({
      term: {
        'cloud.region': snapshotRequest.region
      }
    });
  }

  const inventoryModel = (0, _inventory_models.findInventoryModel)(snapshotRequest.nodeType);

  if (inventoryModel && inventoryModel.nodeFilter) {
    var _inventoryModel$nodeF;

    (_inventoryModel$nodeF = inventoryModel.nodeFilter) === null || _inventoryModel$nodeF === void 0 ? void 0 : _inventoryModel$nodeF.forEach(f => filters.push(f));
  }

  const inventoryFields = (0, _inventory_models.findInventoryFields)(snapshotRequest.nodeType);

  if (snapshotRequest.groupBy) {
    const groupBy = snapshotRequest.groupBy.map(g => g.field).filter(Boolean);
    metricsApiRequest.groupBy = [...groupBy, inventoryFields.id];
  }

  const metaAggregation = {
    id: _constants2.META_KEY,
    aggregations: {
      [_constants2.META_KEY]: {
        top_metrics: {
          size: 1,
          metrics: [{
            field: inventoryFields.name
          }],
          sort: {
            [_constants.TIMESTAMP_FIELD]: 'desc'
          }
        }
      }
    }
  };

  if (inventoryFields.ip) {
    metaAggregation.aggregations[_constants2.META_KEY].top_metrics.metrics.push({
      field: inventoryFields.ip
    });
  }

  metricsApiRequest.metrics.push(metaAggregation);

  if (filters.length) {
    metricsApiRequest.filters = filters;
  }

  return metricsApiRequest;
};

exports.transformRequestToMetricsAPIRequest = transformRequestToMetricsAPIRequest;