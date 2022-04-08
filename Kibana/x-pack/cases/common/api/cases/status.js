"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.caseStatuses = exports.CasesStatusResponseRt = exports.CasesStatusRequestRt = exports.CaseStatuses = exports.CaseStatusRt = void 0;

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


let CaseStatuses;
exports.CaseStatuses = CaseStatuses;

(function (CaseStatuses) {
  CaseStatuses["open"] = "open";
  CaseStatuses["in-progress"] = "in-progress";
  CaseStatuses["closed"] = "closed";
})(CaseStatuses || (exports.CaseStatuses = CaseStatuses = {}));

const CaseStatusRt = rt.union([rt.literal(CaseStatuses.open), rt.literal(CaseStatuses['in-progress']), rt.literal(CaseStatuses.closed)]);
exports.CaseStatusRt = CaseStatusRt;
const caseStatuses = Object.values(CaseStatuses);
exports.caseStatuses = caseStatuses;
const CasesStatusResponseRt = rt.type({
  count_open_cases: rt.number,
  count_in_progress_cases: rt.number,
  count_closed_cases: rt.number
});
exports.CasesStatusResponseRt = CasesStatusResponseRt;
const CasesStatusRequestRt = rt.partial({
  /**
   * The owner of the cases to retrieve the status stats from. If no owner is provided the stats for all cases
   * that the user has access to will be returned.
   */
  owner: rt.union([rt.array(rt.string), rt.string])
});
exports.CasesStatusRequestRt = CasesStatusRequestRt;