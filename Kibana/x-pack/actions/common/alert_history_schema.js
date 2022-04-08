"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildAlertHistoryDocument = exports.AlertHistoryEsIndexConnectorId = exports.AlertHistoryDocumentTemplate = exports.AlertHistoryDefaultIndexName = exports.ALERT_HISTORY_PREFIX = void 0;

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ALERT_HISTORY_PREFIX = 'kibana-alert-history-';
exports.ALERT_HISTORY_PREFIX = ALERT_HISTORY_PREFIX;
const AlertHistoryDefaultIndexName = `${ALERT_HISTORY_PREFIX}default`;
exports.AlertHistoryDefaultIndexName = AlertHistoryDefaultIndexName;
const AlertHistoryEsIndexConnectorId = 'preconfigured-alert-history-es-index';
exports.AlertHistoryEsIndexConnectorId = AlertHistoryEsIndexConnectorId;

const buildAlertHistoryDocument = variables => {
  const {
    date,
    alert: alertVariables,
    context,
    params,
    tags,
    rule: ruleVariables
  } = variables;

  if (!alertVariables || !ruleVariables) {
    return null;
  }

  const {
    actionGroup,
    actionGroupName,
    id: alertId
  } = alertVariables;
  const {
    id: ruleId,
    name,
    spaceId,
    type
  } = ruleVariables;

  if (!type) {
    // can't build the document without a type
    return null;
  }

  const ruleType = type.replace(/\./g, '__');
  const rule = { ...(ruleId ? {
      id: ruleId
    } : {}),
    ...(name ? {
      name
    } : {}),
    ...(!(0, _lodash.isEmpty)(params) ? {
      params: {
        [ruleType]: params
      }
    } : {}),
    ...(spaceId ? {
      space: spaceId
    } : {}),
    ...(type ? {
      type
    } : {})
  };
  const alert = { ...(alertId ? {
      id: alertId
    } : {}),
    ...(!(0, _lodash.isEmpty)(context) ? {
      context: {
        [ruleType]: context
      }
    } : {}),
    ...(actionGroup ? {
      actionGroup
    } : {}),
    ...(actionGroupName ? {
      actionGroupName
    } : {})
  };
  const alertHistoryDoc = {
    '@timestamp': date ? date : new Date().toISOString(),
    ...(tags && tags.length > 0 ? {
      tags
    } : {}),
    ...(context !== null && context !== void 0 && context.message ? {
      message: context.message
    } : {}),
    ...(!(0, _lodash.isEmpty)(rule) ? {
      rule
    } : {}),
    ...(!(0, _lodash.isEmpty)(alert) ? {
      kibana: {
        alert
      }
    } : {})
  };
  return !(0, _lodash.isEmpty)(alertHistoryDoc) ? { ...alertHistoryDoc,
    event: {
      kind: 'alert'
    }
  } : null;
};

exports.buildAlertHistoryDocument = buildAlertHistoryDocument;
const AlertHistoryDocumentTemplate = Object.freeze(buildAlertHistoryDocument({
  rule: {
    id: '{{rule.id}}',
    name: '{{rule.name}}',
    type: '{{rule.type}}',
    spaceId: '{{rule.spaceId}}'
  },
  context: '{{context}}',
  params: '{{params}}',
  tags: '{{rule.tags}}',
  alert: {
    id: '{{alert.id}}',
    actionGroup: '{{alert.actionGroup}}',
    actionGroupName: '{{alert.actionGroupName}}'
  }
}));
exports.AlertHistoryDocumentTemplate = AlertHistoryDocumentTemplate;