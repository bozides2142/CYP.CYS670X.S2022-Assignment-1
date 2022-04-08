"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SearchSessionStatus = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
let SearchSessionStatus;
exports.SearchSessionStatus = SearchSessionStatus;

(function (SearchSessionStatus) {
  SearchSessionStatus["IN_PROGRESS"] = "in_progress";
  SearchSessionStatus["ERROR"] = "error";
  SearchSessionStatus["COMPLETE"] = "complete";
  SearchSessionStatus["CANCELLED"] = "cancelled";
  SearchSessionStatus["EXPIRED"] = "expired";
})(SearchSessionStatus || (exports.SearchSessionStatus = SearchSessionStatus = {}));