"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ThreadPoolRejectionsRuleBase = void 0;

var _i18n = require("@kbn/i18n");

var _base_rule = require("./base_rule");

var _fetch_thread_pool_rejections_stats = require("../lib/alerts/fetch_thread_pool_rejections_stats");

var _enums = require("../../common/enums");

var _alert_helpers = require("./alert_helpers");

var _static_globals = require("../static_globals");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class ThreadPoolRejectionsRuleBase extends _base_rule.BaseRule {
  static createActionVariables(type) {
    return [{
      name: 'node',
      description: _i18n.i18n.translate('xpack.monitoring.alerts.threadPoolRejections.actionVariables.node', {
        defaultMessage: 'The node reporting high thread pool {type} rejections.',
        values: {
          type
        }
      })
    }, ...Object.values(_alert_helpers.AlertingDefaults.ALERT_TYPE.context)];
  }

  constructor(sanitizedRule = undefined, id, threadPoolType, name, actionVariables) {
    super(sanitizedRule, {
      id,
      name,
      defaultParams: {
        threshold: 300,
        duration: '5m'
      },
      actionVariables
    });
    this.id = id;
    this.threadPoolType = threadPoolType;
    this.name = name;
    this.actionVariables = actionVariables;
  }

  async fetchData(params, esClient, clusters) {
    const {
      threshold,
      duration
    } = params;
    const stats = await (0, _fetch_thread_pool_rejections_stats.fetchThreadPoolRejectionStats)(esClient, clusters, _static_globals.Globals.app.config.ui.max_bucket_size, this.threadPoolType, duration, params.filterQuery);
    return stats.map(stat => {
      const {
        clusterUuid,
        ccs
      } = stat;
      return {
        shouldFire: stat.rejectionCount > threshold,
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

  getUiMessage(alertState, item) {
    const {
      nodeName,
      nodeId,
      type: threadPoolType,
      rejectionCount
    } = item.meta;
    return {
      text: _i18n.i18n.translate('xpack.monitoring.alerts.threadPoolRejections.ui.firingMessage', {
        defaultMessage: `Node #start_link{nodeName}#end_link is reporting {rejectionCount} {threadPoolType} rejections at #absolute`,
        values: {
          nodeName,
          threadPoolType,
          rejectionCount
        }
      }),
      nextSteps: [(0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.threadPoolRejections.ui.nextSteps.monitorThisNode', {
        defaultMessage: `#start_linkMonitor this node#end_link`
      }), `elasticsearch/nodes/${nodeId}/advanced`, _enums.AlertMessageTokenType.Link), (0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.threadPoolRejections.ui.nextSteps.optimizeQueries', {
        defaultMessage: '#start_linkOptimize complex queries#end_link'
      }), `{elasticWebsiteUrl}blog/advanced-tuning-finding-and-fixing-slow-elasticsearch-queries`), (0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.threadPoolRejections.ui.nextSteps.addMoreNodes', {
        defaultMessage: '#start_linkAdd more nodes#end_link'
      }), `{elasticWebsiteUrl}guide/en/elasticsearch/reference/{docLinkVersion}/add-elasticsearch-nodes.html`), (0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.threadPoolRejections.ui.nextSteps.resizeYourDeployment', {
        defaultMessage: '#start_linkResize your deployment (ECE)#end_link'
      }), `{elasticWebsiteUrl}guide/en/cloud-enterprise/current/ece-resize-deployment.html`), (0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.threadPoolRejections.ui.nextSteps.threadPoolSettings', {
        defaultMessage: '#start_linkThread pool settings#end_link'
      }), `{elasticWebsiteUrl}guide/en/elasticsearch/reference/{docLinkVersion}/modules-threadpool.html`)],
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
        url: `elasticsearch/nodes/${nodeId}`
      }]
    };
  }

  executeActions(instance, {
    alertStates
  }, item, cluster) {
    var _alertStates$find;

    const type = this.threadPoolType;
    const {
      clusterName: clusterKnownName,
      clusterUuid
    } = cluster;
    const clusterName = clusterKnownName || clusterUuid;

    if (alertStates.length === 0) {
      return;
    }

    const firingNode = alertStates[0];
    const {
      nodeName,
      nodeId
    } = firingNode;

    if (!firingNode || !firingNode.ui.isFiring) {
      return;
    }

    const shortActionText = _i18n.i18n.translate('xpack.monitoring.alerts.threadPoolRejections.shortAction', {
      defaultMessage: 'Verify thread pool {type} rejections for the affected node.',
      values: {
        type
      }
    });

    const fullActionText = _i18n.i18n.translate('xpack.monitoring.alerts.threadPoolRejections.fullAction', {
      defaultMessage: 'View node'
    });

    const ccs = (_alertStates$find = alertStates.find(state => state.ccs)) === null || _alertStates$find === void 0 ? void 0 : _alertStates$find.ccs;
    const globalStateLink = this.createGlobalStateLink(`elasticsearch/nodes/${nodeId}`, cluster.clusterUuid, ccs);
    const action = `[${fullActionText}](${globalStateLink})`;

    const internalShortMessage = _i18n.i18n.translate('xpack.monitoring.alerts.threadPoolRejections.firing.internalShortMessage', {
      defaultMessage: `Thread pool {type} rejections alert is firing for node {nodeName} in cluster: {clusterName}. {shortActionText}`,
      values: {
        clusterName,
        nodeName,
        shortActionText,
        type
      }
    });

    const internalFullMessage = _i18n.i18n.translate('xpack.monitoring.alerts.threadPoolRejections.firing.internalFullMessage', {
      defaultMessage: `Thread pool {type} rejections alert is firing for node {nodeName} in cluster: {clusterName}. {action}`,
      values: {
        clusterName,
        nodeName,
        action,
        type
      }
    });

    instance.scheduleActions('default', {
      internalShortMessage,
      internalFullMessage: _static_globals.Globals.app.isCloud ? internalShortMessage : internalFullMessage,
      threadPoolType: type,
      state: _alert_helpers.AlertingDefaults.ALERT_STATE.firing,

      /* continue to send "count" value for users before https://github.com/elastic/kibana/pull/102544
          see https://github.com/elastic/kibana/issues/100136#issuecomment-865229431
          */
      count: 1,
      node: nodeName,
      clusterName,
      action,
      actionPlain: shortActionText
    });
  }

}

exports.ThreadPoolRejectionsRuleBase = ThreadPoolRejectionsRuleBase;