"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createApmArtifact = createApmArtifact;
exports.deleteApmArtifact = deleteApmArtifact;
exports.getCleanedBundleFilePath = getCleanedBundleFilePath;
exports.getPackagePolicyWithSourceMap = getPackagePolicyWithSourceMap;
exports.listArtifacts = listArtifacts;
exports.updateSourceMapsOnFleetPolicies = updateSourceMapsOnFleetPolicies;

var _util = require("util");

var _zlib = require("zlib");

var _get_apm_package_policies = require("./get_apm_package_policies");

var _register_fleet_policy_callbacks = require("./register_fleet_policy_callbacks");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const doUnzip = (0, _util.promisify)(_zlib.unzip);

function decodeArtifacts(artifacts) {
  return Promise.all(artifacts.map(async artifact => {
    const body = await doUnzip(Buffer.from(artifact.body, 'base64'));
    return { ...artifact,
      body: JSON.parse(body.toString())
    };
  }));
}

function getApmArtifactClient(fleetPluginStart) {
  return fleetPluginStart.createArtifactsClient('apm');
}

async function listArtifacts({
  fleetPluginStart
}) {
  const apmArtifactClient = getApmArtifactClient(fleetPluginStart);
  const artifacts = await apmArtifactClient.listArtifacts({
    kuery: 'type: sourcemap'
  });
  return decodeArtifacts(artifacts.items);
}

async function createApmArtifact({
  apmArtifactBody,
  fleetPluginStart
}) {
  const apmArtifactClient = getApmArtifactClient(fleetPluginStart);
  const identifier = `${apmArtifactBody.serviceName}-${apmArtifactBody.serviceVersion}`;
  return apmArtifactClient.createArtifact({
    type: 'sourcemap',
    identifier,
    content: JSON.stringify(apmArtifactBody)
  });
}

async function deleteApmArtifact({
  id,
  fleetPluginStart
}) {
  const apmArtifactClient = getApmArtifactClient(fleetPluginStart);
  return apmArtifactClient.deleteArtifact(id);
}

function getPackagePolicyWithSourceMap({
  packagePolicy,
  artifacts
}) {
  var _firstInput$config;

  const [firstInput, ...restInputs] = packagePolicy.inputs;
  return { ...packagePolicy,
    inputs: [{ ...firstInput,
      config: { ...firstInput.config,
        [_register_fleet_policy_callbacks.APM_SERVER]: {
          value: { ...(firstInput === null || firstInput === void 0 ? void 0 : (_firstInput$config = firstInput.config) === null || _firstInput$config === void 0 ? void 0 : _firstInput$config[_register_fleet_policy_callbacks.APM_SERVER].value),
            rum: {
              source_mapping: {
                metadata: artifacts.map(artifact => ({
                  'service.name': artifact.body.serviceName,
                  'service.version': artifact.body.serviceVersion,
                  'bundle.filepath': artifact.body.bundleFilepath,
                  'sourcemap.url': artifact.relative_url
                }))
              }
            }
          }
        }
      }
    }, ...restInputs]
  };
}

async function updateSourceMapsOnFleetPolicies({
  core,
  fleetPluginStart,
  savedObjectsClient,
  elasticsearchClient
}) {
  const artifacts = await listArtifacts({
    fleetPluginStart
  });
  const apmFleetPolicies = await (0, _get_apm_package_policies.getApmPackgePolicies)({
    core,
    fleetPluginStart
  });
  return Promise.all(apmFleetPolicies.items.map(async item => {
    const {
      id,
      revision,
      updated_at: updatedAt,
      updated_by: updatedBy,
      ...packagePolicy
    } = item;
    const updatedPackagePolicy = getPackagePolicyWithSourceMap({
      packagePolicy,
      artifacts
    });
    await fleetPluginStart.packagePolicyService.update(savedObjectsClient, elasticsearchClient, id, updatedPackagePolicy);
  }));
}

function getCleanedBundleFilePath(bundleFilePath) {
  try {
    const cleanedBundleFilepath = new URL(bundleFilePath);
    return cleanedBundleFilepath.href;
  } catch (e) {
    return bundleFilePath;
  }
}