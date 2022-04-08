"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateConfig = validateConfig;
exports.validateConnector = validateConnector;
exports.validateParams = validateParams;
exports.validateSecrets = validateSecrets;

var _boom = _interopRequireDefault(require("@hapi/boom"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function validateParams(actionType, value) {
  return validateWithSchema(actionType, 'params', value);
}

function validateConfig(actionType, value) {
  return validateWithSchema(actionType, 'config', value);
}

function validateSecrets(actionType, value) {
  return validateWithSchema(actionType, 'secrets', value);
}

function validateConnector(actionType, value) {
  if (actionType.validate && actionType.validate.connector) {
    try {
      const connectorValue = value; // Connector config and secrets should be defined

      if (connectorValue.config == null) {
        throw new Error(`config must be defined`);
      }

      if (connectorValue.secrets == null) {
        throw new Error(`secrets must be defined`);
      }

      const result = actionType.validate.connector(connectorValue.config, connectorValue.secrets);

      if (result !== null) {
        throw new Error(result);
      }
    } catch (err) {
      throw _boom.default.badRequest(`error validating action type connector: ${err.message}`);
    }
  }

  return null;
}

function validateWithSchema(actionType, key, value) {
  if (actionType.validate) {
    let name;

    try {
      switch (key) {
        case 'params':
          name = 'action params';

          if (actionType.validate.params) {
            return actionType.validate.params.validate(value);
          }

          break;

        case 'config':
          name = 'action type config';

          if (actionType.validate.config) {
            return actionType.validate.config.validate(value);
          }

          break;

        case 'secrets':
          name = 'action type secrets';

          if (actionType.validate.secrets) {
            return actionType.validate.secrets.validate(value);
          }

          break;

        default:
          // should never happen, but left here for future-proofing
          throw new Error(`invalid actionType validate key: ${key}`);
      }
    } catch (err) {
      // we can't really i18n this yet, since the err.message isn't i18n'd itself
      throw _boom.default.badRequest(`error validating ${name}: ${err.message}`);
    }
  }

  return value;
}