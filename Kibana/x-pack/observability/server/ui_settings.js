"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uiSettings = void 0;

var _configSchema = require("@kbn/config-schema");

var _i18n = require("@kbn/i18n");

var _common = require("../common");

var _ui_settings_keys = require("../common/ui_settings_keys");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * uiSettings definitions for Observability.
 */


const uiSettings = {
  [_ui_settings_keys.enableInspectEsQueries]: {
    category: [_common.observabilityFeatureId],
    name: _i18n.i18n.translate('xpack.observability.enableInspectEsQueriesExperimentName', {
      defaultMessage: 'Inspect ES queries'
    }),
    value: false,
    description: _i18n.i18n.translate('xpack.observability.enableInspectEsQueriesExperimentDescription', {
      defaultMessage: 'Inspect Elasticsearch queries in API responses.'
    }),
    schema: _configSchema.schema.boolean()
  },
  [_ui_settings_keys.maxSuggestions]: {
    category: [_common.observabilityFeatureId],
    name: _i18n.i18n.translate('xpack.observability.maxSuggestionsUiSettingName', {
      defaultMessage: 'Maximum suggestions'
    }),
    value: 100,
    description: _i18n.i18n.translate('xpack.observability.maxSuggestionsUiSettingDescription', {
      defaultMessage: 'Maximum number of suggestions fetched in autocomplete selection boxes.'
    }),
    schema: _configSchema.schema.number()
  },
  [_ui_settings_keys.enableComparisonByDefault]: {
    category: [_common.observabilityFeatureId],
    name: _i18n.i18n.translate('xpack.observability.enableComparisonByDefault', {
      defaultMessage: 'Comparison feature'
    }),
    value: true,
    description: _i18n.i18n.translate('xpack.observability.enableComparisonByDefaultDescription', {
      defaultMessage: 'Enable the comparison feature in APM app'
    }),
    schema: _configSchema.schema.boolean()
  },
  [_ui_settings_keys.enableInfrastructureView]: {
    category: [_common.observabilityFeatureId],
    name: _i18n.i18n.translate('xpack.observability.enableInfrastructureView', {
      defaultMessage: 'Infrastructure feature'
    }),
    value: false,
    description: _i18n.i18n.translate('xpack.observability.enableInfrastructureViewDescription', {
      defaultMessage: 'Enable the Infrastruture view feature in APM app'
    }),
    schema: _configSchema.schema.boolean()
  }
};
exports.uiSettings = uiSettings;