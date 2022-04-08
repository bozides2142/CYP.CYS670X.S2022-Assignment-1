"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.alertSummaryFromEventLog = alertSummaryFromEventLog;

var _lodash = require("lodash");

var _plugin = require("../plugin");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const Millis2Nanos = 1000 * 1000;

function alertSummaryFromEventLog(params) {
  var _event$kibana2, _event$kibana2$alerti, _event$kibana3, _event$kibana3$alerti; // initialize the  result


  const {
    rule,
    events,
    executionEvents,
    dateStart,
    dateEnd
  } = params;
  const alertSummary = {
    id: rule.id,
    name: rule.name,
    tags: rule.tags,
    ruleTypeId: rule.alertTypeId,
    consumer: rule.consumer,
    statusStartDate: dateStart,
    statusEndDate: dateEnd,
    status: 'OK',
    muteAll: rule.muteAll,
    throttle: rule.throttle,
    enabled: rule.enabled,
    lastRun: undefined,
    errorMessages: [],
    alerts: {},
    executionDuration: {
      average: 0,
      valuesWithTimestamp: {}
    }
  };
  const alerts = new Map();
  const eventDurations = [];
  const eventDurationsWithTimestamp = {}; // loop through the events
  // should be sorted newest to oldest, we want oldest to newest, so reverse

  for (const event of events.reverse()) {
    var _event$event, _event$event2, _event$kibana, _event$kibana$alertin;

    const timeStamp = event === null || event === void 0 ? void 0 : event['@timestamp'];
    if (timeStamp === undefined) continue;
    const provider = event === null || event === void 0 ? void 0 : (_event$event = event.event) === null || _event$event === void 0 ? void 0 : _event$event.provider;
    if (provider !== _plugin.EVENT_LOG_PROVIDER) continue;
    const action = event === null || event === void 0 ? void 0 : (_event$event2 = event.event) === null || _event$event2 === void 0 ? void 0 : _event$event2.action;
    if (action === undefined) continue;

    if (action === _plugin.EVENT_LOG_ACTIONS.execute) {
      var _event$error;

      alertSummary.lastRun = timeStamp;
      const errorMessage = event === null || event === void 0 ? void 0 : (_event$error = event.error) === null || _event$error === void 0 ? void 0 : _event$error.message;

      if (errorMessage !== undefined) {
        alertSummary.status = 'Error';
        alertSummary.errorMessages.push({
          date: timeStamp,
          message: errorMessage
        });
      } else {
        alertSummary.status = 'OK';
      }

      continue;
    }

    const alertId = event === null || event === void 0 ? void 0 : (_event$kibana = event.kibana) === null || _event$kibana === void 0 ? void 0 : (_event$kibana$alertin = _event$kibana.alerting) === null || _event$kibana$alertin === void 0 ? void 0 : _event$kibana$alertin.instance_id;
    if (alertId === undefined) continue;
    const status = getAlertStatus(alerts, alertId);

    switch (action) {
      case _plugin.EVENT_LOG_ACTIONS.newInstance:
        status.activeStartDate = timeStamp;
      // intentionally no break here

      case _plugin.EVENT_LOG_ACTIONS.activeInstance:
        status.status = 'Active';
        status.actionGroupId = event === null || event === void 0 ? void 0 : (_event$kibana2 = event.kibana) === null || _event$kibana2 === void 0 ? void 0 : (_event$kibana2$alerti = _event$kibana2.alerting) === null || _event$kibana2$alerti === void 0 ? void 0 : _event$kibana2$alerti.action_group_id;
        status.actionSubgroup = event === null || event === void 0 ? void 0 : (_event$kibana3 = event.kibana) === null || _event$kibana3 === void 0 ? void 0 : (_event$kibana3$alerti = _event$kibana3.alerting) === null || _event$kibana3$alerti === void 0 ? void 0 : _event$kibana3$alerti.action_subgroup;
        break;

      case _plugin.LEGACY_EVENT_LOG_ACTIONS.resolvedInstance:
      case _plugin.EVENT_LOG_ACTIONS.recoveredInstance:
        status.status = 'OK';
        status.activeStartDate = undefined;
        status.actionGroupId = undefined;
        status.actionSubgroup = undefined;
    }
  }

  for (const event of executionEvents.reverse()) {
    var _event$event3, _event$event4;

    const timeStamp = event === null || event === void 0 ? void 0 : event['@timestamp'];
    if (timeStamp === undefined) continue;
    const action = event === null || event === void 0 ? void 0 : (_event$event3 = event.event) === null || _event$event3 === void 0 ? void 0 : _event$event3.action;
    if (action === undefined) continue;

    if (action !== _plugin.EVENT_LOG_ACTIONS.execute) {
      continue;
    }

    if (event !== null && event !== void 0 && (_event$event4 = event.event) !== null && _event$event4 !== void 0 && _event$event4.duration) {
      const eventDirationMillis = event.event.duration / Millis2Nanos;
      eventDurations.push(eventDirationMillis);
      eventDurationsWithTimestamp[event['@timestamp']] = eventDirationMillis;
    }
  } // set the muted status of alerts


  for (const alertId of rule.mutedInstanceIds) {
    getAlertStatus(alerts, alertId).muted = true;
  } // convert the alerts map to object form


  const alertIds = Array.from(alerts.keys()).sort();

  for (const alertId of alertIds) {
    alertSummary.alerts[alertId] = alerts.get(alertId);
  } // set the overall alert status to Active if appropriatea


  if (alertSummary.status !== 'Error') {
    if (Array.from(alerts.values()).some(a => a.status === 'Active')) {
      alertSummary.status = 'Active';
    }
  }

  alertSummary.errorMessages.sort((a, b) => a.date.localeCompare(b.date));

  if (eventDurations.length > 0) {
    alertSummary.executionDuration = {
      average: Math.round((0, _lodash.mean)(eventDurations)),
      valuesWithTimestamp: eventDurationsWithTimestamp
    };
  }

  return alertSummary;
} // return an alert status object, creating and adding to the map if needed


function getAlertStatus(alerts, alertId) {
  if (alerts.has(alertId)) return alerts.get(alertId);
  const status = {
    status: 'OK',
    muted: false,
    actionGroupId: undefined,
    actionSubgroup: undefined,
    activeStartDate: undefined
  };
  alerts.set(alertId, status);
  return status;
}