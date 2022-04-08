"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStaticDataView = createStaticDataView;

var _server = require("../../../../../../src/core/server");

var _index_pattern_constants = require("../../../common/index_pattern_constants");

var _has_historical_agent_data = require("../../routes/historical_data/has_historical_agent_data");

var _with_apm_span = require("../../utils/with_apm_span");

var _get_apm_data_view_title = require("./get_apm_data_view_title");

var _get_apm_data_view_attributes = require("./get_apm_data_view_attributes");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function createStaticDataView({
  setup,
  config,
  savedObjectsClient,
  spaceId
}) {
  return (0, _with_apm_span.withApmSpan)('create_static_data_view', async () => {
    // don't auto-create APM data view if it's been disabled via the config
    if (!config.autoCreateApmDataView) {
      return false;
    } // Discover and other apps will throw errors if an data view exists without having matching indices.
    // The following ensures the data view is only created if APM data is found


    const hasData = await (0, _has_historical_agent_data.hasHistoricalAgentData)(setup);

    if (!hasData) {
      return false;
    }

    const apmDataViewTitle = (0, _get_apm_data_view_title.getApmDataViewTitle)(setup.indices);
    const forceOverwrite = await getForceOverwrite({
      apmDataViewTitle,
      savedObjectsClient
    });

    try {
      await (0, _with_apm_span.withApmSpan)('create_index_pattern_saved_object', () => savedObjectsClient.create('index-pattern', (0, _get_apm_data_view_attributes.getApmDataViewAttributes)(apmDataViewTitle), {
        id: _index_pattern_constants.APM_STATIC_INDEX_PATTERN_ID,
        overwrite: forceOverwrite,
        namespace: spaceId
      }));
      return true;
    } catch (e) {
      // if the data view (saved object) already exists a conflict error (code: 409) will be thrown
      // that error should be silenced
      if (_server.SavedObjectsErrorHelpers.isConflictError(e)) {
        return false;
      }

      throw e;
    }
  });
} // force an overwrite of the data view if the data view has been changed


async function getForceOverwrite({
  savedObjectsClient,
  apmDataViewTitle
}) {
  try {
    const existingDataView = await savedObjectsClient.get('index-pattern', _index_pattern_constants.APM_STATIC_INDEX_PATTERN_ID); // if the existing data view does not matches the new one, force an update

    return existingDataView.attributes.title !== apmDataViewTitle;
  } catch (e) {
    // ignore exception if the data view (saved object) is not found
    if (_server.SavedObjectsErrorHelpers.isNotFoundError(e)) {
      return false;
    }

    throw e;
  }
}