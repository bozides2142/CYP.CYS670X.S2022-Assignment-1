"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchLicenses = fetchLicenses;
exports.getLicenses = getLicenses;
exports.handleLicenses = handleLicenses;

var _constants = require("../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Get statistics for all selected Elasticsearch clusters.
 */


async function getLicenses(clusterUuids, callCluster, timestamp, maxBucketSize) {
  const response = await fetchLicenses(callCluster, clusterUuids, timestamp, maxBucketSize);
  return handleLicenses(response);
}
/**
 * Fetch the Elasticsearch stats.
 *
 * @param {Object} server The server instance
 * @param {function} callCluster The callWithRequest or callWithInternalUser handler
 * @param {Array} clusterUuids Cluster UUIDs to limit the request against
 *
 * Returns the response for the aggregations to fetch details for the product.
 */


async function fetchLicenses(callCluster, clusterUuids, timestamp, maxBucketSize) {
  const params = {
    index: _constants.INDEX_PATTERN_ELASTICSEARCH,
    size: maxBucketSize,
    ignore_unavailable: true,
    filter_path: ['hits.hits._source.cluster_uuid', 'hits.hits._source.license'],
    body: {
      query: {
        bool: {
          filter: [
          /*
           * Note: Unlike most places, we don't care about the old _type: cluster_stats because it would NOT
           * have the license in it (that used to be in the .monitoring-data-2 index in cluster_info)
           */
          {
            term: {
              type: 'cluster_stats'
            }
          }, {
            terms: {
              cluster_uuid: clusterUuids
            }
          }, {
            range: {
              timestamp: {
                format: 'epoch_millis',
                gte: timestamp - _constants.USAGE_FETCH_INTERVAL,
                lte: timestamp
              }
            }
          }]
        }
      },
      collapse: {
        field: 'cluster_uuid'
      },
      sort: {
        timestamp: {
          order: 'desc',
          unmapped_type: 'long'
        }
      }
    }
  };
  const {
    body: response
  } = await callCluster.search(params);
  return response;
}
/**
 * Extract the cluster stats for each cluster.
 */


function handleLicenses(response) {
  var _response$hits;

  const clusters = ((_response$hits = response.hits) === null || _response$hits === void 0 ? void 0 : _response$hits.hits) || [];
  return clusters.reduce((acc, {
    _source
  }) => ({ ...acc,
    [_source.cluster_uuid]: _source.license
  }), {});
}