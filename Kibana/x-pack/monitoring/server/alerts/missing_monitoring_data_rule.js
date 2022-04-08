"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MissingMonitoringDataRule = void 0;

var _i18n = require("@kbn/i18n");

var _moment = _interopRequireDefault(require("moment"));

var _base_rule = require("./base_rule");

var _constants = require("../../common/constants");

var _enums = require("../../common/enums");

var _parse_duration = require("../../../alerting/common/parse_duration");

var _fetch_missing_monitoring_data = require("../lib/alerts/fetch_missing_monitoring_data");

var _alert_helpers = require("./alert_helpers");

var _static_globals = require("../static_globals");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// Go a bit farther back because we need to detect the difference between seeing the monitoring data versus just not looking far enough back


const LIMIT_BUFFER = 3 * 60 * 1000;

class MissingMonitoringDataRule extends _base_rule.BaseRule {
  constructor(sanitizedRule) {
    super(sanitizedRule, {
      id: _constants.RULE_MISSING_MONITORING_DATA,
      name: _constants.RULE_DETAILS[_constants.RULE_MISSING_MONITORING_DATA].label,
      accessorKey: 'gapDuration',
      fetchClustersRange: LIMIT_BUFFER,
      defaultParams: {
        duration: '15m',
        limit: '1d'
      },
      throttle: '6h',
      actionVariables: [{
        name: 'node',
        description: _i18n.i18n.translate('xpack.monitoring.alerts.missingData.actionVariables.node', {
          defaultMessage: 'The node missing monitoring data.'
        })
      }, ...Object.values(_alert_helpers.AlertingDefaults.ALERT_TYPE.context)]
    });
    this.sanitizedRule = sanitizedRule;
  }

  async fetchData(params, esClient, clusters) {
    const duration = (0, _parse_duration.parseDuration)(params.duration);
    const limit = (0, _parse_duration.parseDuration)(params.limit);
    const now = +new Date();
    const missingData = await (0, _fetch_missing_monitoring_data.fetchMissingMonitoringData)(esClient, clusters, _static_globals.Globals.app.config.ui.max_bucket_size, now, now - limit - LIMIT_BUFFER, params.filterQuery);
    return missingData.map(missing => {
      return {
        clusterUuid: missing.clusterUuid,
        shouldFire: missing.gapDuration > duration,
        severity: _enums.AlertSeverity.Danger,
        meta: { ...missing,
          limit
        },
        ccs: missing.ccs
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
    const {
      nodeName,
      gapDuration
    } = item.meta;
    return {
      text: _i18n.i18n.translate('xpack.monitoring.alerts.missingData.ui.firingMessage', {
        defaultMessage: `For the past {gapDuration}, we have not detected any monitoring data from the Elasticsearch node: {nodeName}, starting at #absolute`,
        values: {
          gapDuration: _moment.default.duration(gapDuration, 'milliseconds').humanize(),
          nodeName
        }
      }),
      nextSteps: [(0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.missingData.ui.nextSteps.viewAll', {
        defaultMessage: `#start_linkView all Elasticsearch nodes#end_link`
      }), 'elasticsearch/nodes', _enums.AlertMessageTokenType.Link), {
        text: _i18n.i18n.translate('xpack.monitoring.alerts.missingData.ui.nextSteps.verifySettings', {
          defaultMessage: `Verify monitoring settings on the node`
        })
      }],
      tokens: [{
        startToken: '#absolute',
        type: _enums.AlertMessageTokenType.Time,
        isAbsolute: true,
        isRelative: false,
        timestamp: alertState.ui.triggeredMS
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

    const shortActionText = _i18n.i18n.translate('xpack.monitoring.alerts.missingData.shortAction', {
      defaultMessage: 'Verify the node is up and running, then double check the monitoring settings.'
    });

    const fullActionText = _i18n.i18n.translate('xpack.monitoring.alerts.missingData.fullAction', {
      defaultMessage: 'View what monitoring data we do have for this node.'
    });

    const ccs = (_alertStates$find = alertStates.find(state => state.ccs)) === null || _alertStates$find === void 0 ? void 0 : _alertStates$find.ccs;
    const globalStateLink = this.createGlobalStateLink(`elasticsearch/nodes/${firingNode.nodeId}`, cluster.clusterUuid, ccs);
    const action = `[${fullActionText}](${globalStateLink})`;

    const internalShortMessage = _i18n.i18n.translate('xpack.monitoring.alerts.missingData.firing.internalShortMessage', {
      defaultMessage: `We have not detected any monitoring data for node {nodeName} in cluster: {clusterName}. {shortActionText}`,
      values: {
        clusterName: cluster.clusterName,
        nodeName: firingNode.nodeName,
        shortActionText
      }
    });

    const internalFullMessage = _i18n.i18n.translate('xpack.monitoring.alerts.missingData.firing.internalFullMessage', {
      defaultMessage: `We have not detected any monitoring data for node {nodeName} in cluster: {clusterName}. {action}`,
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
      nodes: `node: ${firingNode.nodeName}`,
      count: 1,
      node: `node: ${firingNode.nodeName}`,
      clusterName: cluster.clusterName,
      action,
      actionPlain: shortActionText
    });
  }

}

exports.MissingMonitoringDataRule = MissingMonitoringDataRule;