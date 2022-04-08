"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMlJobs = getMlJobs;
exports.getMlJobsForCluster = getMlJobsForCluster;
exports.handleResponse = handleResponse;

var _lodash = require("lodash");

var _create_query = require("../create_query");

var _metrics = require("../metrics");

var _constants = require("../../../common/constants");

var _get_index_patterns = require("../cluster/get_index_patterns");

var _static_globals = require("../../static_globals");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore
// @ts-ignore

/*
 * Get a listing of jobs along with some metric data to use for the listing
 */


function handleResponse(response) {
  var _response$hits, _hits$map;

  const hits = (_response$hits = response.hits) === null || _response$hits === void 0 ? void 0 : _response$hits.hits;
  return (_hits$map = hits === null || hits === void 0 ? void 0 : hits.map(hit => {
    var _hit$_source$job_stat, _job$node$name, _job$node, _job$node2;

    const job = (_hit$_source$job_stat = hit._source.job_stats) !== null && _hit$_source$job_stat !== void 0 ? _hit$_source$job_stat : hit._source.elasticsearch;
    return { ...job,
      node: { ...(job === null || job === void 0 ? void 0 : job.node),
        name: (_job$node$name = job === null || job === void 0 ? void 0 : (_job$node = job.node) === null || _job$node === void 0 ? void 0 : _job$node.name) !== null && _job$node$name !== void 0 ? _job$node$name : job === null || job === void 0 ? void 0 : (_job$node2 = job.node) === null || _job$node2 === void 0 ? void 0 : _job$node2.id
      }
    };
  })) !== null && _hits$map !== void 0 ? _hits$map : [];
}

function getMlJobs(req) {
  const config = req.server.config;
  const maxBucketSize = config.ui.max_bucket_size;
  const start = req.payload.timeRange.min; // no wrapping in moment :)

  const end = req.payload.timeRange.max;
  const clusterUuid = req.params.clusterUuid;

  const metric = _metrics.ElasticsearchMetric.getMetricFields();

  const dataset = 'ml_job';
  const type = 'job_stats';
  const moduleType = 'elasticsearch';
  const indexPatterns = (0, _get_index_patterns.getNewIndexPatterns)({
    config: _static_globals.Globals.app.config,
    ccs: req.payload.ccs,
    moduleType,
    dataset
  });
  const params = {
    index: indexPatterns,
    size: maxBucketSize,
    ignore_unavailable: true,
    filter_path: ['hits.hits._source.job_stats.job_id', 'hits.hits._source.elasticsearch.ml.job.id', 'hits.hits._source.job_stats.state', 'hits.hits._source.elasticsearch.ml.job.state', 'hits.hits._source.job_stats.data_counts.processed_record_count', 'hits.hits._source.elasticsearch.ml.job.data_counts.processed_record_count', 'hits.hits._source.job_stats.model_size_stats.model_bytes', 'hits.hits._source.elasticsearch.ml.job.model_size_stats.model_bytes', 'hits.hits._source.job_stats.forecasts_stats.total', 'hits.hits._source.elasticsearch.ml.job.forecasts_stats.total', 'hits.hits._source.job_stats.node.id', 'hits.hits._source.elasticsearch.node.id', 'hits.hits._source.job_stats.node.name', 'hits.hits._source.elasticsearch.node.name'],
    body: {
      sort: {
        timestamp: {
          order: 'desc',
          unmapped_type: 'long'
        }
      },
      collapse: {
        field: 'job_stats.job_id'
      },
      query: (0, _create_query.createQuery)({
        type,
        dsDataset: `${moduleType}.${dataset}`,
        metricset: dataset,
        start,
        end,
        clusterUuid,
        metric
      })
    }
  };
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  return callWithRequest(req, 'search', params).then(handleResponse);
}
/*
 * cardinality isn't guaranteed to be accurate is the issue
 * but it will be as long as the precision threshold is >= the actual value
 */


function getMlJobsForCluster(req, cluster, ccs) {
  var _ref, _cluster$license, _cluster$elasticsearc, _cluster$elasticsearc2, _cluster$elasticsearc3;

  const license = (_ref = (_cluster$license = cluster.license) !== null && _cluster$license !== void 0 ? _cluster$license : (_cluster$elasticsearc = cluster.elasticsearch) === null || _cluster$elasticsearc === void 0 ? void 0 : (_cluster$elasticsearc2 = _cluster$elasticsearc.cluster) === null || _cluster$elasticsearc2 === void 0 ? void 0 : (_cluster$elasticsearc3 = _cluster$elasticsearc2.stats) === null || _cluster$elasticsearc3 === void 0 ? void 0 : _cluster$elasticsearc3.license) !== null && _ref !== void 0 ? _ref : {};

  if (license.status === 'active' && (0, _lodash.includes)(_constants.ML_SUPPORTED_LICENSES, license.type)) {
    // ML is supported
    const start = req.payload.timeRange.min; // no wrapping in moment :)

    const end = req.payload.timeRange.max;
    const clusterUuid = req.params.clusterUuid;

    const metric = _metrics.ElasticsearchMetric.getMetricFields();

    const type = 'job_stats';
    const dataset = 'ml_job';
    const moduleType = 'elasticsearch';
    const indexPatterns = (0, _get_index_patterns.getNewIndexPatterns)({
      config: _static_globals.Globals.app.config,
      moduleType,
      dataset,
      ccs
    });
    const params = {
      index: indexPatterns,
      size: 0,
      ignore_unavailable: true,
      filter_path: 'aggregations.jobs_count.value',
      body: {
        query: (0, _create_query.createQuery)({
          type,
          dsDataset: `${moduleType}.${dataset}`,
          metricset: dataset,
          start,
          end,
          clusterUuid,
          metric
        }),
        aggs: {
          jobs_count: {
            cardinality: {
              field: 'job_stats.job_id'
            }
          }
        }
      }
    };
    const {
      callWithRequest
    } = req.server.plugins.elasticsearch.getCluster('monitoring');
    return callWithRequest(req, 'search', params).then(response => {
      var _response$aggregation, _response$aggregation2;

      return (_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.jobs_count.value) !== null && _response$aggregation !== void 0 ? _response$aggregation : 0;
    });
  } // ML is not supported


  return Promise.resolve(null);
}