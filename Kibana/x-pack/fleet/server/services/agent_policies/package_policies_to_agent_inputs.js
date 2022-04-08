"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.storedPackagePolicyToAgentInputs = exports.storedPackagePoliciesToAgentInputs = void 0;

var _lodash = require("lodash");

var _common = require("../../../common");

var _constants = require("../../constants");

var _packages = require("../epm/packages");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const isPolicyEnabled = packagePolicy => {
  return packagePolicy.enabled && packagePolicy.inputs && packagePolicy.inputs.length;
};

const storedPackagePolicyToAgentInputs = (packagePolicy, packageInfo, outputId = _constants.DEFAULT_OUTPUT.name) => {
  const fullInputs = [];

  if (!isPolicyEnabled(packagePolicy)) {
    return fullInputs;
  } // Marks to skip appending input information to package policy ID to make it unique if package is "limited":
  // this means that only one policy for the package can exist on the agent policy, so its ID is already unique


  const appendInputId = packageInfo && (0, _common.isPackageLimited)(packageInfo) ? false : true;
  packagePolicy.inputs.forEach(input => {
    if (!input.enabled) {
      return;
    }

    const inputId = appendInputId ? `${input.type}${input.policy_template ? `-${input.policy_template}-` : '-'}${packagePolicy.id}` : packagePolicy.id;
    const fullInput = {
      id: inputId,
      revision: packagePolicy.revision,
      name: packagePolicy.name,
      type: input.type,
      data_stream: {
        namespace: packagePolicy.namespace || 'default'
      },
      use_output: outputId,
      ...(input.compiled_input || {}),
      ...(input.streams.length ? {
        streams: input.streams.filter(stream => stream.enabled).map(stream => {
          const fullStream = {
            id: stream.id,
            data_stream: stream.data_stream,
            ...stream.compiled_stream,
            ...Object.entries(stream.config || {}).reduce((acc, [key, {
              value
            }]) => {
              acc[key] = value;
              return acc;
            }, {})
          };
          return fullStream;
        })
      } : {})
    }; // deeply merge the input.config values with the full policy input

    (0, _lodash.merge)(fullInput, Object.entries(input.config || {}).reduce((acc, [key, {
      value
    }]) => ({ ...acc,
      [key]: value
    }), {}));

    if (packagePolicy.package) {
      fullInput.meta = {
        package: {
          name: packagePolicy.package.name,
          version: packagePolicy.package.version
        }
      };
    }

    fullInputs.push(fullInput);
  });
  return fullInputs;
};

exports.storedPackagePolicyToAgentInputs = storedPackagePolicyToAgentInputs;

const storedPackagePoliciesToAgentInputs = async (soClient, packagePolicies, outputId = _constants.DEFAULT_OUTPUT.name) => {
  const fullInputs = [];

  for (const packagePolicy of packagePolicies) {
    if (!isPolicyEnabled(packagePolicy)) {
      continue;
    }

    const packageInfo = packagePolicy.package ? await (0, _packages.getPackageInfo)({
      savedObjectsClient: soClient,
      pkgName: packagePolicy.package.name,
      pkgVersion: packagePolicy.package.version
    }) : undefined;
    fullInputs.push(...storedPackagePolicyToAgentInputs(packagePolicy, packageInfo, outputId));
  }

  return fullInputs;
};

exports.storedPackagePoliciesToAgentInputs = storedPackagePoliciesToAgentInputs;