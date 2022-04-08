"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getData = void 0;

var _create_request = require("./create_request");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getData = async (esClient, nodeType, metric, timerange, source, logQueryFields, compositeSize, filterQuery, customMetric, afterKey, previousNodes = {}) => {
  const handleResponse = (aggs, previous) => {
    const {
      nodes
    } = aggs;
    const nextAfterKey = nodes.after_key;

    for (const bucket of nodes.buckets) {
      var _bucket$metricId$valu, _bucket$metricId;

      const metricId = customMetric && customMetric.field ? customMetric.id : metric;
      previous[bucket.key.node] = (_bucket$metricId$valu = bucket === null || bucket === void 0 ? void 0 : (_bucket$metricId = bucket[metricId]) === null || _bucket$metricId === void 0 ? void 0 : _bucket$metricId.value) !== null && _bucket$metricId$valu !== void 0 ? _bucket$metricId$valu : null;
    }

    if (nextAfterKey && nodes.buckets.length === compositeSize) {
      return getData(esClient, nodeType, metric, timerange, source, logQueryFields, compositeSize, filterQuery, customMetric, nextAfterKey, previous);
    }

    return previous;
  };

  const index = metric === 'logRate' && logQueryFields ? logQueryFields.indexPattern : source.configuration.metricAlias;
  const request = (0, _create_request.createRequest)(index, nodeType, metric, timerange, compositeSize, afterKey, filterQuery, customMetric);
  const {
    body
  } = await esClient.search(request);

  if (body.aggregations) {
    return handleResponse(body.aggregations, previousNodes);
  }

  return previousNodes;
};

exports.getData = getData;