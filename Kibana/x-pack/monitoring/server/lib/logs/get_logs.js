"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLogs = getLogs;

var _moment = _interopRequireDefault(require("moment"));

var _error_missing_required = require("../error_missing_required");

var _create_query = require("../create_query");

var _detect_reason = require("./detect_reason");

var _format_timezone = require("../format_timezone");

var _get_timezone = require("../get_timezone");

var _detect_reason_from_exception = require("./detect_reason_from_exception");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore
// @ts-ignore
// @ts-ignore
// @ts-ignore
// @ts-ignore
// @ts-ignore


async function handleResponse(response, req, filebeatIndexPattern, opts) {
  var _response$hits$hits, _response$hits;

  const result = {
    enabled: false,
    logs: []
  };
  const timezone = await (0, _get_timezone.getTimezone)(req);
  const hits = (_response$hits$hits = (_response$hits = response.hits) === null || _response$hits === void 0 ? void 0 : _response$hits.hits) !== null && _response$hits$hits !== void 0 ? _response$hits$hits : [];

  if (hits.length) {
    result.enabled = true;
    result.logs = hits.map(hit => {
      var _source$event$dataset, _source$event, _source$elasticsearch, _source$elasticsearch2, _source$elasticsearch3, _source$elasticsearch4, _source$elasticsearch5, _source$log;

      const source = hit._source;
      const type = ((_source$event$dataset = (_source$event = source.event) === null || _source$event === void 0 ? void 0 : _source$event.dataset) !== null && _source$event$dataset !== void 0 ? _source$event$dataset : '').split('.')[1];
      const utcTimestamp = (0, _moment.default)(source['@timestamp']).valueOf();
      return {
        timestamp: (0, _format_timezone.formatUTCTimestampForTimezone)(utcTimestamp, timezone),
        component: (_source$elasticsearch = source.elasticsearch) === null || _source$elasticsearch === void 0 ? void 0 : _source$elasticsearch.component,
        node: (_source$elasticsearch2 = source.elasticsearch) === null || _source$elasticsearch2 === void 0 ? void 0 : (_source$elasticsearch3 = _source$elasticsearch2.node) === null || _source$elasticsearch3 === void 0 ? void 0 : _source$elasticsearch3.name,
        index: (_source$elasticsearch4 = source.elasticsearch) === null || _source$elasticsearch4 === void 0 ? void 0 : (_source$elasticsearch5 = _source$elasticsearch4.index) === null || _source$elasticsearch5 === void 0 ? void 0 : _source$elasticsearch5.name,
        level: (_source$log = source.log) === null || _source$log === void 0 ? void 0 : _source$log.level,
        type,
        message: source.message
      };
    });
  } else {
    result.reason = await (0, _detect_reason.detectReason)(req, filebeatIndexPattern, opts);
  }

  return result;
}

async function getLogs(config, req, filebeatIndexPattern, {
  clusterUuid,
  nodeUuid,
  indexUuid,
  start,
  end
}) {
  (0, _error_missing_required.checkParam)(filebeatIndexPattern, 'filebeatIndexPattern in logs/getLogs');
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
    size: Math.min(50, config.ui.elasticsearch.logFetchCount),
    filter_path: ['hits.hits._source.message', 'hits.hits._source.log.level', 'hits.hits._source.@timestamp', 'hits.hits._source.event.dataset', 'hits.hits._source.elasticsearch.component', 'hits.hits._source.elasticsearch.index.name', 'hits.hits._source.elasticsearch.node.name'],
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
      }
    }
  };
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  let result = {
    enabled: false,
    logs: []
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

  return { ...result,
    limit: params.size
  };
}