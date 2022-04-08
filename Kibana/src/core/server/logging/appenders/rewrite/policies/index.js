"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rewritePolicyConfigSchema = exports.createRewritePolicy = void 0;

var _std = require("@kbn/std");

var _meta = require("./meta");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const rewritePolicyConfigSchema = _meta.metaRewritePolicyConfigSchema;
exports.rewritePolicyConfigSchema = rewritePolicyConfigSchema;

const createRewritePolicy = config => {
  switch (config.type) {
    case 'meta':
      return new _meta.MetaRewritePolicy(config);

    default:
      return (0, _std.assertNever)(config.type);
  }
};

exports.createRewritePolicy = createRewritePolicy;