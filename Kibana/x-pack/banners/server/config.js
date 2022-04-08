"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = void 0;

var _configSchema = require("@kbn/config-schema");

var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// import { get } from 'lodash';


const configSchema = _configSchema.schema.object({
  placement: _configSchema.schema.oneOf([_configSchema.schema.literal('disabled'), _configSchema.schema.literal('top')], {
    defaultValue: 'disabled'
  }),
  textContent: _configSchema.schema.string({
    defaultValue: ''
  }),
  textColor: _configSchema.schema.string({
    validate: color => {
      if (!(0, _utils.isHexColor)(color)) {
        return `must be an hex color`;
      }
    },
    defaultValue: '#8A6A0A'
  }),
  backgroundColor: _configSchema.schema.string({
    validate: color => {
      if (!(0, _utils.isHexColor)(color)) {
        return `must be an hex color`;
      }
    },
    defaultValue: '#FFF9E8'
  }),
  disableSpaceBanners: _configSchema.schema.boolean({
    defaultValue: false
  })
});

const config = {
  schema: configSchema,
  exposeToBrowser: {}
};
exports.config = config;