"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasStandaloneClusters = hasStandaloneClusters;

var _moment = _interopRequireDefault(require("moment"));

var _lodash = require("lodash");

var _ = require("./");

var _static_globals = require("../../static_globals");

var _get_index_patterns = require("../cluster/get_index_patterns");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function hasStandaloneClusters(req, ccs) {
  const lsIndexPatterns = (0, _get_index_patterns.getNewIndexPatterns)({
    config: _static_globals.Globals.app.config,
    moduleType: 'logstash',
    ccs
  }); // use legacy because no integration exists for beats

  const beatsIndexPatterns = (0, _get_index_patterns.getLegacyIndexPattern)({
    moduleType: 'beats',
    config: _static_globals.Globals.app.config,
    ccs
  });
  const indexPatterns = [lsIndexPatterns, beatsIndexPatterns];
  const indexPatternList = indexPatterns.reduce((list, patterns) => {
    list.push(...patterns.split(','));
    return list;
  }, []);
  const filters = [_.standaloneClusterFilter, {
    bool: {
      should: [{
        terms: {
          type: ['logstash_stats', 'logstash_state', 'beats_stats', 'beats_state']
        }
      }, {
        terms: {
          'metricset.name': ['node', 'node_stats', 'stats', 'state']
        }
      }, {
        terms: {
          'data_stream.dataset': ['node', 'node_stats', 'stats', 'state']
        }
      }]
    }
  }]; // Not every page will contain a time range so check for that

  if (req.payload.timeRange) {
    const start = req.payload.timeRange.min;
    const end = req.payload.timeRange.max;
    const timeRangeFilter = {
      range: {
        timestamp: {
          format: 'epoch_millis'
        }
      }
    };

    if (start) {
      timeRangeFilter.range.timestamp.gte = _moment.default.utc(start).valueOf();
    }

    if (end) {
      timeRangeFilter.range.timestamp.lte = _moment.default.utc(end).valueOf();
    }

    filters.push(timeRangeFilter);
  }

  const params = {
    index: indexPatternList,
    body: {
      size: 0,
      terminate_after: 1,
      query: {
        bool: {
          filter: filters
        }
      }
    }
  };
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  const response = await callWithRequest(req, 'search', params);

  if (response && response.hits) {
    return (0, _lodash.get)(response, 'hits.total.value', 0) > 0;
  }

  return false;
}