"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DiskUsageRule = void 0;

var _i18n = require("@kbn/i18n");

var _numeral = _interopRequireDefault(require("@elastic/numeral"));

var _base_rule = require("./base_rule");

var _constants = require("../../common/constants");

var _formatting = require("../../common/formatting");

var _fetch_disk_usage_node_stats = require("../lib/alerts/fetch_disk_usage_node_stats");

var _enums = require("../../common/enums");

var _alert_helpers = require("./alert_helpers");

var _static_globals = require("../static_globals");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore


class DiskUsageRule extends _base_rule.BaseRule {
  constructor(sanitizedRule) {
    super(sanitizedRule, {
      id: _constants.RULE_DISK_USAGE,
      name: _constants.RULE_DETAILS[_constants.RULE_DISK_USAGE].label,
      accessorKey: 'diskUsage',
      defaultParams: {
        threshold: 80,
        duration: '5m'
      },
      actionVariables: [{
        name: 'node',
        description: _i18n.i18n.translate('xpack.monitoring.alerts.diskUsage.actionVariables.node', {
          defaultMessage: 'The node reporting high disk usage.'
        })
      }, ...Object.values(_alert_helpers.AlertingDefaults.ALERT_TYPE.context)]
    });
    this.sanitizedRule = sanitizedRule;
  }

  async fetchData(params, esClient, clusters) {
    const {
      duration,
      threshold
    } = params;
    const stats = await (0, _fetch_disk_usage_node_stats.fetchDiskUsageNodeStats)(esClient, clusters, duration, _static_globals.Globals.app.config.ui.max_bucket_size, params.filterQuery);
    return stats.map(stat => {
      const {
        clusterUuid,
        diskUsage,
        ccs
      } = stat;
      return {
        shouldFire: diskUsage > threshold,
        severity: _enums.AlertSeverity.Danger,
        meta: stat,
        clusterUuid,
        ccs
      };
    });
  }

  filterAlertInstance(alertInstance, filters) {
    return super.filterAlertInstance(alertInstance, filters, true);
  }

  getDefaultAlertState(cluster, item) {
    const currentState = super.getDefaultAlertState(cluster, item);
    currentState.ui.severity = _enums.AlertSeverity.Warning;
    return currentState;
  }

  getUiMessage(alertState, item) {
    const stat = item.meta;
    return {
      text: _i18n.i18n.translate('xpack.monitoring.alerts.diskUsage.ui.firingMessage', {
        defaultMessage: `Node #start_link{nodeName}#end_link is reporting disk usage of {diskUsage}% at #absolute`,
        values: {
          nodeName: stat.nodeName,
          diskUsage: (0, _numeral.default)(stat.diskUsage).format(_formatting.ROUNDED_FLOAT)
        }
      }),
      nextSteps: [(0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.diskUsage.ui.nextSteps.tuneDisk', {
        defaultMessage: '#start_linkTune for disk usage#end_link'
      }), `{elasticWebsiteUrl}guide/en/elasticsearch/reference/{docLinkVersion}/tune-for-disk-usage.html`), (0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.diskUsage.ui.nextSteps.identifyIndices', {
        defaultMessage: '#start_linkIdentify large indices#end_link'
      }), 'elasticsearch/indices', _enums.AlertMessageTokenType.Link), (0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.diskUsage.ui.nextSteps.ilmPolicies', {
        defaultMessage: '#start_linkImplement ILM policies#end_link'
      }), `{elasticWebsiteUrl}guide/en/elasticsearch/reference/{docLinkVersion}/index-lifecycle-management.html`), (0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.diskUsage.ui.nextSteps.addMoreNodes', {
        defaultMessage: '#start_linkAdd more data nodes#end_link'
      }), `{elasticWebsiteUrl}guide/en/elasticsearch/reference/{docLinkVersion}/add-elasticsearch-nodes.html`), (0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.diskUsage.ui.nextSteps.resizeYourDeployment', {
        defaultMessage: '#start_linkResize your deployment (ECE)#end_link'
      }), `{elasticWebsiteUrl}guide/en/cloud-enterprise/current/ece-resize-deployment.html`)],
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

    const shortActionText = _i18n.i18n.translate('xpack.monitoring.alerts.diskUsage.shortAction', {
      defaultMessage: 'Verify disk usage level of node.'
    });

    const fullActionText = _i18n.i18n.translate('xpack.monitoring.alerts.diskUsage.fullAction', {
      defaultMessage: 'View node'
    });

    const ccs = firingNode.ccs;
    const globalStateLink = this.createGlobalStateLink(`elasticsearch/nodes/${firingNode.nodeId}`, cluster.clusterUuid, ccs);
    const action = `[${fullActionText}](${globalStateLink})`;

    const internalShortMessage = _i18n.i18n.translate('xpack.monitoring.alerts.diskUsage.firing.internalShortMessage', {
      defaultMessage: `Disk usage alert is firing for node {nodeName} in cluster: {clusterName}. {shortActionText}`,
      values: {
        clusterName: cluster.clusterName,
        nodeName: firingNode.nodeName,
        shortActionText
      }
    });

    const internalFullMessage = _i18n.i18n.translate('xpack.monitoring.alerts.diskUsage.firing.internalFullMessage', {
      defaultMessage: `Disk usage alert is firing for node {nodeName} in cluster: {clusterName}. {action}`,
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
      nodes: `${firingNode.nodeName}:${firingNode.diskUsage}`,
      count: 1,
      node: `${firingNode.nodeName}:${firingNode.diskUsage}`,
      clusterName: cluster.clusterName,
      action,
      actionPlain: shortActionText
    });
  }

}

exports.DiskUsageRule = DiskUsageRule;