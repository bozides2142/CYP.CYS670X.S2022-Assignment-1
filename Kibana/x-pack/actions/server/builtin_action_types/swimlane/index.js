"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getActionType = getActionType;

var _lodash = require("lodash");

var _i18n = require("@kbn/i18n");

var _configSchema = require("@kbn/config-schema");

var _validators = require("./validators");

var _schema = require("./schema");

var _service = require("./service");

var _api = require("./api");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const supportedSubActions = ['pushToService']; // action type definition

function getActionType(params) {
  const {
    logger,
    configurationUtilities
  } = params;
  return {
    id: '.swimlane',
    minimumLicenseRequired: 'gold',
    name: _i18n.i18n.translate('xpack.actions.builtin.swimlaneTitle', {
      defaultMessage: 'Swimlane'
    }),
    validate: {
      config: _configSchema.schema.object(_schema.SwimlaneServiceConfiguration, {
        validate: (0, _lodash.curry)(_validators.validate.config)(configurationUtilities)
      }),
      secrets: _configSchema.schema.object(_schema.SwimlaneSecretsConfiguration, {
        validate: (0, _lodash.curry)(_validators.validate.secrets)(configurationUtilities)
      }),
      params: _schema.ExecutorParamsSchema
    },
    executor: (0, _lodash.curry)(executor)({
      logger,
      configurationUtilities
    })
  };
}

async function executor({
  logger,
  configurationUtilities
}, execOptions) {
  var _data;

  const {
    actionId,
    config,
    params,
    secrets
  } = execOptions;
  const {
    subAction,
    subActionParams
  } = params;
  let data = null;
  const externalService = (0, _service.createExternalService)({
    config,
    secrets
  }, logger, configurationUtilities);

  if (!_api.api[subAction]) {
    const errorMessage = `[Action][ExternalService] -> [Swimlane] Unsupported subAction type ${subAction}.`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  if (!supportedSubActions.includes(subAction)) {
    const errorMessage = `[Action][ExternalService] -> [Swimlane] subAction ${subAction} not implemented.`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  if (subAction === 'pushToService') {
    const pushToServiceParams = subActionParams;
    data = await _api.api.pushToService({
      externalService,
      params: pushToServiceParams,
      logger
    });
    logger.debug(`response push to service for incident id: ${data.id}`);
  }

  return {
    status: 'ok',
    data: (_data = data) !== null && _data !== void 0 ? _data : {},
    actionId
  };
}