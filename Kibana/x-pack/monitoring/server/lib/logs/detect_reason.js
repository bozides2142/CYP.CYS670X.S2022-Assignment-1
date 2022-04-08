"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.detectReason = detectReason;

var _create_query = require("../create_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function doesFilebeatIndexExist(req, filebeatIndexPattern, {
  start,
  end,
  clusterUuid,
  nodeUuid,
  indexUuid
}) {
  var _indexPatternExistsRe, _indexPatternExistsRe2, _indexPatternExistsIn, _indexPatternExistsIn2, _typeExistsAtAnyTimeR, _typeExistsAtAnyTimeR2, _typeExistsResponse$h, _typeExistsResponse$h2, _usingStructuredLogsR, _usingStructuredLogsR2, _clusterExistsRespons, _clusterExistsRespons2, _nodeExistsResponse$h, _nodeExistsResponse$h2, _indexExistsResponse$, _indexExistsResponse$2;

  const metric = {
    timestampField: '@timestamp'
  };
  const filter = [(0, _create_query.createTimeFilter)({
    start,
    end,
    metric
  })];
  const typeFilter = {
    term: {
      'service.type': 'elasticsearch'
    }
  };
  const structuredLogsFilter = {
    exists: {
      field: 'elasticsearch.cluster'
    }
  };
  const clusterFilter = {
    term: {
      'elasticsearch.cluster.uuid': clusterUuid
    }
  };
  const nodeFilter = {
    term: {
      'elasticsearch.node.id': nodeUuid
    }
  };
  const indexFilter = {
    term: {
      'elasticsearch.index.name': indexUuid
    }
  };
  const indexPatternExistsQuery = {
    query: {
      bool: {
        filter
      }
    }
  };
  const typeExistsAtAnyTimeQuery = {
    query: {
      bool: {
        filter: [typeFilter]
      }
    }
  };
  const typeExistsQuery = {
    query: {
      bool: {
        filter: [...filter, typeFilter]
      }
    }
  };
  const usingStructuredLogsQuery = {
    query: {
      bool: {
        filter: [...filter, typeFilter, structuredLogsFilter]
      }
    }
  };
  const clusterExistsQuery = {
    query: {
      bool: {
        filter: [...filter, typeFilter, clusterFilter]
      }
    }
  };
  const nodeExistsQuery = {
    query: {
      bool: {
        filter: [...filter, typeFilter, clusterFilter, nodeFilter]
      }
    }
  };
  const indexExistsQuery = {
    query: {
      bool: {
        filter: [...filter, typeFilter, clusterFilter, indexFilter]
      }
    }
  };
  const defaultParams = {
    size: 0
  };
  const body = [{
    index: filebeatIndexPattern
  }, { ...defaultParams
  }, {
    index: filebeatIndexPattern
  }, { ...defaultParams,
    ...indexPatternExistsQuery
  }, {
    index: filebeatIndexPattern
  }, { ...defaultParams,
    ...typeExistsAtAnyTimeQuery
  }, {
    index: filebeatIndexPattern
  }, { ...defaultParams,
    ...typeExistsQuery
  }, {
    index: filebeatIndexPattern
  }, { ...defaultParams,
    ...usingStructuredLogsQuery
  }];

  if (clusterUuid) {
    body.push(...[{
      index: filebeatIndexPattern
    }, { ...defaultParams,
      ...clusterExistsQuery
    }]);
  }

  if (nodeUuid) {
    body.push(...[{
      index: filebeatIndexPattern
    }, { ...defaultParams,
      ...nodeExistsQuery
    }]);
  }

  if (indexUuid) {
    body.push(...[{
      index: filebeatIndexPattern
    }, { ...defaultParams,
      ...indexExistsQuery
    }]);
  }

  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  const {
    responses: [indexPatternExistsResponse, indexPatternExistsInTimeRangeResponse, typeExistsAtAnyTimeResponse, typeExistsResponse, usingStructuredLogsResponse, clusterExistsResponse, nodeExistsResponse, indexExistsResponse]
  } = await callWithRequest(req, 'msearch', {
    body
  });
  return {
    indexPatternExists: ((_indexPatternExistsRe = indexPatternExistsResponse === null || indexPatternExistsResponse === void 0 ? void 0 : (_indexPatternExistsRe2 = indexPatternExistsResponse.hits) === null || _indexPatternExistsRe2 === void 0 ? void 0 : _indexPatternExistsRe2.total.value) !== null && _indexPatternExistsRe !== void 0 ? _indexPatternExistsRe : 0) > 0,
    indexPatternInTimeRangeExists: ((_indexPatternExistsIn = indexPatternExistsInTimeRangeResponse === null || indexPatternExistsInTimeRangeResponse === void 0 ? void 0 : (_indexPatternExistsIn2 = indexPatternExistsInTimeRangeResponse.hits) === null || _indexPatternExistsIn2 === void 0 ? void 0 : _indexPatternExistsIn2.total.value) !== null && _indexPatternExistsIn !== void 0 ? _indexPatternExistsIn : 0) > 0,
    typeExistsAtAnyTime: ((_typeExistsAtAnyTimeR = typeExistsAtAnyTimeResponse === null || typeExistsAtAnyTimeResponse === void 0 ? void 0 : (_typeExistsAtAnyTimeR2 = typeExistsAtAnyTimeResponse.hits) === null || _typeExistsAtAnyTimeR2 === void 0 ? void 0 : _typeExistsAtAnyTimeR2.total.value) !== null && _typeExistsAtAnyTimeR !== void 0 ? _typeExistsAtAnyTimeR : 0) > 0,
    typeExists: ((_typeExistsResponse$h = typeExistsResponse === null || typeExistsResponse === void 0 ? void 0 : (_typeExistsResponse$h2 = typeExistsResponse.hits) === null || _typeExistsResponse$h2 === void 0 ? void 0 : _typeExistsResponse$h2.total.value) !== null && _typeExistsResponse$h !== void 0 ? _typeExistsResponse$h : 0) > 0,
    usingStructuredLogs: ((_usingStructuredLogsR = usingStructuredLogsResponse === null || usingStructuredLogsResponse === void 0 ? void 0 : (_usingStructuredLogsR2 = usingStructuredLogsResponse.hits) === null || _usingStructuredLogsR2 === void 0 ? void 0 : _usingStructuredLogsR2.total.value) !== null && _usingStructuredLogsR !== void 0 ? _usingStructuredLogsR : 0) > 0,
    clusterExists: clusterUuid ? ((_clusterExistsRespons = clusterExistsResponse === null || clusterExistsResponse === void 0 ? void 0 : (_clusterExistsRespons2 = clusterExistsResponse.hits) === null || _clusterExistsRespons2 === void 0 ? void 0 : _clusterExistsRespons2.total.value) !== null && _clusterExistsRespons !== void 0 ? _clusterExistsRespons : 0) > 0 : null,
    nodeExists: nodeUuid ? ((_nodeExistsResponse$h = nodeExistsResponse === null || nodeExistsResponse === void 0 ? void 0 : (_nodeExistsResponse$h2 = nodeExistsResponse.hits) === null || _nodeExistsResponse$h2 === void 0 ? void 0 : _nodeExistsResponse$h2.total.value) !== null && _nodeExistsResponse$h !== void 0 ? _nodeExistsResponse$h : 0) > 0 : null,
    indexExists: indexUuid ? ((_indexExistsResponse$ = indexExistsResponse === null || indexExistsResponse === void 0 ? void 0 : (_indexExistsResponse$2 = indexExistsResponse.hits) === null || _indexExistsResponse$2 === void 0 ? void 0 : _indexExistsResponse$2.total.value) !== null && _indexExistsResponse$ !== void 0 ? _indexExistsResponse$ : 0) > 0 : null
  };
}

async function detectReason(req, filebeatIndexPattern, opts) {
  return await doesFilebeatIndexExist(req, filebeatIndexPattern, opts);
}