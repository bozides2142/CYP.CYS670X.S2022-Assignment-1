"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupRequest = setupRequest;

var _license_check = require("../../../common/license_check");

var _common = require("../../../../../../src/plugins/data/common");

var _get_apm_indices = require("../../routes/settings/apm_indices/get_apm_indices");

var _create_apm_event_client = require("./create_es_client/create_apm_event_client");

var _create_internal_es_client = require("./create_es_client/create_internal_es_client");

var _with_apm_span = require("../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function setupRequest({
  context,
  params,
  core,
  plugins,
  request,
  config
}) {
  return (0, _with_apm_span.withApmSpan)('setup_request', async () => {
    const {
      query
    } = params;
    const [indices, includeFrozen] = await Promise.all([(0, _get_apm_indices.getApmIndices)({
      savedObjectsClient: context.core.savedObjects.client,
      config
    }), (0, _with_apm_span.withApmSpan)('get_ui_settings', () => context.core.uiSettings.client.get(_common.UI_SETTINGS.SEARCH_INCLUDE_FROZEN))]);
    return {
      indices,
      apmEventClient: new _create_apm_event_client.APMEventClient({
        esClient: context.core.elasticsearch.client.asCurrentUser,
        debug: query._inspect,
        request,
        indices,
        options: {
          includeFrozen
        }
      }),
      internalClient: (0, _create_internal_es_client.createInternalESClient)({
        context,
        request,
        debug: query._inspect
      }),
      ml: plugins.ml && (0, _license_check.isActivePlatinumLicense)(context.licensing.license) ? getMlSetup(plugins.ml.setup, context.core.savedObjects.client, request) : undefined,
      config
    };
  });
}

function getMlSetup(ml, savedObjectsClient, request) {
  return {
    mlSystem: ml.mlSystemProvider(request, savedObjectsClient),
    anomalyDetectors: ml.anomalyDetectorsProvider(request, savedObjectsClient),
    modules: ml.modulesProvider(request, savedObjectsClient)
  };
}