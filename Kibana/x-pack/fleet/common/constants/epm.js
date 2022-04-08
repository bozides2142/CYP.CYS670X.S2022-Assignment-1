"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.monitoringTypes = exports.installationStatuses = exports.dataTypes = exports.autoUpgradePoliciesPackages = exports.autoUpdatePackages = exports.agentAssetTypes = exports.STANDALONE_RUN_INSTRUCTIONS_WINDOWS = exports.STANDALONE_RUN_INSTRUCTIONS_LINUXMAC = exports.PACKAGES_SAVED_OBJECT_TYPE = exports.MAX_TIME_COMPLETE_INSTALL = exports.KUBERNETES_RUN_INSTRUCTIONS = exports.FLEET_SYSTEM_PACKAGE = exports.FLEET_SYNTHETICS_PACKAGE = exports.FLEET_SERVER_PACKAGE = exports.FLEET_KUBERNETES_PACKAGE = exports.FLEET_ENDPOINT_PACKAGE = exports.FLEET_ELASTIC_AGENT_PACKAGE = exports.FLEET_APM_PACKAGE = exports.ASSETS_SAVED_OBJECT_TYPE = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const PACKAGES_SAVED_OBJECT_TYPE = 'epm-packages';
exports.PACKAGES_SAVED_OBJECT_TYPE = PACKAGES_SAVED_OBJECT_TYPE;
const ASSETS_SAVED_OBJECT_TYPE = 'epm-packages-assets';
exports.ASSETS_SAVED_OBJECT_TYPE = ASSETS_SAVED_OBJECT_TYPE;
const MAX_TIME_COMPLETE_INSTALL = 60000;
exports.MAX_TIME_COMPLETE_INSTALL = MAX_TIME_COMPLETE_INSTALL;
const FLEET_SYSTEM_PACKAGE = 'system';
exports.FLEET_SYSTEM_PACKAGE = FLEET_SYSTEM_PACKAGE;
const FLEET_ELASTIC_AGENT_PACKAGE = 'elastic_agent';
exports.FLEET_ELASTIC_AGENT_PACKAGE = FLEET_ELASTIC_AGENT_PACKAGE;
const FLEET_SERVER_PACKAGE = 'fleet_server';
exports.FLEET_SERVER_PACKAGE = FLEET_SERVER_PACKAGE;
const FLEET_ENDPOINT_PACKAGE = 'endpoint';
exports.FLEET_ENDPOINT_PACKAGE = FLEET_ENDPOINT_PACKAGE;
const FLEET_APM_PACKAGE = 'apm';
exports.FLEET_APM_PACKAGE = FLEET_APM_PACKAGE;
const FLEET_SYNTHETICS_PACKAGE = 'synthetics';
exports.FLEET_SYNTHETICS_PACKAGE = FLEET_SYNTHETICS_PACKAGE;
const FLEET_KUBERNETES_PACKAGE = 'kubernetes';
exports.FLEET_KUBERNETES_PACKAGE = FLEET_KUBERNETES_PACKAGE;
const KUBERNETES_RUN_INSTRUCTIONS = 'kubectl apply -f elastic-agent-standalone-kubernetes.yaml';
exports.KUBERNETES_RUN_INSTRUCTIONS = KUBERNETES_RUN_INSTRUCTIONS;
const STANDALONE_RUN_INSTRUCTIONS_LINUXMAC = 'sudo ./elastic-agent install';
exports.STANDALONE_RUN_INSTRUCTIONS_LINUXMAC = STANDALONE_RUN_INSTRUCTIONS_LINUXMAC;
const STANDALONE_RUN_INSTRUCTIONS_WINDOWS = '.\\elastic-agent.exe install';
/*
 Package rules:
|               | autoUpdatePackages |
|---------------|:------------------:|
| Auto-updates  |          ✔️         |


We also define "auto upgrade policies" packages below. These are packages that are considered "stack-aligned"
and require policies to be auto-upgraded in order to properly function. Commonly, packages that ship custom policy
editor UI's in the Kibana codebase will be included in this set of packages to avoid backwards-compatibility concerns
in their custom policy editor implementations.

*/

exports.STANDALONE_RUN_INSTRUCTIONS_WINDOWS = STANDALONE_RUN_INSTRUCTIONS_WINDOWS;
const autoUpdatePackages = [FLEET_ENDPOINT_PACKAGE, FLEET_APM_PACKAGE, FLEET_SYNTHETICS_PACKAGE];
exports.autoUpdatePackages = autoUpdatePackages;
const autoUpgradePoliciesPackages = [FLEET_APM_PACKAGE, FLEET_SYNTHETICS_PACKAGE];
exports.autoUpgradePoliciesPackages = autoUpgradePoliciesPackages;
const agentAssetTypes = {
  Input: 'input'
};
exports.agentAssetTypes = agentAssetTypes;
const dataTypes = {
  Logs: 'logs',
  Metrics: 'metrics'
}; // currently identical but may be a subset or otherwise different some day

exports.dataTypes = dataTypes;
const monitoringTypes = Object.values(dataTypes);
exports.monitoringTypes = monitoringTypes;
const installationStatuses = {
  Installed: 'installed',
  Installing: 'installing',
  InstallFailed: 'install_failed',
  NotInstalled: 'not_installed',
  InstalledBundled: 'installed_bundled'
};
exports.installationStatuses = installationStatuses;