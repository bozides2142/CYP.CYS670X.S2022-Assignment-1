"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createApmQuery = createApmQuery;

var _metrics = require("../metrics");

var _create_query = require("../create_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * {@code createQuery} for all APM instances.
 *
 * @param {Object} options The options to pass to {@code createQuery}
 */


function createApmQuery(options) {
  const opts = {
    filters: [],
    metric: _metrics.ApmMetric.getMetricFields(),
    type: 'beats_stats',
    metricset: 'stats',
    dsDataset: 'beats.stats',
    ...(options !== null && options !== void 0 ? options : {})
  };
  opts.filters.push({
    bool: {
      must: {
        term: {
          'beats_stats.beat.type': 'apm-server'
        }
      }
    }
  });
  return (0, _create_query.createQuery)(opts);
}