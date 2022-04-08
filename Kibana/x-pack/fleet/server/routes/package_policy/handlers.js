"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.upgradePackagePolicyHandler = exports.updatePackagePolicyHandler = exports.getPackagePoliciesHandler = exports.getOnePackagePolicyHandler = exports.dryRunUpgradePackagePolicyHandler = exports.deletePackagePolicyHandler = exports.createPackagePolicyHandler = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _server = require("../../../../../../src/core/server");

var _services = require("../../services");

var _errors = require("../../errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getPackagePoliciesHandler = async (context, request, response) => {
  const soClient = context.core.savedObjects.client;

  try {
    const {
      items,
      total,
      page,
      perPage
    } = await _services.packagePolicyService.list(soClient, request.query);
    return response.ok({
      body: {
        items,
        total,
        page,
        perPage
      }
    });
  } catch (error) {
    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.getPackagePoliciesHandler = getPackagePoliciesHandler;

const getOnePackagePolicyHandler = async (context, request, response) => {
  const soClient = context.core.savedObjects.client;
  const {
    packagePolicyId
  } = request.params;

  const notFoundResponse = () => response.notFound({
    body: {
      message: `Package policy ${packagePolicyId} not found`
    }
  });

  try {
    const packagePolicy = await _services.packagePolicyService.get(soClient, packagePolicyId);

    if (packagePolicy) {
      return response.ok({
        body: {
          item: packagePolicy
        }
      });
    } else {
      return notFoundResponse();
    }
  } catch (error) {
    if (_server.SavedObjectsErrorHelpers.isNotFoundError(error)) {
      return notFoundResponse();
    } else {
      return (0, _errors.defaultIngestErrorHandler)({
        error,
        response
      });
    }
  }
};

exports.getOnePackagePolicyHandler = getOnePackagePolicyHandler;

const createPackagePolicyHandler = async (context, request, response) => {
  var _appContextService$ge;

  const soClient = context.fleet.epm.internalSoClient;
  const esClient = context.core.elasticsearch.client.asInternalUser;
  const user = ((_appContextService$ge = _services.appContextService.getSecurity()) === null || _appContextService$ge === void 0 ? void 0 : _appContextService$ge.authc.getCurrentUser(request)) || undefined;
  const {
    force,
    ...newPolicy
  } = request.body;
  const spaceId = context.fleet.spaceId;

  try {
    const newPackagePolicy = await _services.packagePolicyService.enrichPolicyWithDefaultsFromPackage(soClient, newPolicy);
    const newData = await _services.packagePolicyService.runExternalCallbacks('packagePolicyCreate', newPackagePolicy, context, request); // Create package policy

    const packagePolicy = await _services.packagePolicyService.create(soClient, esClient, newData, {
      user,
      force,
      spaceId
    });
    const body = {
      item: packagePolicy
    };
    return response.ok({
      body
    });
  } catch (error) {
    if (error.statusCode) {
      return response.customError({
        statusCode: error.statusCode,
        body: {
          message: error.message
        }
      });
    }

    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.createPackagePolicyHandler = createPackagePolicyHandler;

const updatePackagePolicyHandler = async (context, request, response) => {
  var _appContextService$ge2, _body$name, _body$description, _body$namespace, _body$policy_id, _body$enabled, _body$output_id, _body$package, _body$inputs, _body$vars;

  const soClient = context.core.savedObjects.client;
  const esClient = context.core.elasticsearch.client.asInternalUser;
  const user = ((_appContextService$ge2 = _services.appContextService.getSecurity()) === null || _appContextService$ge2 === void 0 ? void 0 : _appContextService$ge2.authc.getCurrentUser(request)) || undefined;
  const packagePolicy = await _services.packagePolicyService.get(soClient, request.params.packagePolicyId);

  if (!packagePolicy) {
    throw _boom.default.notFound('Package policy not found');
  }

  const body = { ...request.body
  }; // removed fields not recognized by schema

  const packagePolicyInputs = packagePolicy.inputs.map(input => {
    const newInput = { ...input,
      streams: input.streams.map(stream => {
        const newStream = { ...stream
        };
        delete newStream.compiled_stream;
        return newStream;
      })
    };
    delete newInput.compiled_input;
    return newInput;
  }); // listing down accepted properties, because loaded packagePolicy contains some that are not accepted in update

  let newData = { ...body,
    name: (_body$name = body.name) !== null && _body$name !== void 0 ? _body$name : packagePolicy.name,
    description: (_body$description = body.description) !== null && _body$description !== void 0 ? _body$description : packagePolicy.description,
    namespace: (_body$namespace = body.namespace) !== null && _body$namespace !== void 0 ? _body$namespace : packagePolicy.namespace,
    policy_id: (_body$policy_id = body.policy_id) !== null && _body$policy_id !== void 0 ? _body$policy_id : packagePolicy.policy_id,
    enabled: (_body$enabled = body.enabled) !== null && _body$enabled !== void 0 ? _body$enabled : packagePolicy.enabled,
    output_id: (_body$output_id = body.output_id) !== null && _body$output_id !== void 0 ? _body$output_id : packagePolicy.output_id,
    package: (_body$package = body.package) !== null && _body$package !== void 0 ? _body$package : packagePolicy.package,
    inputs: (_body$inputs = body.inputs) !== null && _body$inputs !== void 0 ? _body$inputs : packagePolicyInputs,
    vars: (_body$vars = body.vars) !== null && _body$vars !== void 0 ? _body$vars : packagePolicy.vars
  };

  try {
    var _packagePolicy$packag;

    newData = await _services.packagePolicyService.runExternalCallbacks('packagePolicyUpdate', newData, context, request);
    const updatedPackagePolicy = await _services.packagePolicyService.update(soClient, esClient, request.params.packagePolicyId, newData, {
      user
    }, (_packagePolicy$packag = packagePolicy.package) === null || _packagePolicy$packag === void 0 ? void 0 : _packagePolicy$packag.version);
    return response.ok({
      body: {
        item: updatedPackagePolicy
      }
    });
  } catch (error) {
    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.updatePackagePolicyHandler = updatePackagePolicyHandler;

const deletePackagePolicyHandler = async (context, request, response) => {
  var _appContextService$ge3;

  const soClient = context.core.savedObjects.client;
  const esClient = context.core.elasticsearch.client.asInternalUser;
  const user = ((_appContextService$ge3 = _services.appContextService.getSecurity()) === null || _appContextService$ge3 === void 0 ? void 0 : _appContextService$ge3.authc.getCurrentUser(request)) || undefined;

  try {
    const body = await _services.packagePolicyService.delete(soClient, esClient, request.body.packagePolicyIds, {
      user,
      force: request.body.force
    });

    try {
      await _services.packagePolicyService.runExternalCallbacks('postPackagePolicyDelete', body, context, request);
    } catch (error) {
      const logger = _services.appContextService.getLogger();

      logger.error(`An error occurred executing external callback: ${error}`);
      logger.error(error);
    }

    return response.ok({
      body
    });
  } catch (error) {
    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.deletePackagePolicyHandler = deletePackagePolicyHandler;

const upgradePackagePolicyHandler = async (context, request, response) => {
  var _appContextService$ge4;

  const soClient = context.core.savedObjects.client;
  const esClient = context.core.elasticsearch.client.asInternalUser;
  const user = ((_appContextService$ge4 = _services.appContextService.getSecurity()) === null || _appContextService$ge4 === void 0 ? void 0 : _appContextService$ge4.authc.getCurrentUser(request)) || undefined;

  try {
    const body = await _services.packagePolicyService.upgrade(soClient, esClient, request.body.packagePolicyIds, {
      user
    });
    const firstFatalError = body.find(item => item.statusCode && item.statusCode !== 200);

    if (firstFatalError) {
      return response.customError({
        statusCode: firstFatalError.statusCode,
        body: {
          message: firstFatalError.body.message
        }
      });
    }

    return response.ok({
      body
    });
  } catch (error) {
    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.upgradePackagePolicyHandler = upgradePackagePolicyHandler;

const dryRunUpgradePackagePolicyHandler = async (context, request, response) => {
  const soClient = context.core.savedObjects.client;

  try {
    const body = [];
    const {
      packagePolicyIds
    } = request.body;

    for (const id of packagePolicyIds) {
      const result = await _services.packagePolicyService.getUpgradeDryRunDiff(soClient, id);
      body.push(result);
    }

    const firstFatalError = body.find(item => item.statusCode && item.statusCode !== 200);

    if (firstFatalError) {
      return response.customError({
        statusCode: firstFatalError.statusCode,
        body: {
          message: firstFatalError.body.message
        }
      });
    }

    return response.ok({
      body
    });
  } catch (error) {
    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.dryRunUpgradePackagePolicyHandler = dryRunUpgradePackagePolicyHandler;