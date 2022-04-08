"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchLicenses = fetchLicenses;

var _create_dataset_query_filter = require("./create_dataset_query_filter");

var _static_globals = require("../../static_globals");

var _ccs_utils = require("../../../common/ccs_utils");

var _get_index_patterns = require("../cluster/get_index_patterns");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function fetchLicenses(esClient, clusters, filterQuery) {
  var _response$hits$hits$m, _response$hits;

  const indexPatterns = (0, _get_index_patterns.getNewIndexPatterns)({
    config: _static_globals.Globals.app.config,
    moduleType: 'elasticsearch',
    dataset: 'cluster_stats',
    ccs: (0, _ccs_utils.getConfigCcs)(_static_globals.Globals.app.config) ? '*' : undefined
  });
  const params = {
    index: indexPatterns,
    filter_path: ['hits.hits._source.license.*', 'hits.hits._source.elasticsearch.cluster.stats.license.*', 'hits.hits._source.cluster_uuid', 'hits.hits._source.elasticsearch.cluster.id', 'hits.hits._index'],
    body: {
      size: clusters.length,
      sort: [{
        timestamp: {
          order: 'desc',
          unmapped_type: 'long'
        }
      }],
      query: {
        bool: {
          filter: [{
            terms: {
              cluster_uuid: clusters.map(cluster => cluster.clusterUuid)
            }
          }, (0, _create_dataset_query_filter.createDatasetFilter)('cluster_stats', 'cluster_stats', 'elasticsearch.cluster_stats'), {
            range: {
              timestamp: {
                gte: 'now-2m'
              }
            }
          }]
        }
      },
      collapse: {
        field: 'cluster_uuid'
      }
    }
  };

  try {
    if (filterQuery) {
      const filterQueryObject = JSON.parse(filterQuery);
      params.body.query.bool.filter.push(filterQueryObject);
    }
  } catch (e) {// meh
  }

  const {
    body: response
  } = await esClient.search(params);
  return (_response$hits$hits$m = response === null || response === void 0 ? void 0 : (_response$hits = response.hits) === null || _response$hits === void 0 ? void 0 : _response$hits.hits.map(hit => {
    var _ref, _license, _hit$_source, _hit$_source$elastics, _hit$_source$elastics2, _hit$_source$elastics3, _rawLicense$status, _rawLicense$type, _rawLicense$expiry_da, _hit$_source2, _hit$_source2$elastic, _hit$_source2$elastic2;

    const rawLicense = (_ref = (_license = hit._source.license) !== null && _license !== void 0 ? _license : (_hit$_source = hit._source) === null || _hit$_source === void 0 ? void 0 : (_hit$_source$elastics = _hit$_source.elasticsearch) === null || _hit$_source$elastics === void 0 ? void 0 : (_hit$_source$elastics2 = _hit$_source$elastics.cluster) === null || _hit$_source$elastics2 === void 0 ? void 0 : (_hit$_source$elastics3 = _hit$_source$elastics2.stats) === null || _hit$_source$elastics3 === void 0 ? void 0 : _hit$_source$elastics3.license) !== null && _ref !== void 0 ? _ref : {};
    const license = {
      status: (_rawLicense$status = rawLicense.status) !== null && _rawLicense$status !== void 0 ? _rawLicense$status : '',
      type: (_rawLicense$type = rawLicense.type) !== null && _rawLicense$type !== void 0 ? _rawLicense$type : '',
      expiryDateMS: (_rawLicense$expiry_da = rawLicense.expiry_date_in_millis) !== null && _rawLicense$expiry_da !== void 0 ? _rawLicense$expiry_da : 0,
      clusterUuid: ((_hit$_source2 = hit._source) === null || _hit$_source2 === void 0 ? void 0 : (_hit$_source2$elastic = _hit$_source2.elasticsearch) === null || _hit$_source2$elastic === void 0 ? void 0 : (_hit$_source2$elastic2 = _hit$_source2$elastic.cluster) === null || _hit$_source2$elastic2 === void 0 ? void 0 : _hit$_source2$elastic2.id) || hit._source.cluster_uuid,
      ccs: hit._index
    };
    return license;
  })) !== null && _response$hits$hits$m !== void 0 ? _response$hits$hits$m : [];
}