"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CaseMetricsResponseRt = void 0;

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


const StatusInfoRt = rt.type({
  /**
   * Duration the case was in the open status in milliseconds
   */
  openDuration: rt.number,

  /**
   * Duration the case was in the in-progress status in milliseconds. Zero indicates the case was never in-progress.
   */
  inProgressDuration: rt.number,

  /**
   * The ISO string representation of the dates the case was reopened
   */
  reopenDates: rt.array(rt.string)
});
const AlertHostsMetricsRt = rt.type({
  /**
   * Total unique hosts represented in the alerts
   */
  total: rt.number,
  values: rt.array(rt.type({
    /**
     * Host name
     */
    name: rt.union([rt.string, rt.undefined]),

    /**
     * Unique identifier for the host
     */
    id: rt.string,

    /**
     * Number of alerts that have this particular host name
     */
    count: rt.number
  }))
});
const AlertUsersMetricsRt = rt.type({
  /**
   * Total unique users represented in the alerts
   */
  total: rt.number,
  values: rt.array(rt.type({
    /**
     * Username
     */
    name: rt.string,

    /**
     * Number of alerts that have this particular username
     */
    count: rt.number
  }))
});
const CaseMetricsResponseRt = rt.partial(rt.type({
  alerts: rt.partial(rt.type({
    /**
     * Number of alerts attached to the case
     */
    count: rt.number,

    /**
     * Host information represented from the alerts attached to this case
     */
    hosts: AlertHostsMetricsRt,

    /**
     * User information represented from the alerts attached to this case
     */
    users: AlertUsersMetricsRt
  }).props),

  /**
   * External connectors associated with the case
   */
  connectors: rt.type({
    /**
     * Total number of connectors in the case
     */
    total: rt.number
  }),

  /**
   * Actions taken within the case
   */
  actions: rt.partial(rt.type({
    isolateHost: rt.type({
      /**
       * Isolate host action information
       */
      isolate: rt.type({
        /**
         * Total times the isolate host action has been performed
         */
        total: rt.number
      }),

      /**
       * Unisolate host action information
       */
      unisolate: rt.type({
        /**
         * Total times the unisolate host action has been performed
         */
        total: rt.number
      })
    })
  }).props),

  /**
   * The case's open,close,in-progress details
   */
  lifespan: rt.type({
    /**
     * Date the case was created, in ISO format
     */
    creationDate: rt.string,

    /**
     * Date the case was closed, in ISO format. Will be null if the case is not currently closed
     */
    closeDate: rt.union([rt.string, rt.null]),

    /**
     * The case's status information regarding durations in a specific status
     */
    statusInfo: StatusInfoRt
  })
}).props);
exports.CaseMetricsResponseRt = CaseMetricsResponseRt;