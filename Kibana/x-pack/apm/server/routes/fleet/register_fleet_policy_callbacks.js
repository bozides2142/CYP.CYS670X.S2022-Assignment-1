"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.APM_SERVER = void 0;
exports.getPackagePolicyWithAgentConfigurations = getPackagePolicyWithAgentConfigurations;
exports.registerFleetPolicyCallbacks = registerFleetPolicyCallbacks;

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _setup_request = require("../../lib/helpers/setup_request");

var _merge_package_policy_with_apm = require("./merge_package_policy_with_apm");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function registerFleetPolicyCallbacks({
  plugins,
  ruleDataClient,
  config,
  logger,
  kibanaVersion
}) {
  if (!plugins.fleet) {
    return;
  }

  const fleetPluginStart = await plugins.fleet.start(); // Registers a callback invoked when a policy is created to populate the APM
  // integration policy with pre-existing agent configurations

  registerPackagePolicyExternalCallback({
    fleetPluginStart,
    callbackName: 'packagePolicyCreate',
    plugins,
    ruleDataClient,
    config,
    logger,
    kibanaVersion
  }); // Registers a callback invoked when a policy is updated to populate the APM
  // integration policy with existing agent configurations

  registerPackagePolicyExternalCallback({
    fleetPluginStart,
    callbackName: 'packagePolicyUpdate',
    plugins,
    ruleDataClient,
    config,
    logger,
    kibanaVersion
  });
}

function registerPackagePolicyExternalCallback({
  fleetPluginStart,
  callbackName,
  plugins,
  ruleDataClient,
  config,
  logger,
  kibanaVersion
}) {
  const callbackFn = async (packagePolicy, context, request) => {
    var _packagePolicy$packag;

    if (((_packagePolicy$packag = packagePolicy.package) === null || _packagePolicy$packag === void 0 ? void 0 : _packagePolicy$packag.name) !== 'apm') {
      return packagePolicy;
    }

    const setup = await (0, _setup_request.setupRequest)({
      context: context,
      params: {
        query: {
          _inspect: false
        }
      },
      core: null,
      plugins,
      request,
      config,
      logger,
      ruleDataClient,
      kibanaVersion
    });
    return await (0, _merge_package_policy_with_apm.mergePackagePolicyWithApm)({
      setup,
      fleetPluginStart,
      packagePolicy
    });
  };

  fleetPluginStart.registerExternalCallback(callbackName, callbackFn);
}

const APM_SERVER = 'apm-server'; // Immutable function applies the given package policy with a set of agent configurations

exports.APM_SERVER = APM_SERVER;

function getPackagePolicyWithAgentConfigurations(packagePolicy, agentConfigurations) {
  var _firstInput$config;

  const [firstInput, ...restInputs] = packagePolicy.inputs;
  const apmServerValue = firstInput === null || firstInput === void 0 ? void 0 : (_firstInput$config = firstInput.config) === null || _firstInput$config === void 0 ? void 0 : _firstInput$config[APM_SERVER].value;
  return { ...packagePolicy,
    inputs: [{ ...firstInput,
      config: { ...firstInput.config,
        [APM_SERVER]: {
          value: { ...apmServerValue,
            agent_config: agentConfigurations.map(configuration => ({
              service: configuration.service,
              config: configuration.settings,
              etag: configuration.etag,
              [_elasticsearch_fieldnames.AGENT_NAME]: configuration.agent_name
            }))
          }
        }
      }
    }, ...restInputs]
  };
}