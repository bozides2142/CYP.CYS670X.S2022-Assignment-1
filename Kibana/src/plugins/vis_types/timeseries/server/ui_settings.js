"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUiSettings = void 0;

var _i18n = require("@kbn/i18n");

var _configSchema = require("@kbn/config-schema");

var _constants = require("../common/constants");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getUiSettings = () => ({
  [_constants.UI_SETTINGS.MAX_BUCKETS_SETTING]: {
    name: _i18n.i18n.translate('visTypeTimeseries.advancedSettings.maxBucketsTitle', {
      defaultMessage: 'TSVB buckets limit'
    }),
    value: 2000,
    description: _i18n.i18n.translate('visTypeTimeseries.advancedSettings.maxBucketsText', {
      defaultMessage: 'Affects the TSVB histogram density. Must be set higher than "histogram:maxBars".'
    }),
    schema: _configSchema.schema.number()
  },
  [_constants.UI_SETTINGS.ALLOW_STRING_INDICES]: {
    name: _i18n.i18n.translate('visTypeTimeseries.advancedSettings.allowStringIndicesTitle', {
      defaultMessage: 'Allow string indices in TSVB'
    }),
    value: false,
    requiresPageReload: true,
    description: _i18n.i18n.translate('visTypeTimeseries.advancedSettings.allowStringIndicesText', {
      defaultMessage: 'Enables you to query Elasticsearch indices in <strong>TSVB</strong> visualizations.'
    }),
    schema: _configSchema.schema.boolean()
  },
  [_constants.UI_SETTINGS.ALLOW_CHECKING_FOR_FAILED_SHARDS]: {
    name: _i18n.i18n.translate('visTypeTimeseries.advancedSettings.allowCheckingForFailedShardsTitle', {
      defaultMessage: 'Show TSVB request shard failures'
    }),
    value: true,
    description: _i18n.i18n.translate('visTypeTimeseries.advancedSettings.allowCheckingForFailedShardsText', {
      defaultMessage: 'Show warning message for partial data in TSVB charts if the request succeeds for some shards but fails for others.'
    }),
    schema: _configSchema.schema.boolean()
  }
});

exports.getUiSettings = getUiSettings;