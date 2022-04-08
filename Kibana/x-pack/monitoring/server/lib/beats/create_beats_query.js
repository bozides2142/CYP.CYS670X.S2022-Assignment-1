"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createBeatsQuery = createBeatsQuery;

var _metrics = require("../metrics");

var _create_query = require("../create_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * {@code createQuery} for all Beats instances.
 *
 * This helps to future proof Beats Monitoring by explicitly excluding APM Server from the Beats monitoring metrics
 * so that its stats do not propagate there and the forthcoming APM Server monitoring pages.
 *
 * @param {Object} options The options to pass to {@code createQuery}
 */


function createBeatsQuery(options) {
  const opts = {
    moduleType: 'beats',
    filters: [],
    metric: _metrics.BeatsMetric.getMetricFields(),
    type: 'beats_stats',
    metricset: 'stats',
    dsDataset: 'beats.stats',
    ...(options !== null && options !== void 0 ? options : {})
  }; // avoid showing APM Server stats alongside other Beats because APM Server will have its own UI

  opts.filters.push({
    bool: {
      must_not: {
        term: {
          'beats_stats.beat.type': 'apm-server'
        }
      }
    }
  });
  return (0, _create_query.createQuery)(opts);
}