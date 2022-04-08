"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEcsOpsMetricsLog = getEcsOpsMetricsLog;

var _numeral = _interopRequireDefault(require("@elastic/numeral"));

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Converts ops metrics into ECS-compliant `LogMeta` for logging
 *
 * @internal
 */
function getEcsOpsMetricsLog(metrics) {
  var _process$memory, _process$memory$heap, _process$event_loop_d, _os$load;

  const {
    process,
    os
  } = metrics;
  const processMemoryUsedInBytes = process === null || process === void 0 ? void 0 : (_process$memory = process.memory) === null || _process$memory === void 0 ? void 0 : (_process$memory$heap = _process$memory.heap) === null || _process$memory$heap === void 0 ? void 0 : _process$memory$heap.used_in_bytes;
  const processMemoryUsedInBytesMsg = processMemoryUsedInBytes ? `memory: ${(0, _numeral.default)(processMemoryUsedInBytes).format('0.0b')} ` : ''; // ECS process.uptime is in seconds:

  const uptimeVal = process !== null && process !== void 0 && process.uptime_in_millis ? Math.floor(process.uptime_in_millis / 1000) : undefined; // HH:mm:ss message format for backward compatibility

  const uptimeValMsg = uptimeVal ? `uptime: ${(0, _numeral.default)(uptimeVal).format('00:00:00')} ` : ''; // Event loop delay metrics are in ms

  const eventLoopDelayVal = process === null || process === void 0 ? void 0 : process.event_loop_delay;
  const eventLoopDelayValMsg = eventLoopDelayVal ? `mean delay: ${(0, _numeral.default)(process === null || process === void 0 ? void 0 : process.event_loop_delay).format('0.000')}` : '';
  const eventLoopDelayPercentiles = process === null || process === void 0 ? void 0 : (_process$event_loop_d = process.event_loop_delay_histogram) === null || _process$event_loop_d === void 0 ? void 0 : _process$event_loop_d.percentiles; // Extract 50th, 95th and 99th percentiles for log meta

  const eventLoopDelayHistVals = eventLoopDelayPercentiles ? {
    50: eventLoopDelayPercentiles[50],
    95: eventLoopDelayPercentiles[95],
    99: eventLoopDelayPercentiles[99]
  } : undefined; // Format message from 50th, 95th and 99th percentiles

  const eventLoopDelayHistMsg = eventLoopDelayPercentiles ? ` delay histogram: { 50: ${(0, _numeral.default)(eventLoopDelayPercentiles['50']).format('0.000')}; 95: ${(0, _numeral.default)(eventLoopDelayPercentiles['95']).format('0.000')}; 99: ${(0, _numeral.default)(eventLoopDelayPercentiles['99']).format('0.000')} }` : '';
  const loadEntries = {
    '1m': os !== null && os !== void 0 && os.load ? os === null || os === void 0 ? void 0 : os.load['1m'] : undefined,
    '5m': os !== null && os !== void 0 && os.load ? os === null || os === void 0 ? void 0 : os.load['5m'] : undefined,
    '15m': os !== null && os !== void 0 && os.load ? os === null || os === void 0 ? void 0 : os.load['15m'] : undefined
  };
  const loadVals = [...Object.values((_os$load = os === null || os === void 0 ? void 0 : os.load) !== null && _os$load !== void 0 ? _os$load : [])];
  const loadValsMsg = loadVals.length > 0 ? `load: [${loadVals.map(val => {
    return (0, _numeral.default)(val).format('0.00');
  })}] ` : '';
  const meta = {
    event: {
      kind: 'metric',
      category: ['process', 'host'],
      type: ['info']
    },
    process: {
      uptime: uptimeVal,
      // @ts-expect-error custom fields not yet part of ECS
      memory: {
        heap: {
          usedInBytes: processMemoryUsedInBytes
        }
      },
      eventLoopDelay: eventLoopDelayVal,
      eventLoopDelayHistogram: eventLoopDelayHistVals
    },
    host: {
      os: {
        // @ts-expect-error custom fields not yet part of ECS
        load: loadEntries
      }
    }
  };
  return {
    message: [processMemoryUsedInBytesMsg, uptimeValMsg, loadValsMsg, eventLoopDelayValMsg, eventLoopDelayHistMsg].join(''),
    meta
  };
}