"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deprecations = void 0;

var _elasticsearch = require("@elastic/elasticsearch");

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _i18n = require("@kbn/i18n");

var _check_ilm_migration_status = require("./check_ilm_migration_status");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function deprecationError(title, error) {
  if (getErrorStatusCode(error) === 403) {
    return [{
      title,
      level: 'fetch_error',
      // NOTE: is fetch_error not shown in the Upgrade Assistant UI?
      deprecationType: 'feature',
      message: _i18n.i18n.translate('xpack.reporting.deprecations.reportingRole.forbiddenErrorMessage', {
        defaultMessage: 'You do not have enough permissions to fix this deprecation.'
      }),
      documentationUrl: `https://www.elastic.co/guide/en/kibana/current/xpack-security.html#_required_permissions_7`,
      correctiveActions: {
        manualSteps: [_i18n.i18n.translate('xpack.reporting.deprecations.reportingRole.forbiddenErrorCorrectiveAction', {
          defaultMessage: 'Make sure you have a "manage_security" cluster privilege assigned.'
        })]
      }
    }];
  }

  return [{
    title,
    level: 'fetch_error',
    // NOTE: is fetch_error not shown in the Upgrade Assistant UI?
    deprecationType: 'feature',
    message: _i18n.i18n.translate('xpack.reporting.deprecations.reportingRole.unknownErrorMessage', {
      defaultMessage: 'Failed to perform deprecation check. Check Kibana logs for more details.'
    }),
    correctiveActions: {
      manualSteps: [_i18n.i18n.translate('xpack.reporting.deprecations.reportingRole.unknownErrorCorrectiveAction', {
        defaultMessage: 'Check Kibana logs for more details.'
      })]
    }
  }];
}

function getErrorStatusCode(error) {
  if (error instanceof _elasticsearch.errors.ResponseError) {
    return error.statusCode;
  }

  return _boom.default.isBoom(error) ? error.output.statusCode : error.statusCode || error.status;
}

function getDetailedErrorMessage(error) {
  if (error instanceof _elasticsearch.errors.ResponseError) {
    return JSON.stringify(error.body);
  }

  if (_boom.default.isBoom(error)) {
    return JSON.stringify(error.output.payload);
  }

  return error.message;
}

const deprecations = {
  checkIlmMigrationStatus: _check_ilm_migration_status.checkIlmMigrationStatus,
  deprecationError,
  getDetailedErrorMessage,
  getErrorStatusCode
};
exports.deprecations = deprecations;