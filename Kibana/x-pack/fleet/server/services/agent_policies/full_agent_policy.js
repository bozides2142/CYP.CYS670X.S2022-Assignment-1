"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFullAgentPolicy = getFullAgentPolicy;
exports.transformOutputToFullPolicyOutput = transformOutputToFullPolicyOutput;

var _jsYaml = require("js-yaml");

var _agent_policy = require("../agent_policy");

var _output = require("../output");

var _package_policies_to_agent_permissions = require("../package_policies_to_agent_permissions");

var _common = require("../../../common");

var _settings = require("../settings");

var _constants = require("../../constants");

var _monitoring_permissions = require("./monitoring_permissions");

var _ = require("./");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getFullAgentPolicy(soClient, id, options) {
  var _options$standalone, _agentPolicy$monitori, _agentPolicy$monitori2, _agentPolicy$monitori3, _agentPolicy$monitori4;

  let agentPolicy;
  const standalone = (_options$standalone = options === null || options === void 0 ? void 0 : options.standalone) !== null && _options$standalone !== void 0 ? _options$standalone : false;

  try {
    agentPolicy = await _agent_policy.agentPolicyService.get(soClient, id);
  } catch (err) {
    if (!err.isBoom || err.output.statusCode !== 404) {
      throw err;
    }
  }

  if (!agentPolicy) {
    return null;
  }

  const defaultDataOutputId = await _output.outputService.getDefaultDataOutputId(soClient);

  if (!defaultDataOutputId) {
    throw new Error('Default output is not setup');
  }

  const dataOutputId = agentPolicy.data_output_id || defaultDataOutputId;
  const monitoringOutputId = agentPolicy.monitoring_output_id || (await _output.outputService.getDefaultMonitoringOutputId(soClient)) || dataOutputId;
  const outputs = await Promise.all(Array.from(new Set([dataOutputId, monitoringOutputId])).map(outputId => _output.outputService.get(soClient, outputId)));
  const dataOutput = outputs.find(output => output.id === dataOutputId);

  if (!dataOutput) {
    throw new Error(`Data output not found ${dataOutputId}`);
  }

  const monitoringOutput = outputs.find(output => output.id === monitoringOutputId);

  if (!monitoringOutput) {
    throw new Error(`Monitoring output not found ${monitoringOutputId}`);
  }

  const fullAgentPolicy = {
    id: agentPolicy.id,
    outputs: { ...outputs.reduce((acc, output) => {
        acc[getOutputIdForAgentPolicy(output)] = transformOutputToFullPolicyOutput(output, standalone);
        return acc;
      }, {})
    },
    inputs: await (0, _.storedPackagePoliciesToAgentInputs)(soClient, agentPolicy.package_policies, getOutputIdForAgentPolicy(dataOutput)),
    revision: agentPolicy.revision,
    ...(agentPolicy.monitoring_enabled && agentPolicy.monitoring_enabled.length > 0 ? {
      agent: {
        monitoring: {
          namespace: agentPolicy.namespace,
          use_output: getOutputIdForAgentPolicy(monitoringOutput),
          enabled: true,
          logs: agentPolicy.monitoring_enabled.includes(_common.dataTypes.Logs),
          metrics: agentPolicy.monitoring_enabled.includes(_common.dataTypes.Metrics)
        }
      }
    } : {
      agent: {
        monitoring: {
          enabled: false,
          logs: false,
          metrics: false
        }
      }
    })
  };
  const dataPermissions = (await (0, _package_policies_to_agent_permissions.storedPackagePoliciesToAgentPermissions)(soClient, agentPolicy.package_policies)) || {};
  dataPermissions._elastic_agent_checks = {
    cluster: _package_policies_to_agent_permissions.DEFAULT_CLUSTER_PERMISSIONS
  };
  const monitoringPermissions = await (0, _monitoring_permissions.getMonitoringPermissions)(soClient, {
    logs: (_agentPolicy$monitori = (_agentPolicy$monitori2 = agentPolicy.monitoring_enabled) === null || _agentPolicy$monitori2 === void 0 ? void 0 : _agentPolicy$monitori2.includes(_common.dataTypes.Logs)) !== null && _agentPolicy$monitori !== void 0 ? _agentPolicy$monitori : false,
    metrics: (_agentPolicy$monitori3 = (_agentPolicy$monitori4 = agentPolicy.monitoring_enabled) === null || _agentPolicy$monitori4 === void 0 ? void 0 : _agentPolicy$monitori4.includes(_common.dataTypes.Metrics)) !== null && _agentPolicy$monitori3 !== void 0 ? _agentPolicy$monitori3 : false
  }, agentPolicy.namespace);
  monitoringPermissions._elastic_agent_checks = {
    cluster: _package_policies_to_agent_permissions.DEFAULT_CLUSTER_PERMISSIONS
  }; // Only add permissions if output.type is "elasticsearch"

  fullAgentPolicy.output_permissions = Object.keys(fullAgentPolicy.outputs).reduce((outputPermissions, outputId) => {
    const output = fullAgentPolicy.outputs[outputId];

    if (output && output.type === _common.outputType.Elasticsearch) {
      const permissions = {};

      if (outputId === getOutputIdForAgentPolicy(monitoringOutput)) {
        Object.assign(permissions, monitoringPermissions);
      }

      if (outputId === getOutputIdForAgentPolicy(dataOutput)) {
        Object.assign(permissions, dataPermissions);
      }

      outputPermissions[outputId] = permissions;
    }

    return outputPermissions;
  }, {}); // only add settings if not in standalone

  if (!standalone) {
    let settings;

    try {
      settings = await (0, _settings.getSettings)(soClient);
    } catch (error) {
      throw new Error('Default settings is not setup');
    }

    if (settings.fleet_server_hosts && settings.fleet_server_hosts.length) {
      fullAgentPolicy.fleet = {
        hosts: settings.fleet_server_hosts
      };
    }
  }

  return fullAgentPolicy;
}

function transformOutputToFullPolicyOutput(output, standalone = false) {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const {
    config_yaml,
    type,
    hosts,
    ca_sha256,
    ca_trusted_fingerprint,
    api_key
  } = output;
  const configJs = config_yaml ? (0, _jsYaml.safeLoad)(config_yaml) : {};
  const newOutput = { ...configJs,
    type,
    hosts,
    ca_sha256,
    api_key,
    ...(ca_trusted_fingerprint ? {
      'ssl.ca_trusted_fingerprint': ca_trusted_fingerprint
    } : {})
  };

  if (standalone) {
    delete newOutput.api_key;
    newOutput.username = '{ES_USERNAME}';
    newOutput.password = '{ES_PASSWORD}';
  }

  return newOutput;
}
/**
 * Get id used in full agent policy (sent to the agents)
 * we use "default" for the default policy to avoid breaking changes
 */


function getOutputIdForAgentPolicy(output) {
  if (output.is_default) {
    return _constants.DEFAULT_OUTPUT.name;
  }

  return output.id;
}