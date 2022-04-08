"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CCRReadExceptionsRule = void 0;

var _i18n = require("@kbn/i18n");

var _base_rule = require("./base_rule");

var _constants = require("../../common/constants");

var _fetch_ccr_read_exceptions = require("../lib/alerts/fetch_ccr_read_exceptions");

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


class CCRReadExceptionsRule extends _base_rule.BaseRule {
  constructor(sanitizedRule) {
    super(sanitizedRule, {
      id: _constants.RULE_CCR_READ_EXCEPTIONS,
      name: _constants.RULE_DETAILS[_constants.RULE_CCR_READ_EXCEPTIONS].label,
      throttle: '6h',
      defaultParams: {
        duration: '1h'
      },
      actionVariables: [{
        name: 'remoteCluster',
        description: _i18n.i18n.translate('xpack.monitoring.alerts.ccrReadExceptions.actionVariables.remoteCluster', {
          defaultMessage: 'The remote cluster experiencing CCR read exceptions.'
        })
      }, {
        name: 'followerIndex',
        description: _i18n.i18n.translate('xpack.monitoring.alerts.ccrReadExceptions.actionVariables.followerIndex', {
          defaultMessage: 'The follower index reporting CCR read exceptions.'
        })
      }, ...Object.values(_alert_helpers.AlertingDefaults.ALERT_TYPE.context)]
    });
    this.sanitizedRule = sanitizedRule;
  }

  async fetchData(params, esClient, clusters) {
    const {
      duration: durationString
    } = params;
    const duration = (0, _parse_duration.parseDuration)(durationString);
    const endMs = +new Date();
    const startMs = endMs - duration;
    const stats = await (0, _fetch_ccr_read_exceptions.fetchCCRReadExceptions)(esClient, startMs, endMs, _static_globals.Globals.app.config.ui.max_bucket_size, params.filterQuery);
    return stats.map(stat => {
      const {
        remoteCluster,
        followerIndex,
        shardId,
        leaderIndex,
        lastReadException,
        clusterUuid,
        ccs
      } = stat;
      return {
        shouldFire: true,
        severity: _enums.AlertSeverity.Danger,
        meta: {
          remoteCluster,
          followerIndex,
          shardId,
          leaderIndex,
          lastReadException,
          instanceId: `${remoteCluster}:${followerIndex}`,
          itemLabel: followerIndex
        },
        clusterUuid,
        ccs
      };
    });
  }

