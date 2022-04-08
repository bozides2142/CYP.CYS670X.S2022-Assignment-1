"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerWithCustomIntegrations = registerWithCustomIntegrations;

var _i18n = require("@kbn/i18n");

var _constants = require("../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerWithCustomIntegrations(customIntegrations) {
  customIntegrations.registerCustomIntegration({
    id: _constants.featureId,
    title: _constants.featureTitle,
    description: _i18n.i18n.translate('xpack.dataVisualizer.customIntegrationsDescription', {
      defaultMessage: 'Upload data from a CSV, TSV, JSON or other log file to Elasticsearch for analysis.'
    }),
    uiInternalPath: _constants.applicationPath,
    isBeta: false,
    icons: [{
      type: 'eui',
      src: 'addDataApp'
    }],
    categories: ['upload_file'],
    shipper: 'other'
  });
}