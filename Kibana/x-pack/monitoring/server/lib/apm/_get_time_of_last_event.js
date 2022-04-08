"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTimeOfLastEvent = getTimeOfLastEvent;

var _create_apm_query = require("./create_apm_query");

var _metrics = require("../metrics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getTimeOfLastEvent({
  req,
  callWithRequest,
  apmIndexPattern,
  start,
  end,
  clusterUuid
}) {
  var _response$hits, _response$hits$hits$, _response$hits2, _response$hits2$hits$, _response$hits2$hits$2, _response$hits3, _response$hits3$hits$;

  const params = {
    index: apmIndexPattern,
    size: 1,
    ignore_unavailable: true,
    body: {
      _source: ['beats_stats.timestamp', '@timestamp'],
      sort: [{
        timestamp: {
          order: 'desc',
          unmapped_type: 'long'
        }
      }],
      query: (0, _create_apm_query.createApmQuery)({
        start,
        end,
        clusterUuid,
        metric: _metrics.ApmClusterMetric.getMetricFields(),
        filters: [{
          range: {
            'beats_stats.metrics.libbeat.output.events.acked': {
              gt: 0
            }
          }
        }]
      })
    }
  };
  const response = await callWithRequest(req, 'search', params);
  return (_response$hits = response.hits) !== null && _response$hits !== void 0 && _response$hits.hits.length ? (_response$hits$hits$ = (_response$hits2 = response.hits) === null || _response$hits2 === void 0 ? void 0 : (_response$hits2$hits$ = _response$hits2.hits[0]) === null || _response$hits2$hits$ === void 0 ? void 0 : (_response$hits2$hits$2 = _response$hits2$hits$._source.beats_stats) === null || _response$hits2$hits$2 === void 0 ? void 0 : _response$hits2$hits$2.timestamp) !== null && _response$hits$hits$ !== void 0 ? _response$hits$hits$ : (_response$hits3 = response.hits) === null || _response$hits3 === void 0 ? void 0 : (_response$hits3$hits$ = _response$hits3.hits[0]) === null || _response$hits3$hits$ === void 0 ? void 0 : _response$hits3$hits$._source['@timestamp'] : undefined;
}