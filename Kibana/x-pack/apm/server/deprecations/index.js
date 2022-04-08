"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDeprecations = getDeprecations;

var _i18n = require("@kbn/i18n");

var _lodash = require("lodash");

var _get_cloud_apm_package_policy = require("../routes/fleet/get_cloud_apm_package_policy");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getDeprecations({
  cloudSetup,
  fleet,
  branch
}) {
  return async ({
    savedObjectsClient
  }) => {
    const deprecations = [];

    if (!fleet) {
      return deprecations;
    } // TODO: remove when docs support "main"


    const docBranch = branch === 'main' ? 'master' : branch;
    const fleetPluginStart = await fleet.start();
    const cloudAgentPolicy = await (0, _get_cloud_apm_package_policy.getCloudAgentPolicy)({
      fleetPluginStart,
      savedObjectsClient
    });
    const isCloudEnabled = !!(cloudSetup !== null && cloudSetup !== void 0 && cloudSetup.isCloudEnabled);
    const hasCloudAgentPolicy = !(0, _lodash.isEmpty)(cloudAgentPolicy);
    const hasAPMPackagePolicy = !(0, _lodash.isEmpty)((0, _get_cloud_apm_package_policy.getApmPackagePolicy)(cloudAgentPolicy));

    if (isCloudEnabled && hasCloudAgentPolicy && !hasAPMPackagePolicy) {
      deprecations.push({
        title: _i18n.i18n.translate('xpack.apm.deprecations.legacyModeTitle', {
          defaultMessage: 'APM Server running in legacy mode'
        }),
        message: _i18n.i18n.translate('xpack.apm.deprecations.message', {
          defaultMessage: 'Running the APM Server binary directly is considered a legacy option and will be deprecated and removed in the future.'
        }),
        documentationUrl: `https://www.elastic.co/guide/en/apm/server/${docBranch}/apm-integration.html`,
        level: 'warning',
        correctiveActions: {
          manualSteps: [_i18n.i18n.translate('xpack.apm.deprecations.steps.apm', {
            defaultMessage: 'Navigate to Observability/APM'
          }), _i18n.i18n.translate('xpack.apm.deprecations.steps.settings', {
            defaultMessage: 'Click on "Settings"'
          }), _i18n.i18n.translate('xpack.apm.deprecations.steps.schema', {
            defaultMessage: 'Select "Schema" tab'
          }), _i18n.i18n.translate('xpack.apm.deprecations.steps.switch', {
            defaultMessage: 'Click "Switch to Elastic Agent". You will be guided through the process'
          })]
        }
      });
    }

    return deprecations;
  };
}