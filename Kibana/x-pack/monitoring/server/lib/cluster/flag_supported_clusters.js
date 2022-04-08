"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.flagSupportedClusters = flagSupportedClusters;

var _constants = require("../../../common/constants");

var _get_index_patterns = require("./get_index_patterns");

var _static_globals = require("../../static_globals");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore


async function findSupportedBasicLicenseCluster(req, clusters, ccs, kibanaUuid, serverLog) {
  var _kibanaDataResult$hit, _kibanaDataResult$hit2, _kibanaDataResult$hit3;

  const dataset = 'stats';
  const moduleType = 'kibana';
  const indexPatterns = (0, _get_index_patterns.getNewIndexPatterns)({
    config: _static_globals.Globals.app.config,
    moduleType,
    dataset,
    ccs
  });
  serverLog(`Detected all clusters in monitoring data have basic license. Checking for supported admin cluster UUID for Kibana ${kibanaUuid}.`);
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  const gte = req.payload.timeRange.min;
  const lte = req.payload.timeRange.max;
  const kibanaDataResult = await callWithRequest(req, 'search', {
    index: indexPatterns,
    size: 1,
    ignore_unavailable: true,
    filter_path: ['hits.hits._source.cluster_uuid', 'hits.hits._source.cluster.id'],
    body: {
      sort: {
        timestamp: {
          order: 'desc',
          unmapped_type: 'long'
        }
      },
      query: {
        bool: {
          filter: [{
            bool: {
              should: [{
                term: {
                  type: 'kibana_stats'
                }
              }, {
                term: {
                  'data_stream.dataset': 'kibana.stats'
                }
              }]
            }
          }, {
            term: {
              'kibana_stats.kibana.uuid': kibanaUuid
            }
          }, {
            range: {
              timestamp: {
                gte,
                lte,
                format: 'strict_date_optional_time'
              }
            }
          }]
        }
      }
    }
  });
  const supportedClusterUuid = (_kibanaDataResult$hit = (_kibanaDataResult$hit2 = kibanaDataResult.hits) === null || _kibanaDataResult$hit2 === void 0 ? void 0 : (_kibanaDataResult$hit3 = _kibanaDataResult$hit2.hits[0]) === null || _kibanaDataResult$hit3 === void 0 ? void 0 : _kibanaDataResult$hit3._source.cluster_uuid) !== null && _kibanaDataResult$hit !== void 0 ? _kibanaDataResult$hit : undefined;

  for (const cluster of clusters) {
    if (cluster.cluster_uuid === supportedClusterUuid) {
      cluster.isSupported = true;
    }
  }

  serverLog(`Found basic license admin cluster UUID for Monitoring UI support: ${supportedClusterUuid}.`);
  return clusters;
}
/*
 * Flag clusters as supported, which means their monitoring data can be seen in the UI.
 *
 * Flagging a Basic licensed cluster as supported when it is part of a multi-cluster environment:
 * 1. Detect if there any standalone clusters and ignore those for these calculations as they are auto supported
 * 2. Detect if there are multiple linked clusters
 * 3. Detect if all of the different linked cluster licenses are basic
 * 4. Make a query to the monitored kibana data to find the "supported" linked cluster
 *    UUID, which is the linked cluster associated with *this* Kibana instance.
 * 5. Flag the linked cluster object with an `isSupported` boolean
 *
 * Non-Basic license clusters and any cluster in a single-cluster environment
 * are also flagged as supported in this method.
 */


function flagSupportedClusters(req, ccs) {
  const serverLog = message => req.getLogger('supported-clusters').debug(message);

  const flagAllSupported = clusters => {
    clusters.forEach(cluster => {
      var _cluster$elasticsearc, _cluster$elasticsearc2, _cluster$elasticsearc3;

      if (cluster.license || (_cluster$elasticsearc = cluster.elasticsearch) !== null && _cluster$elasticsearc !== void 0 && (_cluster$elasticsearc2 = _cluster$elasticsearc.cluster) !== null && _cluster$elasticsearc2 !== void 0 && (_cluster$elasticsearc3 = _cluster$elasticsearc2.stats) !== null && _cluster$elasticsearc3 !== void 0 && _cluster$elasticsearc3.license) {
        cluster.isSupported = true;
      }
    });
    return clusters;
  };

  return async function (clusters) {
    // Standalone clusters are automatically supported in the UI so ignore those for
    // our calculations here
    let linkedClusterCount = 0;

    for (const cluster of clusters) {
      if (cluster.cluster_uuid === _constants.STANDALONE_CLUSTER_CLUSTER_UUID) {
        cluster.isSupported = true;
      } else {
        linkedClusterCount++;
      }
    }

    if (linkedClusterCount > 1) {
      const basicLicenseCount = clusters.reduce((accumCount, cluster) => {
        var _cluster$license$type, _cluster$license, _cluster$elasticsearc4, _cluster$elasticsearc5, _cluster$elasticsearc6, _cluster$elasticsearc7;

        const licenseType = (_cluster$license$type = (_cluster$license = cluster.license) === null || _cluster$license === void 0 ? void 0 : _cluster$license.type) !== null && _cluster$license$type !== void 0 ? _cluster$license$type : (_cluster$elasticsearc4 = cluster.elasticsearch) === null || _cluster$elasticsearc4 === void 0 ? void 0 : (_cluster$elasticsearc5 = _cluster$elasticsearc4.cluster) === null || _cluster$elasticsearc5 === void 0 ? void 0 : (_cluster$elasticsearc6 = _cluster$elasticsearc5.stats) === null || _cluster$elasticsearc6 === void 0 ? void 0 : (_cluster$elasticsearc7 = _cluster$elasticsearc6.license) === null || _cluster$elasticsearc7 === void 0 ? void 0 : _cluster$elasticsearc7.type;

        if (licenseType === 'basic') {
          accumCount++;
        }

        return accumCount;
      }, 0); // if all non-basic licenses

      if (basicLicenseCount === 0) {
        serverLog('Found all non-basic cluster licenses. All clusters will be supported.');
        return flagAllSupported(clusters);
      } // if all linked are basic licenses


      if (linkedClusterCount === basicLicenseCount) {
        const kibanaUuid = req.server.instanceUuid;
        return await findSupportedBasicLicenseCluster(req, clusters, ccs, kibanaUuid, serverLog);
      } // if some non-basic licenses


      serverLog('Found some basic license clusters in monitoring data. Only non-basic will be supported.');
      clusters.forEach(cluster => {
        var _cluster$license2, _cluster$elasticsearc8, _cluster$elasticsearc9, _cluster$elasticsearc10, _cluster$elasticsearc11;

        if (((_cluster$license2 = cluster.license) === null || _cluster$license2 === void 0 ? void 0 : _cluster$license2.type) !== 'basic' && ((_cluster$elasticsearc8 = cluster.elasticsearch) === null || _cluster$elasticsearc8 === void 0 ? void 0 : (_cluster$elasticsearc9 = _cluster$elasticsearc8.cluster) === null || _cluster$elasticsearc9 === void 0 ? void 0 : (_cluster$elasticsearc10 = _cluster$elasticsearc9.stats) === null || _cluster$elasticsearc10 === void 0 ? void 0 : (_cluster$elasticsearc11 = _cluster$elasticsearc10.license) === null || _cluster$elasticsearc11 === void 0 ? void 0 : _cluster$elasticsearc11.type) !== 'basic') {
          cluster.isSupported = true;
        }
      });
      return clusters;
    } // not multi-cluster


    serverLog('Found single cluster in monitoring data.');
    return flagAllSupported(clusters);
  };
}