"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCaseMetrics = void 0;

var _lodash = require("lodash");

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _api = require("../../../common/api");

var _authorization = require("../../authorization");

var _error = require("../../common/error");

var _count = require("./alerts/count");

var _details = require("./alerts/details");

var _actions = require("./actions");

var _connectors = require("./connectors");

var _lifespan = require("./lifespan");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getCaseMetrics = async (params, casesClient, clientArgs) => {
  const {
    logger
  } = clientArgs;

  try {
    await checkAuthorization(params, clientArgs);
    const handlers = buildHandlers(params, casesClient, clientArgs);
    const computedMetrics = await Promise.all(Array.from(handlers).map(async handler => {
      return handler.compute();
    }));
    const mergedResults = computedMetrics.reduce((acc, metric) => {
      return (0, _lodash.merge)(acc, metric);
    }, {});
    return _api.CaseMetricsResponseRt.encode(mergedResults);
  } catch (error) {
    throw (0, _error.createCaseError)({
      logger,
      message: `Failed to retrieve metrics within client for case id: ${params.caseId}: ${error}`,
      error
    });
  }
};

exports.getCaseMetrics = getCaseMetrics;

const buildHandlers = (params, casesClient, clientArgs) => {
  const handlers = [_count.AlertsCount, _details.AlertDetails, _actions.Actions, _connectors.Connectors, _lifespan.Lifespan].map(ClassName => new ClassName({
    caseId: params.caseId,
    casesClient,
    clientArgs
  }));
  const uniqueFeatures = new Set(params.features);
  const handlerFeatures = new Set();
  const handlersToExecute = new Set();

  for (const handler of handlers) {
    for (const handlerFeature of handler.getFeatures()) {
      if (uniqueFeatures.has(handlerFeature)) {
        var _handler$setupFeature;

        (_handler$setupFeature = handler.setupFeature) === null || _handler$setupFeature === void 0 ? void 0 : _handler$setupFeature.call(handler, handlerFeature);
        handlersToExecute.add(handler);
      }

      handlerFeatures.add(handlerFeature);
    }
  }

  checkAndThrowIfInvalidFeatures(params, handlerFeatures);
  return handlersToExecute;
};

const checkAndThrowIfInvalidFeatures = (params, handlerFeatures) => {
  const invalidFeatures = params.features.filter(feature => !handlerFeatures.has(feature));

  if (invalidFeatures.length > 0) {
    const invalidFeaturesAsString = invalidFeatures.join(', ');
    const validFeaturesAsString = [...handlerFeatures.keys()].sort().join(', ');
    throw _boom.default.badRequest(`invalid features: [${invalidFeaturesAsString}], please only provide valid features: [${validFeaturesAsString}]`);
  }
};

const checkAuthorization = async (params, clientArgs) => {
  const {
    caseService,
    unsecuredSavedObjectsClient,
    authorization
  } = clientArgs;
  const caseInfo = await caseService.getCase({
    unsecuredSavedObjectsClient,
    id: params.caseId
  });
  await authorization.ensureAuthorized({
    operation: _authorization.Operations.getCaseMetrics,
    entities: [{
      owner: caseInfo.attributes.owner,
      id: caseInfo.id
    }]
  });
};