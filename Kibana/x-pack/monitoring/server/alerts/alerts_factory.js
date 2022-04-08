"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AlertsFactory = void 0;

var _ = require("./");

var _constants = require("../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const BY_TYPE = {
  [_constants.RULE_CLUSTER_HEALTH]: _.ClusterHealthRule,
  [_constants.RULE_LICENSE_EXPIRATION]: _.LicenseExpirationRule,
  [_constants.RULE_CPU_USAGE]: _.CpuUsageRule,
  [_constants.RULE_MISSING_MONITORING_DATA]: _.MissingMonitoringDataRule,
  [_constants.RULE_DISK_USAGE]: _.DiskUsageRule,
  [_constants.RULE_THREAD_POOL_SEARCH_REJECTIONS]: _.ThreadPoolSearchRejectionsRule,
  [_constants.RULE_THREAD_POOL_WRITE_REJECTIONS]: _.ThreadPoolWriteRejectionsRule,
  [_constants.RULE_MEMORY_USAGE]: _.MemoryUsageRule,
  [_constants.RULE_NODES_CHANGED]: _.NodesChangedRule,
  [_constants.RULE_LOGSTASH_VERSION_MISMATCH]: _.LogstashVersionMismatchRule,
  [_constants.RULE_KIBANA_VERSION_MISMATCH]: _.KibanaVersionMismatchRule,
  [_constants.RULE_ELASTICSEARCH_VERSION_MISMATCH]: _.ElasticsearchVersionMismatchRule,
  [_constants.RULE_CCR_READ_EXCEPTIONS]: _.CCRReadExceptionsRule,
  [_constants.RULE_LARGE_SHARD_SIZE]: _.LargeShardSizeRule
};

class AlertsFactory {
  static async getByType(type, alertsClient) {
    var _alertClientAlerts$da;

    const alertCls = BY_TYPE[type];

    if (!alertCls || !alertsClient) {
      return [];
    }

    const alertClientAlerts = await alertsClient.find({
      options: {
        filter: `alert.attributes.alertTypeId:${type}`
      }
    });

    if (!alertClientAlerts.total || !((_alertClientAlerts$da = alertClientAlerts.data) !== null && _alertClientAlerts$da !== void 0 && _alertClientAlerts$da.length)) {
      return [];
    }

    return alertClientAlerts.data.map(alert => new alertCls(alert));
  }

  static getAll() {
    return Object.values(BY_TYPE).map(alert => new alert());
  }

}

exports.AlertsFactory = AlertsFactory;