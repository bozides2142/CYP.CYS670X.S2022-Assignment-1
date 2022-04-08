"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLogTypes = getLogTypes;

var _error_missing_required = require("../error_missing_required");

var _create_query = require("../create_query");

var _detect_reason = require("./detect_reason");

var _detect_reason_from_exception = require("./detect_reason_from_exception");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function handleResponse(response, req, filebeatIndexPattern, opts) {
  var _response$aggregation, _response$aggregation2, _response$aggregation3;

  const result = {
    enabled: false,
    types: []
  };
  const typeBuckets = (_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : (_response$aggregation3 = _response$aggregation2.types) === null || _response$aggregation3 === void 0 ? void 0 : _response$aggregation3.buckets) !== null && _response$aggregation !== void 0 ? _response$aggregation : [];

  if (typeBuckets.length) {
    result.enabled = true;
    result.types = typeBuckets.map(typeBucket => {
      return {
        type: typeBucket.key.split('.')[1],
        levels: typeBucket.levels.buckets.map(levelBucket => {
          return {
            level: levelBucket.key.toLowerCase(),
            count: levelBucket.doc_count
          };
        })
      };
    });
  } else {
    result.reason = await (0, _detect_reason.detectReason)(req, filebeatIndexPattern, opts);
  }

  return result;
}

async function getLogTypes(req, filebeatIndexPattern, {
  clusterUuid,
  nodeUuid,
  indexUuid,
  start,
  end
}) {
  (0, _error_missing_required.checkParam)(filebeatIndexPattern, 'filebeatIndexPattern in logs/getLogTypes');
  const metric = {
    timestampField: '@timestamp'
  };
  const filter = [{
    term: {
      'service.type': 'elasticsearch'
    }
  }, (0, _create_query.createTimeFilter)({
    start,
    end,
    metric
  })];

  if (clusterUuid) {
    filter.push({
      term: {
        'elasticsearch.cluster.uuid': clusterUuid
      }
    });
  }

  if (nodeUuid) {
    filter.push({
      term: {
        'elasticsearch.node.id': nodeUuid
      }
    });
  }

  if (indexUuid) {
    filter.push({
      term: {
        'elasticsearch.index.name': indexUuid
      }
    });
  }

  const params = {
    index: filebeatIndexPattern,
    size: 0,
    filter_path: ['aggregations.levels.buckets', 'aggregations.types.buckets'],
    ignore_unavailable: true,
    body: {
      sort: {
        '@timestamp': {
          order: 'desc',
          unmapped_type: 'long'
        }
      },
      query: {
        bool: {
          filter
        }
      },
      aggs: {
        types: {
          terms: {
            field: 'event.dataset'
          },
          aggs: {
            levels: {
              terms: {
                field: 'log.level'
              }
            }
          }
        }
      }
    }
  };
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  let result = {
    enabled: false,
    types: []
  };

  try {
    const response = await callWithRequest(req, 'search', params);
    result = await handleResponse(response, req, filebeatIndexPattern, {
      clusterUuid,
      nodeUuid,
      indexUuid,
      start,
      end
    });
  } catch (err) {
    result.reason = (0, _detect_reason_from_exception.detectReasonFromException)(err);
  }

  return result;
}