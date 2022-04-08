"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MemoryUsageRule = void 0;

var _i18n = require("@kbn/i18n");

var _numeral = _interopRequireDefault(require("@elastic/numeral"));

var _base_rule = require("./base_rule");

var _constants = require("../../common/constants");

var _formatting = require("../../common/formatting");

var _fetch_memory_usage_node_stats = require("../lib/alerts/fetch_memory_usage_node_stats");

var _enums = require("../../common/enums");

var _alert_helpers = require("./alert_helpers");

var _parse_duration = require("../../../alerting/common/parse_duration");

var _static_globals = require("../static_globals");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore


class MemoryUsageRule extends _base_rule.BaseRule {
  constructor(sanitizedRule) {
    super(sanitizedRule, {
      id: _constants.RULE_MEMORY_USAGE,
      name: _constants.RULE_DETAILS[_constants.RULE_MEMORY_USAGE].label,
      accessorKey: 'memoryUsage',
      defaultParams: {
        threshold: 85,
        duration: '5m'
      },
      actionVariables: [{
        name: 'node',
        description: _i18n.i18n.translate('xpack.monitoring.alerts.memoryUsage.actionVariables.node', {
          defaultMessage: 'The node reporting high memory usage.'
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
    const parsedDuration = (0, _parse_duration.parseDuration)(duration);
    const endMs = +new Date();
    const startMs = endMs - parsedDuration;
    const stats = await (0, _fetch_memory_usage_node_stats.fetchMemoryUsageNodeStats)(esClient, clusters, startMs, endMs, _static_globals.Globals.app.config.ui.max_bucket_size, params.filterQuery);
    return stats.map(stat => {
      const {
        clusterUuid,
        memoryUsage,
        ccs
      } = stat;
      return {
        shouldFire: memoryUsage > threshold,
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
      text: _i18n.i18n.translate('xpack.monitoring.alerts.memoryUsage.ui.firingMessage', {
        defaultMessage: `Node #start_link{nodeName}#end_link is reporting JVM memory usage of {memoryUsage}% at #absolute`,
        values: {
          nodeName: stat.nodeName,
          memoryUsage: (0, _numeral.default)(stat.memoryUsage).format(_formatting.ROUNDED_FLOAT)
        }
      }),
      nextSteps: [(0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.memoryUsage.ui.nextSteps.tuneThreadPools', {
        defaultMessage: '#start_linkTune thread pools#end_link'
      }), `{elasticWebsiteUrl}guide/en/elasticsearch/reference/{docLinkVersion}/modules-threadpool.html`), (0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.memoryUsage.ui.nextSteps.managingHeap', {
        defaultMessage: '#start_linkManaging ES Heap#end_link'
      }), `{elasticWebsiteUrl}blog/a-heap-of-trouble`), (0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.memoryUsage.ui.nextSteps.identifyIndicesShards', {
        defaultMessage: '#start_linkIdentify large indices/shards#end_link'
      }), 'elasticsearch/indices', _enums.AlertMessageTokenType.Link), (0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.memoryUsage.ui.nextSteps.addMoreNodes', {
        defaultMessage: '#start_linkAdd more data nodes#end_link'
      }), `{elasticWebsiteUrl}guide/en/elasticsearch/reference/{docLinkVersion}/add-elasticsearch-nodes.html`), (0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.memoryUsage.ui.nextSteps.resizeYourDeployment', {
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
    var _alertStates$find;

    if (alertStates.length === 0) {
      return;
    }

    const firingNode = alertStates[0];

    if (!firingNode || !firingNode.ui.isFiring) {
      return;
    }

    const shortActionText = _i18n.i18n.translate('xpack.monitoring.alerts.memoryUsage.shortAction', {
      defaultMessage: 'Verify memory usage level of node.'
    });

    const fullActionText = _i18n.i18n.translate('xpack.monitoring.alerts.memoryUsage.fullAction', {
      defaultMessage: 'View node'
    });

    const ccs = (_alertStates$find = alertStates.find(state => state.ccs)) === null || _alertStates$find === void 0 ? void 0 : _alertStates$find.ccs;
    const globalStateLink = this.createGlobalStateLink(`elasticsearch/nodes/${firingNode.nodeId}`, cluster.clusterUuid, ccs);
    const action = `[${fullActionText}](${globalStateLink})`;

    const internalShortMessage = _i18n.i18n.translate('xpack.monitoring.alerts.memoryUsage.firing.internalShortMessage', {
      defaultMessage: `Memory usage alert is firing for node {nodeName} in cluster: {clusterName}. {shortActionText}`,
      values: {
        clusterName: cluster.clusterName,
        nodeName: firingNode.nodeName,
        shortActionText
      }
    });

    const internalFullMessage = _i18n.i18n.translate('xpack.monitoring.alerts.memoryUsage.firing.internalFullMessage', {
      defaultMessage: `Memory usage alert is firing for node {nodeName} in cluster: {clusterName}. {action}`,
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
      nodes: `${firingNode.nodeName}:${firingNode.memoryUsage.toFixed(2)}`,
      count: 1,
      node: `${firingNode.nodeName}:${firingNode.memoryUsage.toFixed(2)}`,
      clusterName: cluster.clusterName,
      action,
      actionPlain: shortActionText
    });
  }

}

exports.MemoryUsageRule = MemoryUsageRule;