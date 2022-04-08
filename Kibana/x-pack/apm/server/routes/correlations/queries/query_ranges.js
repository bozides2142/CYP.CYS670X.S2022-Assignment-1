"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTransactionDurationRangesRequest = exports.fetchTransactionDurationRanges = void 0;

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _get_query_with_params = require("./get_query_with_params");

var _get_request_base = require("./get_request_base");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getTransactionDurationRangesRequest = (params, rangesSteps, termFilters) => {
  const query = (0, _get_query_with_params.getQueryWithParams)({
    params,
    termFilters
  });
  const ranges = rangesSteps.reduce((p, to) => {
    const from = p[p.length - 1].to;
    p.push({
      from,
      to
    });
    return p;
  }, [{
    to: 0
  }]);

  if (ranges.length > 0) {
    ranges.push({
      from: ranges[ranges.length - 1].to
    });
  }

  return { ...(0, _get_request_base.getRequestBase)(params),
    body: {
      query,
      size: 0,
      aggs: {
        logspace_ranges: {
          range: {
            field: _elasticsearch_fieldnames.TRANSACTION_DURATION,
            ranges
          }
        }
      }
    }
  };
};

exports.getTransactionDurationRangesRequest = getTransactionDurationRangesRequest;

const fetchTransactionDurationRanges = async (esClient, params, rangesSteps, termFilters) => {
  const resp = await esClient.search(getTransactionDurationRangesRequest(params, rangesSteps, termFilters));

  if (resp.body.aggregations === undefined) {
    throw new Error('fetchTransactionDurationCorrelation failed, did not return aggregations.');
  }

  return resp.body.aggregations.logspace_ranges.buckets.map(d => ({
    key: d.from,
    doc_count: d.doc_count
  })).filter(d => d.key !== undefined);
};

exports.fetchTransactionDurationRanges = fetchTransactionDurationRanges;