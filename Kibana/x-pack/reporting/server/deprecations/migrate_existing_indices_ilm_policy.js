"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDeprecationsInfo = void 0;

var _i18n = require("@kbn/i18n");

var _constants = require("../../common/constants");

var _deprecations = require("../lib/deprecations");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getDeprecationsInfo = async ({
  esClient
}, {
  reportingCore
}) => {
  const store = await reportingCore.getStore();
  const indexPattern = store.getReportingIndexPattern();
  const migrationStatus = await _deprecations.deprecations.checkIlmMigrationStatus({
    reportingCore,
    elasticsearchClient: esClient.asInternalUser
  });

  if (migrationStatus !== 'ok') {
    return [{
      title: _i18n.i18n.translate('xpack.reporting.deprecations.migrateIndexIlmPolicyActionTitle', {
        defaultMessage: 'Found reporting indices managed by custom ILM policy.'
      }),
      level: 'warning',
      message: _i18n.i18n.translate('xpack.reporting.deprecations.migrateIndexIlmPolicyActionMessage', {
        defaultMessage: `New reporting indices will be managed by the "{reportingIlmPolicy}" provisioned ILM policy. You must edit this policy to manage the report lifecycle. This change targets all indices prefixed with "{indexPattern}".`,
        values: {
          reportingIlmPolicy: _constants.ILM_POLICY_NAME,
          indexPattern
        }
      }),
      correctiveActions: {
        manualSteps: [_i18n.i18n.translate('xpack.reporting.deprecations.migrateIndexIlmPolicy.manualStepOneMessage', {
          defaultMessage: 'Update all reporting indices to use the "{reportingIlmPolicy}" policy using the index settings API.',
          values: {
            reportingIlmPolicy: _constants.ILM_POLICY_NAME
          }
        })],
        api: {
          method: 'PUT',
          path: _constants.API_MIGRATE_ILM_POLICY_URL
        }
      }
    }];
  }

  return [];
};

exports.getDeprecationsInfo = getDeprecationsInfo;