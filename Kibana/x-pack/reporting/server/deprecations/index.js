"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerDeprecations = void 0;

var _migrate_existing_indices_ilm_policy = require("./migrate_existing_indices_ilm_policy");

var _reporting_role = require("./reporting_role");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerDeprecations = ({
  core,
  reportingCore
}) => {
  core.deprecations.registerDeprecations({
    getDeprecations: async ctx => {
      return [...(await (0, _migrate_existing_indices_ilm_policy.getDeprecationsInfo)(ctx, {
        reportingCore
      })), ...(await (0, _reporting_role.getDeprecationsInfo)(ctx, {
        reportingCore
      }))];
    }
  });
};

exports.registerDeprecations = registerDeprecations;