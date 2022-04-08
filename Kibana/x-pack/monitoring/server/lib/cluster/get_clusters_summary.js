"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getClustersSummary = getClustersSummary;

var _lodash = require("lodash");

var _calculate_overall_status = require("../calculate_overall_status");

var _custom_errors = require("../errors/custom_errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore
// @ts-ignore


function getClustersSummary(server, clusters, kibanaUuid, isCcrEnabled) {
  return clusters.map(cluster => {
    var _cluster$elasticsearc, _cluster$elasticsearc2, _cluster$elasticsearc3, _cluster$elasticsearc4, _cluster$elasticsearc5, _cluster$elasticsearc6, _cluster$elasticsearc7, _cluster$elasticsearc8, _cluster$elasticsearc9, _cluster$elasticsearc10, _cluster$elasticsearc11, _clusterStatsLegacy$i, _clusterStatsLegacy$i2, _clusterStatsMB$indic, _clusterStatsLegacy$i3, _clusterStatsLegacy$i4, _clusterStatsLegacy$i5, _clusterStatsMB$indic2, _clusterStatsMB$indic3, _clusterStatsLegacy$i6, _clusterStatsLegacy$i7, _clusterStatsLegacy$i8, _clusterStatsMB$indic4, _clusterStatsMB$indic5, _clusterStatsLegacy$i9, _clusterStatsLegacy$i10, _clusterStatsLegacy$i11, _clusterStatsMB$indic6, _clusterStatsMB$indic7, _clusterStatsLegacy$i12, _clusterStatsLegacy$i13, _clusterStatsLegacy$i14, _clusterStatsMB$indic8, _clusterStatsMB$indic9, _clusterStatsLegacy$i15, _clusterStatsLegacy$i16, _clusterStatsLegacy$i17, _clusterStatsMB$indic10, _clusterStatsMB$indic11, _clusterStatsMB$indic12, _clusterStatsLegacy$n, _clusterStatsLegacy$n2, _clusterStatsLegacy$n3, _clusterStatsMB$nodes, _clusterStatsMB$nodes2, _clusterStatsMB$nodes3, _clusterStatsLegacy$n4, _clusterStatsLegacy$n5, _clusterStatsLegacy$n6, _clusterStatsLegacy$n7, _clusterStatsMB$nodes4, _clusterStatsMB$nodes5, _clusterStatsMB$nodes6, _clusterStatsMB$nodes7, _clusterStatsMB$nodes8, _clusterStatsLegacy$n8, _clusterStatsLegacy$n9, _clusterStatsLegacy$n10, _clusterStatsLegacy$n11, _clusterStatsMB$nodes9, _clusterStatsMB$nodes10, _clusterStatsMB$nodes11, _clusterStatsMB$nodes12, _clusterStatsMB$nodes13, _clusterStatsLegacy$n12, _clusterStatsLegacy$n13, _clusterStatsLegacy$n14, _clusterStatsMB$nodes14, _clusterStatsMB$nodes15, _clusterStatsMB$nodes16, _clusterStatsLegacy$n15, _clusterStatsLegacy$n16, _clusterStatsLegacy$n17, _clusterStatsMB$nodes17, _clusterStatsMB$nodes18, _clusterStatsMB$nodes19, _clusterStatsLegacy$n18, _clusterStatsLegacy$n19, _clusterStatsLegacy$n20, _clusterStatsMB$nodes20, _ref, _cluster$cluster_stat, _cluster$elasticsearc12, _cluster$elasticsearc13, _uuids;

    const {
      isSupported,
      logstash,
      kibana,
      ml,
      beats,
      apm,
      enterpriseSearch,
      alerts,
      ccs,
      cluster_settings: clusterSettings,
      logs
    } = cluster;
    const license = cluster.license || ((_cluster$elasticsearc = cluster.elasticsearch) === null || _cluster$elasticsearc === void 0 ? void 0 : (_cluster$elasticsearc2 = _cluster$elasticsearc.cluster) === null || _cluster$elasticsearc2 === void 0 ? void 0 : (_cluster$elasticsearc3 = _cluster$elasticsearc2.stats) === null || _cluster$elasticsearc3 === void 0 ? void 0 : _cluster$elasticsearc3.license);
    const version = cluster.version || ((_cluster$elasticsearc4 = cluster.elasticsearch) === null || _cluster$elasticsearc4 === void 0 ? void 0 : _cluster$elasticsearc4.version);
    const clusterUuid = cluster.cluster_uuid || ((_cluster$elasticsearc5 = cluster.elasticsearch) === null || _cluster$elasticsearc5 === void 0 ? void 0 : (_cluster$elasticsearc6 = _cluster$elasticsearc5.cluster) === null || _cluster$elasticsearc6 === void 0 ? void 0 : _cluster$elasticsearc6.id);
    const clusterStatsLegacy = cluster.cluster_stats;
    const clusterStatsMB = (_cluster$elasticsearc7 = cluster.elasticsearch) === null || _cluster$elasticsearc7 === void 0 ? void 0 : (_cluster$elasticsearc8 = _cluster$elasticsearc7.cluster) === null || _cluster$elasticsearc8 === void 0 ? void 0 : _cluster$elasticsearc8.stats;
    const clusterName = (0, _lodash.get)(clusterSettings, 'cluster.metadata.display_name', (_cluster$elasticsearc9 = (_cluster$elasticsearc10 = cluster.elasticsearch) === null || _cluster$elasticsearc10 === void 0 ? void 0 : (_cluster$elasticsearc11 = _cluster$elasticsearc10.cluster) === null || _cluster$elasticsearc11 === void 0 ? void 0 : _cluster$elasticsearc11.name) !== null && _cluster$elasticsearc9 !== void 0 ? _cluster$elasticsearc9 : cluster.cluster_name); // check for any missing licenses

    if (!license) {
      const clusterId = cluster.name || clusterName || clusterUuid;
      server.log.error("Could not find license information for cluster = '" + clusterId + "'. " + "Please check the cluster's master node server logs for errors or warnings.");
      throw new _custom_errors.MonitoringLicenseError(clusterId);
    }

    const {
      status: licenseStatus,
      type: licenseType,
      expiry_date_in_millis: licenseExpiry
    } = license;
    const indices = {
      count: (_clusterStatsLegacy$i = clusterStatsLegacy === null || clusterStatsLegacy === void 0 ? void 0 : (_clusterStatsLegacy$i2 = clusterStatsLegacy.indices) === null || _clusterStatsLegacy$i2 === void 0 ? void 0 : _clusterStatsLegacy$i2.count) !== null && _clusterStatsLegacy$i !== void 0 ? _clusterStatsLegacy$i : clusterStatsMB === null || clusterStatsMB === void 0 ? void 0 : (_clusterStatsMB$indic = clusterStatsMB.indices) === null || _clusterStatsMB$indic === void 0 ? void 0 : _clusterStatsMB$indic.total,
      docs: {
        deleted: (_clusterStatsLegacy$i3 = clusterStatsLegacy === null || clusterStatsLegacy === void 0 ? void 0 : (_clusterStatsLegacy$i4 = clusterStatsLegacy.indices) === null || _clusterStatsLegacy$i4 === void 0 ? void 0 : (_clusterStatsLegacy$i5 = _clusterStatsLegacy$i4.docs) === null || _clusterStatsLegacy$i5 === void 0 ? void 0 : _clusterStatsLegacy$i5.deleted) !== null && _clusterStatsLegacy$i3 !== void 0 ? _clusterStatsLegacy$i3 : clusterStatsMB === null || clusterStatsMB === void 0 ? void 0 : (_clusterStatsMB$indic2 = clusterStatsMB.indices) === null || _clusterStatsMB$indic2 === void 0 ? void 0 : (_clusterStatsMB$indic3 = _clusterStatsMB$indic2.docs) === null || _clusterStatsMB$indic3 === void 0 ? void 0 : _clusterStatsMB$indic3.deleted,
        count: (_clusterStatsLegacy$i6 = clusterStatsLegacy === null || clusterStatsLegacy === void 0 ? void 0 : (_clusterStatsLegacy$i7 = clusterStatsLegacy.indices) === null || _clusterStatsLegacy$i7 === void 0 ? void 0 : (_clusterStatsLegacy$i8 = _clusterStatsLegacy$i7.docs) === null || _clusterStatsLegacy$i8 === void 0 ? void 0 : _clusterStatsLegacy$i8.count) !== null && _clusterStatsLegacy$i6 !== void 0 ? _clusterStatsLegacy$i6 : clusterStatsMB === null || clusterStatsMB === void 0 ? void 0 : (_clusterStatsMB$indic4 = clusterStatsMB.indices) === null || _clusterStatsMB$indic4 === void 0 ? void 0 : (_clusterStatsMB$indic5 = _clusterStatsMB$indic4.docs) === null || _clusterStatsMB$indic5 === void 0 ? void 0 : _clusterStatsMB$indic5.total
      },
      shards: {
        total: (_clusterStatsLegacy$i9 = clusterStatsLegacy === null || clusterStatsLegacy === void 0 ? void 0 : (_clusterStatsLegacy$i10 = clusterStatsLegacy.indices) === null || _clusterStatsLegacy$i10 === void 0 ? void 0 : (_clusterStatsLegacy$i11 = _clusterStatsLegacy$i10.shards) === null || _clusterStatsLegacy$i11 === void 0 ? void 0 : _clusterStatsLegacy$i11.total) !== null && _clusterStatsLegacy$i9 !== void 0 ? _clusterStatsLegacy$i9 : clusterStatsMB === null || clusterStatsMB === void 0 ? void 0 : (_clusterStatsMB$indic6 = clusterStatsMB.indices) === null || _clusterStatsMB$indic6 === void 0 ? void 0 : (_clusterStatsMB$indic7 = _clusterStatsMB$indic6.shards) === null || _clusterStatsMB$indic7 === void 0 ? void 0 : _clusterStatsMB$indic7.count,
        primaries: (_clusterStatsLegacy$i12 = clusterStatsLegacy === null || clusterStatsLegacy === void 0 ? void 0 : (_clusterStatsLegacy$i13 = clusterStatsLegacy.indices) === null || _clusterStatsLegacy$i13 === void 0 ? void 0 : (_clusterStatsLegacy$i14 = _clusterStatsLegacy$i13.shards) === null || _clusterStatsLegacy$i14 === void 0 ? void 0 : _clusterStatsLegacy$i14.primaries) !== null && _clusterStatsLegacy$i12 !== void 0 ? _clusterStatsLegacy$i12 : clusterStatsMB === null || clusterStatsMB === void 0 ? void 0 : (_clusterStatsMB$indic8 = clusterStatsMB.indices) === null || _clusterStatsMB$indic8 === void 0 ? void 0 : (_clusterStatsMB$indic9 = _clusterStatsMB$indic8.shards) === null || _clusterStatsMB$indic9 === void 0 ? void 0 : _clusterStatsMB$indic9.primaries
      },
      store: {
        size_in_bytes: (_clusterStatsLegacy$i15 = clusterStatsLegacy === null || clusterStatsLegacy === void 0 ? void 0 : (_clusterStatsLegacy$i16 = clusterStatsLegacy.indices) === null || _clusterStatsLegacy$i16 === void 0 ? void 0 : (_clusterStatsLegacy$i17 = _clusterStatsLegacy$i16.store) === null || _clusterStatsLegacy$i17 === void 0 ? void 0 : _clusterStatsLegacy$i17.size_in_bytes) !== null && _clusterStatsLegacy$i15 !== void 0 ? _clusterStatsLegacy$i15 : clusterStatsMB === null || clusterStatsMB === void 0 ? void 0 : (_clusterStatsMB$indic10 = clusterStatsMB.indices) === null || _clusterStatsMB$indic10 === void 0 ? void 0 : (_clusterStatsMB$indic11 = _clusterStatsMB$indic10.store) === null || _clusterStatsMB$indic11 === void 0 ? void 0 : (_clusterStatsMB$indic12 = _clusterStatsMB$indic11.size) === null || _clusterStatsMB$indic12 === void 0 ? void 0 : _clusterStatsMB$indic12.bytes
      }
    };
    const jvm = {
      max_uptime_in_millis: (_clusterStatsLegacy$n = clusterStatsLegacy === null || clusterStatsLegacy === void 0 ? void 0 : (_clusterStatsLegacy$n2 = clusterStatsLegacy.nodes) === null || _clusterStatsLegacy$n2 === void 0 ? void 0 : (_clusterStatsLegacy$n3 = _clusterStatsLegacy$n2.jvm) === null || _clusterStatsLegacy$n3 === void 0 ? void 0 : _clusterStatsLegacy$n3.max_uptime_in_millis) !== null && _clusterStatsLegacy$n !== void 0 ? _clusterStatsLegacy$n : clusterStatsMB === null || clusterStatsMB === void 0 ? void 0 : (_clusterStatsMB$nodes = clusterStatsMB.nodes) === null || _clusterStatsMB$nodes === void 0 ? void 0 : (_clusterStatsMB$nodes2 = _clusterStatsMB$nodes.jvm) === null || _clusterStatsMB$nodes2 === void 0 ? void 0 : (_clusterStatsMB$nodes3 = _clusterStatsMB$nodes2.max_uptime) === null || _clusterStatsMB$nodes3 === void 0 ? void 0 : _clusterStatsMB$nodes3.ms,
      mem: {
        heap_max_in_bytes: (_clusterStatsLegacy$n4 = clusterStatsLegacy === null || clusterStatsLegacy === void 0 ? void 0 : (_clusterStatsLegacy$n5 = clusterStatsLegacy.nodes) === null || _clusterStatsLegacy$n5 === void 0 ? void 0 : (_clusterStatsLegacy$n6 = _clusterStatsLegacy$n5.jvm) === null || _clusterStatsLegacy$n6 === void 0 ? void 0 : (_clusterStatsLegacy$n7 = _clusterStatsLegacy$n6.mem) === null || _clusterStatsLegacy$n7 === void 0 ? void 0 : _clusterStatsLegacy$n7.heap_max_in_bytes) !== null && _clusterStatsLegacy$n4 !== void 0 ? _clusterStatsLegacy$n4 : clusterStatsMB === null || clusterStatsMB === void 0 ? void 0 : (_clusterStatsMB$nodes4 = clusterStatsMB.nodes) === null || _clusterStatsMB$nodes4 === void 0 ? void 0 : (_clusterStatsMB$nodes5 = _clusterStatsMB$nodes4.jvm) === null || _clusterStatsMB$nodes5 === void 0 ? void 0 : (_clusterStatsMB$nodes6 = _clusterStatsMB$nodes5.memory) === null || _clusterStatsMB$nodes6 === void 0 ? void 0 : (_clusterStatsMB$nodes7 = _clusterStatsMB$nodes6.heap) === null || _clusterStatsMB$nodes7 === void 0 ? void 0 : (_clusterStatsMB$nodes8 = _clusterStatsMB$nodes7.max) === null || _clusterStatsMB$nodes8 === void 0 ? void 0 : _clusterStatsMB$nodes8.bytes,
        heap_used_in_bytes: (_clusterStatsLegacy$n8 = clusterStatsLegacy === null || clusterStatsLegacy === void 0 ? void 0 : (_clusterStatsLegacy$n9 = clusterStatsLegacy.nodes) === null || _clusterStatsLegacy$n9 === void 0 ? void 0 : (_clusterStatsLegacy$n10 = _clusterStatsLegacy$n9.jvm) === null || _clusterStatsLegacy$n10 === void 0 ? void 0 : (_clusterStatsLegacy$n11 = _clusterStatsLegacy$n10.mem) === null || _clusterStatsLegacy$n11 === void 0 ? void 0 : _clusterStatsLegacy$n11.heap_used_in_bytes) !== null && _clusterStatsLegacy$n8 !== void 0 ? _clusterStatsLegacy$n8 : clusterStatsMB === null || clusterStatsMB === void 0 ? void 0 : (_clusterStatsMB$nodes9 = clusterStatsMB.nodes) === null || _clusterStatsMB$nodes9 === void 0 ? void 0 : (_clusterStatsMB$nodes10 = _clusterStatsMB$nodes9.jvm) === null || _clusterStatsMB$nodes10 === void 0 ? void 0 : (_clusterStatsMB$nodes11 = _clusterStatsMB$nodes10.memory) === null || _clusterStatsMB$nodes11 === void 0 ? void 0 : (_clusterStatsMB$nodes12 = _clusterStatsMB$nodes11.heap) === null || _clusterStatsMB$nodes12 === void 0 ? void 0 : (_clusterStatsMB$nodes13 = _clusterStatsMB$nodes12.used) === null || _clusterStatsMB$nodes13 === void 0 ? void 0 : _clusterStatsMB$nodes13.bytes
      }
    };
    const nodes = {
      fs: {
        total_in_bytes: (_clusterStatsLegacy$n12 = clusterStatsLegacy === null || clusterStatsLegacy === void 0 ? void 0 : (_clusterStatsLegacy$n13 = clusterStatsLegacy.nodes) === null || _clusterStatsLegacy$n13 === void 0 ? void 0 : (_clusterStatsLegacy$n14 = _clusterStatsLegacy$n13.fs) === null || _clusterStatsLegacy$n14 === void 0 ? void 0 : _clusterStatsLegacy$n14.total_in_bytes) !== null && _clusterStatsLegacy$n12 !== void 0 ? _clusterStatsLegacy$n12 : clusterStatsMB === null || clusterStatsMB === void 0 ? void 0 : (_clusterStatsMB$nodes14 = clusterStatsMB.nodes) === null || _clusterStatsMB$nodes14 === void 0 ? void 0 : (_clusterStatsMB$nodes15 = _clusterStatsMB$nodes14.fs) === null || _clusterStatsMB$nodes15 === void 0 ? void 0 : (_clusterStatsMB$nodes16 = _clusterStatsMB$nodes15.total) === null || _clusterStatsMB$nodes16 === void 0 ? void 0 : _clusterStatsMB$nodes16.bytes,
        available_in_bytes: (_clusterStatsLegacy$n15 = clusterStatsLegacy === null || clusterStatsLegacy === void 0 ? void 0 : (_clusterStatsLegacy$n16 = clusterStatsLegacy.nodes) === null || _clusterStatsLegacy$n16 === void 0 ? void 0 : (_clusterStatsLegacy$n17 = _clusterStatsLegacy$n16.fs) === null || _clusterStatsLegacy$n17 === void 0 ? void 0 : _clusterStatsLegacy$n17.available_in_bytes) !== null && _clusterStatsLegacy$n15 !== void 0 ? _clusterStatsLegacy$n15 : clusterStatsMB === null || clusterStatsMB === void 0 ? void 0 : (_clusterStatsMB$nodes17 = clusterStatsMB.nodes) === null || _clusterStatsMB$nodes17 === void 0 ? void 0 : (_clusterStatsMB$nodes18 = _clusterStatsMB$nodes17.fs) === null || _clusterStatsMB$nodes18 === void 0 ? void 0 : (_clusterStatsMB$nodes19 = _clusterStatsMB$nodes18.available) === null || _clusterStatsMB$nodes19 === void 0 ? void 0 : _clusterStatsMB$nodes19.bytes
      },
      count: {
        total: (_clusterStatsLegacy$n18 = clusterStatsLegacy === null || clusterStatsLegacy === void 0 ? void 0 : (_clusterStatsLegacy$n19 = clusterStatsLegacy.nodes) === null || _clusterStatsLegacy$n19 === void 0 ? void 0 : (_clusterStatsLegacy$n20 = _clusterStatsLegacy$n19.count) === null || _clusterStatsLegacy$n20 === void 0 ? void 0 : _clusterStatsLegacy$n20.total) !== null && _clusterStatsLegacy$n18 !== void 0 ? _clusterStatsLegacy$n18 : clusterStatsMB === null || clusterStatsMB === void 0 ? void 0 : (_clusterStatsMB$nodes20 = clusterStatsMB.nodes) === null || _clusterStatsMB$nodes20 === void 0 ? void 0 : _clusterStatsMB$nodes20.count
      },
      jvm
    };
    const {
      status
    } = (_ref = (_cluster$cluster_stat = cluster.cluster_state) !== null && _cluster$cluster_stat !== void 0 ? _cluster$cluster_stat : cluster === null || cluster === void 0 ? void 0 : (_cluster$elasticsearc12 = cluster.elasticsearch) === null || _cluster$elasticsearc12 === void 0 ? void 0 : (_cluster$elasticsearc13 = _cluster$elasticsearc12.cluster) === null || _cluster$elasticsearc13 === void 0 ? void 0 : _cluster$elasticsearc13.stats) !== null && _ref !== void 0 ? _ref : {
      status: null
    };
    return {
      isSupported,
      cluster_uuid: clusterUuid,
      cluster_name: clusterName,
      version,
      license: {
        status: licenseStatus,
        type: licenseType,
        expiry_date_in_millis: licenseExpiry
      },
      elasticsearch: {
        cluster_stats: {
          indices,
          nodes,
          status
        },
        logs
      },
      logstash,
      kibana: (0, _lodash.omit)(kibana, 'uuids'),
      ml,
      ccs,
      beats,
      apm,
      enterpriseSearch,
      alerts,
      isPrimary: kibana ? (_uuids = kibana.uuids) === null || _uuids === void 0 ? void 0 : _uuids.includes(kibanaUuid) : false,
      status: (0, _calculate_overall_status.calculateOverallStatus)([status, kibana && kibana.status || null]),
      isCcrEnabled
    };
  });
}