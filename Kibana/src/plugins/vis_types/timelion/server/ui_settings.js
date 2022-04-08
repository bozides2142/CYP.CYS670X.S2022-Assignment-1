"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUiSettings = getUiSettings;

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
const experimentalLabel = _i18n.i18n.translate('timelion.uiSettings.experimentalLabel', {
  defaultMessage: 'technical preview'
});

function getUiSettings(config) {
  return {
    [_constants.UI_SETTINGS.LEGACY_CHARTS_LIBRARY]: {
      name: _i18n.i18n.translate('timelion.uiSettings.legacyChartsLibraryLabel', {
        defaultMessage: 'Timelion legacy charts library'
      }),
      description: _i18n.i18n.translate('timelion.uiSettings.legacyChartsLibraryDescription', {
        defaultMessage: 'Enables the legacy charts library for timelion charts in Visualize'
      }),
      deprecation: {
        message: _i18n.i18n.translate('timelion.uiSettings.legacyChartsLibraryDeprication', {
          defaultMessage: 'This setting is deprecated and will not be supported in a future version.'
        }),
        docLinksKey: 'timelionSettings'
      },
      value: false,
      category: ['timelion'],
      schema: _configSchema.schema.boolean()
    },
    [_constants.UI_SETTINGS.ES_TIMEFIELD]: {
      name: _i18n.i18n.translate('timelion.uiSettings.timeFieldLabel', {
        defaultMessage: 'Time field'
      }),
      value: '@timestamp',
      description: _i18n.i18n.translate('timelion.uiSettings.timeFieldDescription', {
        defaultMessage: 'Default field containing a timestamp when using {esParam}',
        values: {
          esParam: '.es()'
        }
      }),
      category: ['timelion'],
      schema: _configSchema.schema.string()
    },
    [_constants.UI_SETTINGS.DEFAULT_INDEX]: {
      name: _i18n.i18n.translate('timelion.uiSettings.defaultIndexLabel', {
        defaultMessage: 'Default index'
      }),
      value: '_all',
      description: _i18n.i18n.translate('timelion.uiSettings.defaultIndexDescription', {
        defaultMessage: 'Default elasticsearch index to search with {esParam}',
        values: {
          esParam: '.es()'
        }
      }),
      category: ['timelion'],
      schema: _configSchema.schema.string()
    },
    [_constants.UI_SETTINGS.TARGET_BUCKETS]: {
      name: _i18n.i18n.translate('timelion.uiSettings.targetBucketsLabel', {
        defaultMessage: 'Target buckets'
      }),
      value: 200,
      description: _i18n.i18n.translate('timelion.uiSettings.targetBucketsDescription', {
        defaultMessage: 'The number of buckets to shoot for when using auto intervals'
      }),
      category: ['timelion'],
      schema: _configSchema.schema.number()
    },
    [_constants.UI_SETTINGS.MAX_BUCKETS]: {
      name: _i18n.i18n.translate('timelion.uiSettings.maximumBucketsLabel', {
        defaultMessage: 'Maximum buckets'
      }),
      value: 2000,
      description: _i18n.i18n.translate('timelion.uiSettings.maximumBucketsDescription', {
        defaultMessage: 'The maximum number of buckets a single datasource can return'
      }),
      category: ['timelion'],
      schema: _configSchema.schema.number()
    },
    [_constants.UI_SETTINGS.MIN_INTERVAL]: {
      name: _i18n.i18n.translate('timelion.uiSettings.minimumIntervalLabel', {
        defaultMessage: 'Minimum interval'
      }),
      value: '1ms',
      description: _i18n.i18n.translate('timelion.uiSettings.minimumIntervalDescription', {
        defaultMessage: 'The smallest interval that will be calculated when using "auto"',
        description: '"auto" is a technical value in that context, that should not be translated.'
      }),
      category: ['timelion'],
      schema: _configSchema.schema.string()
    },
    [_constants.UI_SETTINGS.GRAPHITE_URL]: {
      name: _i18n.i18n.translate('timelion.uiSettings.graphiteURLLabel', {
        defaultMessage: 'Graphite URL',
        description: 'The URL should be in the form of https://www.hostedgraphite.com/UID/ACCESS_KEY/graphite'
      }),
      value: config.graphiteUrls && config.graphiteUrls.length ? config.graphiteUrls[0] : null,
      description: _i18n.i18n.translate('timelion.uiSettings.graphiteURLDescription', {
        defaultMessage: '{experimentalLabel} The <a href="https://www.hostedgraphite.com/UID/ACCESS_KEY/graphite" target="_blank" rel="noopener">URL</a> of your graphite host',
        values: {
          experimentalLabel: `<em>[${experimentalLabel}]</em>`
        }
      }),
      type: 'select',
      options: config.graphiteUrls || [],
      category: ['timelion'],
      schema: _configSchema.schema.nullable(_configSchema.schema.string())
    },
    [_constants.UI_SETTINGS.QUANDL_KEY]: {
      name: _i18n.i18n.translate('timelion.uiSettings.quandlKeyLabel', {
        defaultMessage: 'Quandl key'
      }),
      value: 'someKeyHere',
      description: _i18n.i18n.translate('timelion.uiSettings.quandlKeyDescription', {
        defaultMessage: '{experimentalLabel} Your API key from www.quandl.com',
        values: {
          experimentalLabel: `<em>[${experimentalLabel}]</em>`
        }
      }),
      sensitive: true,
      category: ['timelion'],
      schema: _configSchema.schema.string()
    }
  };
}