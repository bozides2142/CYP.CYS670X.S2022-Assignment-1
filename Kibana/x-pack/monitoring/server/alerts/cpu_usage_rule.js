"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CpuUsageRule = void 0;

var _i18n = require("@kbn/i18n");

var _numeral = _interopRequireDefault(require("@elastic/numeral"));

var _base_rule = require("./base_rule");

var _constants = require("../../common/constants");

var _formatting = require("../../common/formatting");

var _fetch_cpu_usage_node_stats = require("../lib/alerts/fetch_cpu_usage_node_stats");

var _enums = require("../../common/enums");

var _parse_duration = require("../../../alerting/common/parse_duration");

var _alert_helpers = require("./alert_helpers");

var _static_globals = require("../static_globals");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore


class CpuUsageRule extends _base_rule.BaseRule {
  constructor(sanitizedRule) {
    super(sanitizedRule, {
      id: _constants.RULE_CPU_USAGE,
      name: _constants.RULE_DETAILS[_constants.RULE_CPU_USAGE].label,
      accessorKey: 'cpuUsage',
      defaultParams: {
        threshold: 85,
        duration: '5m'
      },
      actionVariables: [{
        name: 'node',
        description: _i18n.i18n.translate('xpack.monitoring.alerts.cpuUsage.actionVariables.node', {
          defaultMessage: 'The node reporting high cpu usage.'
        })
      }, ...Object.values(_alert_helpers.AlertingDefaults.ALERT_TYPE.context)]
    });
    this.sanitizedRule = sanitizedRule;
  }

  async fetchData(params, esClient, clusters) {
    const duration = (0, _parse_duration.parseDuration)(params.duration);
    const endMs = +new Date();
    const startMs = endMs - duration;
    const stats = await (0, _fetch_cpu_usage_node_stats.fetchCpuUsageNodeStats)(esClient, clusters, startMs, endMs, _static_globals.Globals.app.config.ui.max_bucket_size, params.filterQuery);
    return stats.map(stat => {
      if (_static_globals.Globals.app.config.ui.container.elasticsearch.enabled) {
        stat.cpuUsage = stat.containerUsage / (stat.containerPeriods * stat.containerQuota * 1000) * 100;
      }

      return {
        clusterUuid: stat.clusterUuid,
        shouldFire: stat.cpuUsage > params.threshold,
        severity: _enums.AlertSeverity.Danger,
        meta: stat,
        ccs: stat.ccs
      };
    });
  }

  filterAlertInstance(alertInstance, filters) {
    return super.filterAlertInstance(alertInstance, filters, true);
  }

  getDefaultAlertState(cluster, item) {
    const base = super.getDefaultAlertState(cluster, item);
    return { ...base,
      ui: { ...base.ui,
        severity: _enums.AlertSeverity.Danger
      }
    };
  }

  getUiMessage(alertState, item) {
    const stat = item.meta;
    return {
      text: _i18n.i18n.translate('xpack.monitoring.alerts.cpuUsage.ui.firingMessage', {
        defaultMessage: `Node #start_link{nodeName}#end_link is reporting cpu usage of {cpuUsage}% at #absolute`,
        values: {
          nodeName: stat.nodeName,
          cpuUsage: (0, _numeral.default)(stat.cpuUsage).format(_formatting.ROUNDED_FLOAT)
        }
      }),
      nextSteps: [(0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.cpuUsage.ui.nextSteps.hotThreads', {
        defaultMessage: '#start_linkCheck hot threads#end_link'
      }), `{elasticWebsiteUrl}guide/en/elasticsearch/reference/{docLinkVersion}/cluster-nodes-hot-threads.html`), (0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.cpuUsage.ui.nextSteps.runningTasks', {
        defaultMessage: '#start_linkCheck long running tasks#end_link'
      }), `{elasticWebsiteUrl}guide/en/elasticsearch/reference/{docLinkVersion}/tasks.html`)],
      tokens: [{
        startToken: '#absolute',
        type: _enums.AlertMessageTokenType.Time,
        isAbsolute: true,
        isRelative: false,
        timestamp: alertState.ui.triggeredMS
      }, {
        startToken: '#start_link',
        endToken: '#end_link',
        type: _enums.AlertMessageTokenType.Link,
        url: `elasticsearch/nodes/${stat.nodeId}`
      }]
    };
  }

  executeActions(instance, {
    alertStates
  }, item, cluster) {
    if (alertStates.length === 0) {
      return;
    }

    const firingNode = alertStates[0];

    if (!firingNode || !firingNode.ui.isFiring) {
      return;
    }

    const shortActionText = _i18n.i18n.translate('xpack.monitoring.alerts.cpuUsage.shortAction', {
      defaultMessage: 'Verify CPU level of node.'
    });

    const fullActionText = _i18n.i18n.translate('xpack.monitoring.alerts.cpuUsage.fullAction', {
      defaultMessage: 'View node'
    });

    const ccs = firingNode.ccs;
    const globalStateLink = this.createGlobalStateLink(`elasticsearch/nodes/${firingNode.nodeId}`, cluster.clusterUuid, ccs);
    const action = `[${fullActionText}](${globalStateLink})`;

    const internalShortMessage = _i18n.i18n.translate('xpack.monitoring.alerts.cpuUsage.firing.internalShortMessage', {
      defaultMessage: `CPU usage alert is firing for node {nodeName} in cluster: {clusterName}. {shortActionText}`,
      values: {
        clusterName: cluster.clusterName,
        nodeName: firingNode.nodeName,
        shortActionText
      }
    });

    const internalFullMessage = _i18n.i18n.translate('xpack.monitoring.alerts.cpuUsage.firing.internalFullMessage', {
      defaultMessage: `CPU usage alert is firing for node {nodeName} in cluster: {clusterName}. {action}`,
      values: {
        clusterName: cluster.clusterName,
        nodeName: firingNode.nodeName,
        action
      }
    });

    instance.scheduleActions('default', {
      internalShortMessage,
      internalFullMessage: _static_globals.Globals.app.isCloud ? internalShortMessage : internalFullMessage,
      state: _alert_helpers.AlertingDefaults.ALERT_STATE.firing,

      /* continue to send "nodes" and "count" values for users before https://github.com/elastic/kibana/pull/102544
        see https://github.com/elastic/kibana/issues/100136#issuecomment-865229431
        */
      nodes: `${firingNode.nodeName}:${firingNode.cpuUsage}`,
      count: 1,
      node: `${firingNode.nodeName}:${firingNode.cpuUsage}`,
      clusterName: cluster.clusterName,
      action,
      actionPlain: shortActionText
    });
  }

}

exports.CpuUsageRule = CpuUsageRule;