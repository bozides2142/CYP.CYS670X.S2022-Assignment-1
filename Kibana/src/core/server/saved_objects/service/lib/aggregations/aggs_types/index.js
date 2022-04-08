"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aggregationSchemas = void 0;

var _bucket_aggs = require("./bucket_aggs");

var _metrics_aggs = require("./metrics_aggs");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const aggregationSchemas = { ..._metrics_aggs.metricsAggsSchemas,
  ..._bucket_aggs.bucketAggsSchemas
};
exports.aggregationSchemas = aggregationSchemas;