  getUiMessage(alertState, item) {
    const {
      remoteCluster,
      followerIndex,
      shardId,
      lastReadException
    } = item.meta;
    return {
      text: _i18n.i18n.translate('xpack.monitoring.alerts.ccrReadExceptions.ui.firingMessage', {
        defaultMessage: `Follower index #start_link{followerIndex}#end_link is reporting CCR read exceptions on remote cluster: {remoteCluster} at #absolute`,
        values: {
          remoteCluster,
          followerIndex
        }
      }),
      code: JSON.stringify(lastReadException, null, 2),
      nextSteps: [(0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.ccrReadExceptions.ui.nextSteps.identifyCCRStats', {
        defaultMessage: '#start_linkIdentify CCR usage/stats#end_link'
      }), 'elasticsearch/ccr', _enums.AlertMessageTokenType.Link), (0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.ccrReadExceptions.ui.nextSteps.stackManagmentFollow', {
        defaultMessage: '#start_linkManage CCR follower indices#end_link'
      }), `{basePath}management/data/cross_cluster_replication/follower_indices`), (0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.ccrReadExceptions.ui.nextSteps.stackManagmentAutoFollow', {
        defaultMessage: '#start_linkCreate auto-follow patterns#end_link'
      }), `{basePath}management/data/cross_cluster_replication/auto_follow_patterns`), (0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.ccrReadExceptions.ui.nextSteps.followerAPIDoc', {
        defaultMessage: '#start_linkAdd follower index API (Docs)#end_link'
      }), `{elasticWebsiteUrl}guide/en/elasticsearch/reference/{docLinkVersion}/ccr-put-follow.html`), (0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.ccrReadExceptions.ui.nextSteps.ccrDocs', {
        defaultMessage: '#start_linkCross-cluster replication (Docs)#end_link'
      }), `{elasticWebsiteUrl}guide/en/elasticsearch/reference/{docLinkVersion}/xpack-ccr.html`), (0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.ccrReadExceptions.ui.nextSteps.biDirectionalReplication', {
        defaultMessage: '#start_linkBi-directional replication (Blog)#end_link'
      }), `{elasticWebsiteUrl}blog/bi-directional-replication-with-elasticsearch-cross-cluster-replication-ccr`), (0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.ccrReadExceptions.ui.nextSteps.followTheLeader', {
        defaultMessage: '#start_linkFollow the Leader (Blog)#end_link'
      }), `{elasticWebsiteUrl}blog/follow-the-leader-an-introduction-to-cross-cluster-replication-in-elasticsearch`)],
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
        url: `elasticsearch/ccr/${followerIndex}/shard/${shardId}`
      }]
    };
  }

  filterAlertInstance(alertInstance, filters) {
    var _alertInstance$state;

    const alertInstanceStates = (_alertInstance$state = alertInstance.state) === null || _alertInstance$state === void 0 ? void 0 : _alertInstance$state.alertStates;
    const alertFilter = filters === null || filters === void 0 ? void 0 : filters.find(filter => filter.shardId);

    if (!filters || !filters.length || !(alertInstanceStates !== null && alertInstanceStates !== void 0 && alertInstanceStates.length) || !(alertFilter !== null && alertFilter !== void 0 && alertFilter.shardId)) {
      return alertInstance;
    }

    const shardIdInt = parseInt(alertFilter.shardId, 10);
    const alertStates = alertInstanceStates.filter(({
      meta
    }) => meta.shardId === shardIdInt);
    return {
      state: {
        alertStates
      }
    };
  }

  executeActions(instance, {
    alertStates
  }, item, cluster) {
    var _alertStates$find;

    if (alertStates.length === 0) {
      return;
    }

    const CCRReadExceptionsMeta = alertStates[0].meta;
    const {
      remoteCluster,
      followerIndex
    } = CCRReadExceptionsMeta;

    const shortActionText = _i18n.i18n.translate('xpack.monitoring.alerts.ccrReadExceptions.shortAction', {
      defaultMessage: 'Verify follower and leader index relationships on the affected remote cluster.'
    });

    const fullActionText = _i18n.i18n.translate('xpack.monitoring.alerts.ccrReadExceptions.fullAction', {
      defaultMessage: 'View CCR stats'
    });

    const ccs = (_alertStates$find = alertStates.find(state => state.ccs)) === null || _alertStates$find === void 0 ? void 0 : _alertStates$find.ccs;
    const globalStateLink = this.createGlobalStateLink('elasticsearch/ccr', cluster.clusterUuid, ccs);
    const action = `[${fullActionText}](${globalStateLink})`;

    const internalShortMessage = _i18n.i18n.translate('xpack.monitoring.alerts.ccrReadExceptions.firing.internalShortMessage', {
      defaultMessage: `CCR read exceptions alert is firing for the following remote cluster: {remoteCluster}. {shortActionText}`,
      values: {
        remoteCluster,
        shortActionText
      }
    });

    const internalFullMessage = _i18n.i18n.translate('xpack.monitoring.alerts.ccrReadExceptions.firing.internalFullMessage', {
      defaultMessage: `CCR read exceptions alert is firing for the following remote cluster: {remoteCluster}. Current 'follower_index' index affected: {followerIndex}. {action}`,
      values: {
        action,
        remoteCluster,
        followerIndex
      }
    });

    instance.scheduleActions('default', {
      internalShortMessage,
      internalFullMessage,
      state: _alert_helpers.AlertingDefaults.ALERT_STATE.firing,
      remoteCluster,
      followerIndex,

      /* continue to send "remoteClusters" and "followerIndices" values for users still using it though
        we have replaced it with "remoteCluster" and "followerIndex" in the template due to alerts per index instead of all indices
        see https://github.com/elastic/kibana/issues/100136#issuecomment-865229431
        */
      remoteClusters: remoteCluster,
      followerIndices: followerIndex,
      clusterName: cluster.clusterName,
      action,
      actionPlain: shortActionText
    });
  }

}

exports.CCRReadExceptionsRule = CCRReadExceptionsRule;