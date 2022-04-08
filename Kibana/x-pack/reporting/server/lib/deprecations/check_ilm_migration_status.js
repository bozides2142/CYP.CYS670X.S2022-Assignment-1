"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkIlmMigrationStatus = void 0;

var _constants = require("../../../common/constants");

var _ilm_policy_manager = require("../../lib/store/ilm_policy_manager");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const checkIlmMigrationStatus = async ({
  reportingCore,
  elasticsearchClient
}) => {
  const ilmPolicyManager = _ilm_policy_manager.IlmPolicyManager.create({
    client: elasticsearchClient
  });

  if (!(await ilmPolicyManager.doesIlmPolicyExist())) {
    return 'policy-not-found';
  }

  const store = await reportingCore.getStore();
  const indexPattern = store.getReportingIndexPattern();
  const {
    body: reportingIndicesSettings
  } = await elasticsearchClient.indices.getSettings({
    index: indexPattern
  });
  const hasUnmanagedIndices = Object.values(reportingIndicesSettings).some(settings => {
    var _settings$settings, _settings$settings$in, _settings$settings$in2, _settings$settings2, _settings$settings2$i;

    return (settings === null || settings === void 0 ? void 0 : (_settings$settings = settings.settings) === null || _settings$settings === void 0 ? void 0 : (_settings$settings$in = _settings$settings.index) === null || _settings$settings$in === void 0 ? void 0 : (_settings$settings$in2 = _settings$settings$in.lifecycle) === null || _settings$settings$in2 === void 0 ? void 0 : _settings$settings$in2.name) !== _constants.ILM_POLICY_NAME && (settings === null || settings === void 0 ? void 0 : (_settings$settings2 = settings.settings) === null || _settings$settings2 === void 0 ? void 0 : (_settings$settings2$i = _settings$settings2['index.lifecycle']) === null || _settings$settings2$i === void 0 ? void 0 : _settings$settings2$i.name) !== _constants.ILM_POLICY_NAME;
  });
  return hasUnmanagedIndices ? 'indices-not-managed-by-policy' : 'ok';
};

exports.checkIlmMigrationStatus = checkIlmMigrationStatus;