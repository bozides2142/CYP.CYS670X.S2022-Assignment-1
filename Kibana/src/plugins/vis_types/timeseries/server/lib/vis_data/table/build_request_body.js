"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildTableRequest = buildTableRequest;

var _build_processor_function = require("../build_processor_function");

var _table = require("../request_processors/table");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function buildTableRequest(params) {
  const processor = (0, _build_processor_function.buildProcessorFunction)([_table.query, _table.pivot, _table.splitByTerms, _table.dateHistogram, _table.metricBuckets, _table.siblingBuckets, _table.filterRatios, _table.positiveRate, _table.applyFilters, _table.normalizeQuery], params);
  return processor({});
}