"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runtimeMappingsSchema = void 0;

var _configSchema = require("@kbn/config-schema");

var _i18n = require("@kbn/i18n");

var _runtime_field_utils = require("../../../common/util/runtime_field_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const runtimeMappingsSchema = _configSchema.schema.object({}, {
  unknowns: 'allow',
  validate: v => {
    if (Object.values(v).some(o => !(0, _runtime_field_utils.isRuntimeField)(o))) {
      return _i18n.i18n.translate('xpack.ml.invalidRuntimeFieldMessage', {
        defaultMessage: 'Invalid runtime field'
      });
    }
  }
});

exports.runtimeMappingsSchema = runtimeMappingsSchema;