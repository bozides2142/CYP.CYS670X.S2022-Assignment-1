"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LicenseExpirationRule = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _i18n = require("@kbn/i18n");

var _base_rule = require("./base_rule");

var _constants = require("../../common/constants");

var _enums = require("../../common/enums");

var _alert_helpers = require("./alert_helpers");

var _static_globals = require("../static_globals");

var _fetch_licenses = require("../lib/alerts/fetch_licenses");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const EXPIRES_DAYS = [60, 30, 14, 7];

class LicenseExpirationRule extends _base_rule.BaseRule {
  constructor(sanitizedRule) {
    super(sanitizedRule, {
      id: _constants.RULE_LICENSE_EXPIRATION,
      name: _constants.LEGACY_RULE_DETAILS[_constants.RULE_LICENSE_EXPIRATION].label,
      interval: '1d',
      actionVariables: [{
        name: 'expiredDate',
        description: _i18n.i18n.translate('xpack.monitoring.alerts.licenseExpiration.actionVariables.expiredDate', {
          defaultMessage: 'The date when the license expires.'
        })
      }, {
        name: 'clusterName',
        description: _i18n.i18n.translate('xpack.monitoring.alerts.licenseExpiration.actionVariables.clusterName', {
          defaultMessage: 'The cluster to which the license belong.'
        })
      }, _alert_helpers.AlertingDefaults.ALERT_TYPE.context.internalShortMessage, _alert_helpers.AlertingDefaults.ALERT_TYPE.context.internalFullMessage, _alert_helpers.AlertingDefaults.ALERT_TYPE.context.state, _alert_helpers.AlertingDefaults.ALERT_TYPE.context.action, _alert_helpers.AlertingDefaults.ALERT_TYPE.context.actionPlain]
    });
    this.sanitizedRule = sanitizedRule;
  }

  async execute(options) {
    if (!_static_globals.Globals.app.config.ui.show_license_expiration) {
      return;
    }

    return await super.execute(options);
  }

  async fetchData(params, esClient, clusters) {
    const licenses = await (0, _fetch_licenses.fetchLicenses)(esClient, clusters, params.filterQuery);
    return licenses.map(license => {
      const {
        clusterUuid,
        type,
        expiryDateMS,
        status,
        ccs
      } = license;
      let isExpired = false;
      let severity = _enums.AlertSeverity.Success;

      if (status !== 'active') {
        isExpired = true;
        severity = _enums.AlertSeverity.Danger;
      } else if (expiryDateMS) {
        for (let i = EXPIRES_DAYS.length - 1; i >= 0; i--) {
          if (type === 'trial' && i < 2) {
            break;
          }

          const fromNow = +new Date() + EXPIRES_DAYS[i] * 1000 * 60 * 60 * 24;

          if (fromNow >= expiryDateMS) {
            isExpired = true;
            severity = i < 1 ? _enums.AlertSeverity.Warning : _enums.AlertSeverity.Danger;
            break;
          }
        }
      }

      return {
        shouldFire: isExpired,
        severity,
        meta: license,
        clusterUuid,
        ccs
      };
    });
  }

  getUiMessage(alertState, item) {
    const license = item.meta;
    return {
      text: _i18n.i18n.translate('xpack.monitoring.alerts.licenseExpiration.ui.firingMessage', {
        defaultMessage: `The license for this cluster expires in #relative at #absolute. #start_linkPlease update your license.#end_link`
      }),
      tokens: [{
        startToken: '#relative',
        type: _enums.AlertMessageTokenType.Time,
        isRelative: true,
        isAbsolute: false,
        timestamp: license.expiryDateMS
      }, {
        startToken: '#absolute',
        type: _enums.AlertMessageTokenType.Time,
        isAbsolute: true,
        isRelative: false,
        timestamp: license.expiryDateMS
      }, {
        startToken: '#start_link',
        endToken: '#end_link',
        type: _enums.AlertMessageTokenType.Link,
        url: 'license'
      }]
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

    const $duration = _moment.default.duration(+new Date() - state.expiryDateMS);

    const actionText = _i18n.i18n.translate('xpack.monitoring.alerts.licenseExpiration.action', {
      defaultMessage: 'Please update your license.'
    });

    const action = `[${actionText}](elasticsearch/nodes)`;
    const expiredDate = $duration.humanize();
    instance.scheduleActions('default', {
      internalShortMessage: _i18n.i18n.translate('xpack.monitoring.alerts.licenseExpiration.firing.internalShortMessage', {
        defaultMessage: `License expiration alert is firing for {clusterName}. Your license expires in {expiredDate}. {actionText}`,
        values: {
          clusterName: cluster.clusterName,
          expiredDate,
          actionText
        }
      }),
      internalFullMessage: _i18n.i18n.translate('xpack.monitoring.alerts.licenseExpiration.firing.internalFullMessage', {
        defaultMessage: `License expiration alert is firing for {clusterName}. Your license expires in {expiredDate}. {action}`,
        values: {
          clusterName: cluster.clusterName,
          expiredDate,
          action
        }
      }),
      state: _alert_helpers.AlertingDefaults.ALERT_STATE.firing,
      expiredDate,
      clusterName: cluster.clusterName,
      action,
      actionPlain: actionText
    });
  }

}

exports.LicenseExpirationRule = LicenseExpirationRule;