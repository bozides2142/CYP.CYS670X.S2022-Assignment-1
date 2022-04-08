"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getConnectionStats = getConnectionStats;

var _lodash = require("lodash");

var _join_by_key = require("../../../../common/utils/join_by_key");

var _get_stats = require("./get_stats");

var _get_destination_map = require("./get_destination_map");

var _calculate_throughput = require("../../helpers/calculate_throughput");

var _with_apm_span = require("../../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getConnectionStats({
  setup,
  start,
  end,
  numBuckets,
  filter,
  collapseBy,
  offset
}) {
  return (0, _with_apm_span.withApmSpan)('get_connection_stats_and_map', async () => {
    const [allMetrics, destinationMap] = await Promise.all([(0, _get_stats.getStats)({
      setup,
      start,
      end,
      filter,
      numBuckets,
      offset
    }), (0, _get_destination_map.getDestinationMap)({
      setup,
      start,
      end,
      filter,
      offset
    })]);
    const statsWithLocationIds = allMetrics.map(statsItem => {
      var _destinationMap$get;

      const {
        from,
        timeseries,
        value
      } = statsItem;
      const to = (_destinationMap$get = destinationMap.get(statsItem.to.backendName)) !== null && _destinationMap$get !== void 0 ? _destinationMap$get : statsItem.to;
      const location = collapseBy === 'upstream' ? from : to;
      return {
        location,
        stats: [{
          timeseries,
          value
        }],
        id: location.id
      };
    }, []);
    const statsJoinedById = (0, _join_by_key.joinByKey)(statsWithLocationIds, 'id', (a, b) => {
      const {
        stats: statsA,
        ...itemA
      } = a;
      const {
        stats: statsB,
        ...itemB
      } = b;
      return (0, _lodash.merge)({}, itemA, itemB, {
        stats: statsA.concat(statsB)
      });
    });
    const statsItems = statsJoinedById.map(item => {
      var _mergedStats$value$er;

      const mergedStats = item.stats.reduce((prev, current) => {
        return {
          value: {
            count: prev.value.count + current.value.count,
            latency_sum: prev.value.latency_sum + current.value.latency_sum,
            error_count: prev.value.error_count + current.value.error_count
          },
          timeseries: (0, _join_by_key.joinByKey)([...prev.timeseries, ...current.timeseries], 'x', (a, b) => ({
            x: a.x,
            count: a.count + b.count,
            latency_sum: a.latency_sum + b.latency_sum,
            error_count: a.error_count + b.error_count
          }))
        };
      }, {
        value: {
          count: 0,
          latency_sum: 0,
          error_count: 0
        },
        timeseries: []
      });
      const destStats = {
        latency: {
          value: mergedStats.value.count > 0 ? mergedStats.value.latency_sum / mergedStats.value.count : null,
          timeseries: mergedStats.timeseries.map(point => ({
            x: point.x,
            y: point.count > 0 ? point.latency_sum / point.count : null
          }))
        },
        totalTime: {
          value: mergedStats.value.latency_sum,
          timeseries: mergedStats.timeseries.map(point => ({
            x: point.x,
            y: point.latency_sum
          }))
        },
        throughput: {
          value: mergedStats.value.count > 0 ? (0, _calculate_throughput.calculateThroughput)({
            start,
            end,
            value: mergedStats.value.count
          }) : null,
          timeseries: mergedStats.timeseries.map(point => ({
            x: point.x,
            y: point.count > 0 ? (0, _calculate_throughput.calculateThroughput)({
              start,
              end,
              value: point.count
            }) : null
          }))
        },
        errorRate: {
          value: mergedStats.value.count > 0 ? ((_mergedStats$value$er = mergedStats.value.error_count) !== null && _mergedStats$value$er !== void 0 ? _mergedStats$value$er : 0) / mergedStats.value.count : null,
          timeseries: mergedStats.timeseries.map(point => {
            var _point$error_count;

            return {
              x: point.x,
              y: point.count > 0 ? ((_point$error_count = point.error_count) !== null && _point$error_count !== void 0 ? _point$error_count : 0) / point.count : null
            };
          })
        }
      };
      return { ...item,
        stats: destStats
      };
    });
    return statsItems;
  });
}