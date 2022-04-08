"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TopNodesTimeseriesRowRT = exports.TopNodesSeriesRT = exports.TopNodesResponseRT = exports.TopNodesRequestRT = exports.OverviewResponseRT = exports.OverviewRequestRT = exports.OverviewMetricTypeRT = exports.OverviewMetricRT = void 0;

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


const OverviewMetricTypeRT = rt.keyof({
  percent: null,
  number: null,
  bytesPerSecond: null
});
exports.OverviewMetricTypeRT = OverviewMetricTypeRT;
const OverviewMetricRT = rt.type({
  type: rt.string,
  value: rt.number
});
exports.OverviewMetricRT = OverviewMetricRT;
const OverviewResponseRT = rt.type({
  stats: rt.type({
    hosts: OverviewMetricRT,
    cpu: OverviewMetricRT,
    memory: OverviewMetricRT
  })
});
exports.OverviewResponseRT = OverviewResponseRT;
const OverviewRequestRT = rt.type({
  sourceId: rt.string,
  timerange: rt.type({
    from: rt.number,
    to: rt.number
  })
});
exports.OverviewRequestRT = OverviewRequestRT;
const TopNodesRequestRT = rt.intersection([rt.type({
  sourceId: rt.string,
  size: rt.number,
  bucketSize: rt.string,
  timerange: rt.type({
    from: rt.number,
    to: rt.number
  })
}), rt.partial({
  sort: rt.string,
  sortDirection: rt.string
})]);
exports.TopNodesRequestRT = TopNodesRequestRT;
const numberOrNullRT = rt.union([rt.number, rt.null]);
const stringOrNullRT = rt.union([rt.string, rt.null]);
const TopNodesTimeseriesRowRT = rt.type({
  timestamp: rt.number,
  cpu: numberOrNullRT,
  iowait: numberOrNullRT,
  load: numberOrNullRT,
  rx: numberOrNullRT,
  tx: numberOrNullRT
});
exports.TopNodesTimeseriesRowRT = TopNodesTimeseriesRowRT;
const TopNodesSeriesRT = rt.type({
  id: rt.string,
  name: stringOrNullRT,
  platform: stringOrNullRT,
  provider: stringOrNullRT,
  cpu: numberOrNullRT,
  iowait: numberOrNullRT,
  load: numberOrNullRT,
  uptime: numberOrNullRT,
  rx: numberOrNullRT,
  tx: numberOrNullRT,
  timeseries: rt.array(TopNodesTimeseriesRowRT)
});
exports.TopNodesSeriesRT = TopNodesSeriesRT;
const TopNodesResponseRT = rt.type({
  series: rt.array(TopNodesSeriesRT)
});
exports.TopNodesResponseRT = TopNodesResponseRT;