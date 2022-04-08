"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ElasticsearchVersionMismatchRule = void 0;

var _i18n = require("@kbn/i18n");

var _base_rule = require("./base_rule");

var _constants = require("../../common/constants");

var _enums = require("../../common/enums");

var _alert_helpers = require("./alert_helpers");

var _static_globals = require("../static_globals");

var _fetch_elasticsearch_versions = require("../lib/alerts/fetch_elasticsearch_versions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class ElasticsearchVersionMismatchRule extends _base_rule.BaseRule {
  constructor(sanitizedRule) {
    super(sanitizedRule, {
      id: _constants.RULE_ELASTICSEARCH_VERSION_MISMATCH,
      name: _constants.LEGACY_RULE_DETAILS[_constants.RULE_ELASTICSEARCH_VERSION_MISMATCH].label,
      interval: '1d',
      actionVariables: [{
        name: 'versionList',
        description: _i18n.i18n.translate('xpack.monitoring.alerts.elasticsearchVersionMismatch.actionVariables.clusterHealth', {
          defaultMessage: 'The versions of Elasticsearch running in this cluster.'
        })
      }, ...Object.values(_alert_helpers.AlertingDefaults.ALERT_TYPE.context)]
    });
    this.sanitizedRule = sanitizedRule;
  }

  async fetchData(params, esClient, clusters) {
    const elasticsearchVersions = await (0, _fetch_elasticsearch_versions.fetchElasticsearchVersions)(esClient, clusters, _static_globals.Globals.app.config.ui.max_bucket_size, params.filterQuery);
    return elasticsearchVersions.map(elasticsearchVersion => {
      return {
        shouldFire: elasticsearchVersion.versions.length > 1,
        severity: _enums.AlertSeverity.Warning,
        meta: elasticsearchVersion,
        clusterUuid: elasticsearchVersion.clusterUuid,
        ccs: elasticsearchVersion.ccs
      };
    });
  }

  getUiMessage(alertState, item) {
    const {
      versions
    } = item.meta;

    const text = _i18n.i18n.translate('xpack.monitoring.alerts.elasticsearchVersionMismatch.ui.firingMessage', {
      defaultMessage: `Multiple versions of Elasticsearch ({versions}) running in this cluster.`,
      values: {
        versions: versions.join(', ')
      }
    });

    return {
      text
    };
  }

  async executeActions(instance, {
    alertStates
  }, item, cluster) {
    if (alertStates.length === 0) {
      return;
    } // Logic in the base alert assumes that all alerts will operate against multiple nodes/instances (such as a CPU alert against ES nodes)
    // However, some alerts operate on the state of the cluster itself and are only concerned with a single state


    const state = alertStates[0];
    const {
      versions
    } = state.meta;

    const shortActionText = _i18n.i18n.translate('xpack.monitoring.alerts.elasticsearchVersionMismatch.shortAction', {
      defaultMessage: 'Verify you have the same version across all nodes.'
    });

    const fullActionText = _i18n.i18n.translate('xpack.monitoring.alerts.elasticsearchVersionMismatch.fullAction', {
      defaultMessage: 'View nodes'
    });

    const globalStateLink = this.createGlobalStateLink('elasticsearch/nodes', cluster.clusterUuid, state.ccs);
    const action = `[${fullActionText}](${globalStateLink})`;
    instance.scheduleActions('default', {
      internalShortMessage: _i18n.i18n.translate('xpack.monitoring.alerts.elasticsearchVersionMismatch.firing.internalShortMessage', {
        defaultMessage: `Elasticsearch version mismatch alert is firing for {clusterName}. {shortActionText}`,
        values: {
          clusterName: cluster.clusterName,
          shortActionText
        }
      }),
      internalFullMessage: _i18n.i18n.translate('xpack.monitoring.alerts.elasticsearchVersionMismatch.firing.internalFullMessage', {
        defaultMessage: `Elasticsearch version mismatch alert is firing for {clusterName}. Elasticsearch is running {versions}. {action}`,
        values: {
          clusterName: cluster.clusterName,
          versions: versions.join(', '),
          action
        }
      }),
      state: _alert_helpers.AlertingDefaults.ALERT_STATE.firing,
      clusterName: cluster.clusterName,
      versionList: versions,
      action,
      actionPlain: shortActionText
    });
  }

}

exports.ElasticsearchVersionMismatchRule = ElasticsearchVersionMismatchRule;