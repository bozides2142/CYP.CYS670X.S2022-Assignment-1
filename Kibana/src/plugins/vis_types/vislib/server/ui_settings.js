"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUiSettings = void 0;

var _i18n = require("@kbn/i18n");

var _configSchema = require("@kbn/config-schema");

var _common = require("../common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getUiSettings = () => ({
  [_common.HEATMAP_MAX_BUCKETS_SETTING]: {
    name: _i18n.i18n.translate('visTypeVislib.advancedSettings.visualization.heatmap.maxBucketsTitle', {
      defaultMessage: 'Heatmap maximum buckets'
    }),
    value: 50,
    type: 'number',
    description: _i18n.i18n.translate('visTypeVislib.advancedSettings.visualization.heatmap.maxBucketsText', {
      defaultMessage: 'The maximum number of buckets a single datasource can return. ' + 'A higher number might have negative impact on browser rendering performance'
    }),
    category: ['visualization'],
    schema: _configSchema.schema.number()
  }
});

exports.getUiSettings = getUiSettings;