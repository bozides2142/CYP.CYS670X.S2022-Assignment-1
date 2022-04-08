"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QUERY_INVALID = exports.METRIC_THRESHOLD_ALERT_TYPE_ID = exports.METRIC_INVENTORY_THRESHOLD_ALERT_TYPE_ID = exports.METRIC_ANOMALY_ALERT_TYPE_ID = exports.Comparator = exports.AlertStates = exports.Aggregators = void 0;

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


const METRIC_THRESHOLD_ALERT_TYPE_ID = 'metrics.alert.threshold';
exports.METRIC_THRESHOLD_ALERT_TYPE_ID = METRIC_THRESHOLD_ALERT_TYPE_ID;
const METRIC_INVENTORY_THRESHOLD_ALERT_TYPE_ID = 'metrics.alert.inventory.threshold';
exports.METRIC_INVENTORY_THRESHOLD_ALERT_TYPE_ID = METRIC_INVENTORY_THRESHOLD_ALERT_TYPE_ID;
const METRIC_ANOMALY_ALERT_TYPE_ID = 'metrics.alert.anomaly';
exports.METRIC_ANOMALY_ALERT_TYPE_ID = METRIC_ANOMALY_ALERT_TYPE_ID;
let Comparator;
exports.Comparator = Comparator;

(function (Comparator) {
  Comparator["GT"] = ">";
  Comparator["LT"] = "<";
  Comparator["GT_OR_EQ"] = ">=";
  Comparator["LT_OR_EQ"] = "<=";
  Comparator["BETWEEN"] = "between";
  Comparator["OUTSIDE_RANGE"] = "outside";
})(Comparator || (exports.Comparator = Comparator = {}));

let Aggregators;
exports.Aggregators = Aggregators;

(function (Aggregators) {
  Aggregators["COUNT"] = "count";
  Aggregators["AVERAGE"] = "avg";
  Aggregators["SUM"] = "sum";
  Aggregators["MIN"] = "min";
  Aggregators["MAX"] = "max";
  Aggregators["RATE"] = "rate";
  Aggregators["CARDINALITY"] = "cardinality";
  Aggregators["P95"] = "p95";
  Aggregators["P99"] = "p99";
})(Aggregators || (exports.Aggregators = Aggregators = {}));

let AlertStates;
exports.AlertStates = AlertStates;

(function (AlertStates) {
  AlertStates[AlertStates["OK"] = 0] = "OK";
  AlertStates[AlertStates["ALERT"] = 1] = "ALERT";
  AlertStates[AlertStates["WARNING"] = 2] = "WARNING";
  AlertStates[AlertStates["NO_DATA"] = 3] = "NO_DATA";
  AlertStates[AlertStates["ERROR"] = 4] = "ERROR";
})(AlertStates || (exports.AlertStates = AlertStates = {}));

const metricAnomalyNodeTypeRT = rt.union([rt.literal('hosts'), rt.literal('k8s')]);
const metricAnomalyMetricRT = rt.union([rt.literal('memory_usage'), rt.literal('network_in'), rt.literal('network_out')]);
const metricAnomalyInfluencerFilterRT = rt.type({
  fieldName: rt.string,
  fieldValue: rt.string
});
const QUERY_INVALID = Symbol('QUERY_INVALID');
exports.QUERY_INVALID = QUERY_INVALID;