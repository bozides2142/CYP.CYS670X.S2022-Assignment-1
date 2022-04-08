"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apmServerSettings = void 0;

var _i18n = require("@kbn/i18n");

var _apm_saved_object_constants = require("../../common/apm_saved_object_constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const apmServerSettings = {
  name: _apm_saved_object_constants.APM_SERVER_SCHEMA_SAVED_OBJECT_TYPE,
  hidden: false,
  namespaceType: 'agnostic',
  mappings: {
    properties: {
      schemaJson: {
        type: 'text',
        index: false
      }
    }
  },
  management: {
    importableAndExportable: false,
    icon: 'apmApp',
    getTitle: () => _i18n.i18n.translate('xpack.apm.apmSchema.index', {
      defaultMessage: 'APM Server Schema - Index'
    })
  }
};
exports.apmServerSettings = apmServerSettings;