"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFleetServerUsage = void 0;

var _boom = require("@hapi/boom");

var _services = require("../services");

var _agents = require("../services/agents");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const DEFAULT_USAGE = {
  total_all_statuses: 0,
  total_enrolled: 0,
  healthy: 0,
  unhealthy: 0,
  offline: 0,
  updating: 0,
  num_host_urls: 0
};

const getFleetServerUsage = async (soClient, esClient) => {
  if (!soClient || !esClient) {
    return DEFAULT_USAGE;
  }

  const numHostsUrls = await _services.settingsService.getSettings(soClient).then(settings => {
    var _settings$fleet_serve, _settings$fleet_serve2;

    return (_settings$fleet_serve = (_settings$fleet_serve2 = settings.fleet_server_hosts) === null || _settings$fleet_serve2 === void 0 ? void 0 : _settings$fleet_serve2.length) !== null && _settings$fleet_serve !== void 0 ? _settings$fleet_serve : 0;
  }).catch(err => {
    if ((0, _boom.isBoom)(err) && err.output.statusCode === 404) {
      return 0;
    }

    throw err;
  }); // Find all policies with Fleet server than query agent status

  let hasMore = true;
  const policyIds = new Set();
  let page = 1;

  while (hasMore) {
    const res = await _services.packagePolicyService.list(soClient, {
      page: page++,
      perPage: 20,
      kuery: 'ingest-package-policies.package.name:fleet_server'
    });

    for (const item of res.items) {
      policyIds.add(item.policy_id);
    }

    if (res.items.length === 0) {
      hasMore = false;
    }
  }

  if (policyIds.size === 0) {
    return DEFAULT_USAGE;
  }

  const {
    total,
    inactive,
    online,
    error,
    updating,
    offline
  } = await (0, _agents.getAgentStatusForAgentPolicy)(esClient, undefined, Array.from(policyIds).map(policyId => `(policy_id:"${policyId}")`).join(' or '));
  return {
    total_enrolled: total,
    healthy: online,
    unhealthy: error,
    offline,
    updating,
    total_all_statuses: total + inactive,
    num_host_urls: numHostsUrls
  };
};

exports.getFleetServerUsage = getFleetServerUsage;