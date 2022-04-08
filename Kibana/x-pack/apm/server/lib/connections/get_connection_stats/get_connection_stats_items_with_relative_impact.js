"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getConnectionStatsItemsWithRelativeImpact = getConnectionStatsItemsWithRelativeImpact;

var _is_finite_number = require("../../../../common/utils/is_finite_number");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getConnectionStatsItemsWithRelativeImpact(items) {
  const latencySums = items.map(({
    stats
  }) => {
    var _stats$latency$value, _stats$throughput$val;

    return ((_stats$latency$value = stats.latency.value) !== null && _stats$latency$value !== void 0 ? _stats$latency$value : 0) * ((_stats$throughput$val = stats.throughput.value) !== null && _stats$throughput$val !== void 0 ? _stats$throughput$val : 0);
  }).filter(_is_finite_number.isFiniteNumber);
  const minLatencySum = Math.min(...latencySums);
  const maxLatencySum = Math.max(...latencySums);
  const itemsWithImpact = items.map(item => {
    const {
      stats
    } = item;
    const impact = (0, _is_finite_number.isFiniteNumber)(stats.latency.value) && (0, _is_finite_number.isFiniteNumber)(stats.throughput.value) ? (stats.latency.value * stats.throughput.value - minLatencySum) / (maxLatencySum - minLatencySum) * 100 : 0;
    return { ...item,
      stats: { ...stats,
        impact
      }
    };
  });
  return itemsWithImpact;
}