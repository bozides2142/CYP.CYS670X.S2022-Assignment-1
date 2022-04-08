"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEnterpriseSearchQuery = createEnterpriseSearchQuery;

var _metrics = require("../metrics");

var _create_query = require("../create_query");

var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * {@code createQuery} for all Enterprise Search instances.
 *
 * @param {Object} options The options to pass to {@code createQuery}
 */


function createEnterpriseSearchQuery(options) {
  const opts = {
    filters: [],
    metric: _metrics.EnterpriseSearchMetric.getMetricFields(),
    clusterUuid: _constants.STANDALONE_CLUSTER_CLUSTER_UUID,
    // This is to disable the stack monitoring clusterUuid filter
    ...(options !== null && options !== void 0 ? options : {})
  };
  opts.filters.push({
    bool: {
      should: [{
        term: {
          type: 'health'
        }
      }, {
        term: {
          type: 'stats'
        }
      }, {
        term: {
          'metricset.name': 'health'
        }
      }, {
        term: {
          'metricset.name': 'stats'
        }
      }, {
        term: {
          'event.dataset': 'enterprisesearch.health'
        }
      }, {
        term: {
          'event.dataset': 'enterprisesearch.stats'
        }
      }]
    }
  });
  return (0, _create_query.createQuery)(opts);
}