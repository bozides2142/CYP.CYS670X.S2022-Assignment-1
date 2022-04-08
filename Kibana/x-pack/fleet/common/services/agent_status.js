"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildKueryForEnrollingAgents = buildKueryForEnrollingAgents;
exports.buildKueryForErrorAgents = buildKueryForErrorAgents;
exports.buildKueryForInactiveAgents = buildKueryForInactiveAgents;
exports.buildKueryForOfflineAgents = buildKueryForOfflineAgents;
exports.buildKueryForOnlineAgents = buildKueryForOnlineAgents;
exports.buildKueryForUnenrollingAgents = buildKueryForUnenrollingAgents;
exports.buildKueryForUpdatingAgents = buildKueryForUpdatingAgents;
exports.buildKueryForUpgradingAgents = buildKueryForUpgradingAgents;
exports.getAgentStatus = getAgentStatus;

var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getAgentStatus(agent) {
  const {
    last_checkin: lastCheckIn
  } = agent;

  if (!agent.active) {
    return 'inactive';
  }

  if (agent.unenrollment_started_at && !agent.unenrolled_at) {
    return 'unenrolling';
  }

  if (!agent.last_checkin) {
    return 'enrolling';
  }

  const msLastCheckIn = new Date(lastCheckIn || 0).getTime();
  const msSinceLastCheckIn = new Date().getTime() - msLastCheckIn;
  const intervalsSinceLastCheckIn = Math.floor(msSinceLastCheckIn / _constants.AGENT_POLLING_THRESHOLD_MS);

  if (agent.last_checkin_status === 'error') {
    return 'error';
  }

  if (agent.last_checkin_status === 'degraded') {
    return 'degraded';
  }

  if (agent.upgrade_started_at && !agent.upgraded_at) {
    return 'updating';
  }

  if (intervalsSinceLastCheckIn >= 4) {
    return 'offline';
  }

  return 'online';
}

function buildKueryForEnrollingAgents(path = '') {
  return `not (${path}last_checkin:*)`;
}

function buildKueryForUnenrollingAgents(path = '') {
  return `${path}unenrollment_started_at:*`;
}

function buildKueryForOnlineAgents(path = '') {
  return `not (${buildKueryForOfflineAgents(path)}) AND not (${buildKueryForErrorAgents(path)}) AND not (${buildKueryForUpdatingAgents(path)})`;
}

function buildKueryForErrorAgents(path = '') {
  return `(${path}last_checkin_status:error or ${path}last_checkin_status:degraded) AND not (${buildKueryForUpdatingAgents(path)})`;
}

function buildKueryForOfflineAgents(path = '') {
  return `${path}last_checkin < now-${4 * _constants.AGENT_POLLING_THRESHOLD_MS / 1000}s AND not (${buildKueryForErrorAgents(path)}) AND not ( ${buildKueryForUpdatingAgents(path)} )`;
}

function buildKueryForUpgradingAgents(path = '') {
  return `(${path}upgrade_started_at:*) and not (${path}upgraded_at:*)`;
}

function buildKueryForUpdatingAgents(path = '') {
  return `(${buildKueryForUpgradingAgents(path)}) or (${buildKueryForEnrollingAgents(path)}) or (${buildKueryForUnenrollingAgents(path)})`;
}

function buildKueryForInactiveAgents(path = '') {
  return `${path}active:false`;
}