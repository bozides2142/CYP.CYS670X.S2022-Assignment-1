"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.metaRewritePolicyConfigSchema = exports.MetaRewritePolicy = void 0;

var _configSchema = require("@kbn/config-schema");

var _saferLodashSet = require("@elastic/safer-lodash-set");

var _lodash = require("lodash");

var _std = require("@kbn/std");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const metaRewritePolicyConfigSchema = _configSchema.schema.object({
  type: _configSchema.schema.literal('meta'),
  mode: _configSchema.schema.oneOf([_configSchema.schema.literal('update'), _configSchema.schema.literal('remove')], {
    defaultValue: 'update'
  }),
  properties: _configSchema.schema.arrayOf(_configSchema.schema.object({
    path: _configSchema.schema.string(),
    value: _configSchema.schema.maybe(_configSchema.schema.nullable(_configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.number(), _configSchema.schema.boolean()])))
  }))
});
/**
 * A rewrite policy which can add, remove, or update properties
 * from a record's {@link LogMeta}.
 */


exports.metaRewritePolicyConfigSchema = metaRewritePolicyConfigSchema;

class MetaRewritePolicy {
  constructor(config) {
    this.config = config;
  }

  rewrite(record) {
    switch (this.config.mode) {
      case 'update':
        return this.update(record);

      case 'remove':
        return this.remove(record);

      default:
        return (0, _std.assertNever)(this.config.mode);
    }
  }

  update(record) {
    for (const {
      path,
      value
    } of this.config.properties) {
      if (!(0, _lodash.has)(record, `meta.${path}`)) {
        continue; // don't add properties which don't already exist
      }

      (0, _saferLodashSet.set)(record, `meta.${path}`, value);
    }

    return record;
  }

  remove(record) {
    for (const {
      path
    } of this.config.properties) {
      (0, _lodash.unset)(record, `meta.${path}`);
    }

    return record;
  }

}

exports.MetaRewritePolicy = MetaRewritePolicy;