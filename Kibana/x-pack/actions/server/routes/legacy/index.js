"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineLegacyRoutes = defineLegacyRoutes;

var _create = require("./create");

var _delete = require("./delete");

var _get_all = require("./get_all");

var _get = require("./get");

var _update = require("./update");

var _list_action_types = require("./list_action_types");

var _execute = require("./execute");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function defineLegacyRoutes(router, licenseState, usageCounter) {
  (0, _create.createActionRoute)(router, licenseState, usageCounter);
  (0, _delete.deleteActionRoute)(router, licenseState, usageCounter);
  (0, _get.getActionRoute)(router, licenseState, usageCounter);
  (0, _get_all.getAllActionRoute)(router, licenseState, usageCounter);
  (0, _update.updateActionRoute)(router, licenseState, usageCounter);
  (0, _list_action_types.listActionTypesRoute)(router, licenseState, usageCounter);
  (0, _execute.executeActionRoute)(router, licenseState, usageCounter);
}