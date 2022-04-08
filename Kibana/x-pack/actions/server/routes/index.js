"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineRoutes = defineRoutes;

var _create = require("./create");

var _delete = require("./delete");

var _execute = require("./execute");

var _get = require("./get");

var _get_all = require("./get_all");

var _connector_types = require("./connector_types");

var _update = require("./update");

var _get_well_known_email_service = require("./get_well_known_email_service");

var _legacy = require("./legacy");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function defineRoutes(router, licenseState, usageCounter) {
  (0, _legacy.defineLegacyRoutes)(router, licenseState, usageCounter);
  (0, _create.createActionRoute)(router, licenseState);
  (0, _delete.deleteActionRoute)(router, licenseState);
  (0, _get.getActionRoute)(router, licenseState);
  (0, _get_all.getAllActionRoute)(router, licenseState);
  (0, _update.updateActionRoute)(router, licenseState);
  (0, _connector_types.connectorTypesRoute)(router, licenseState);
  (0, _execute.executeActionRoute)(router, licenseState);
  (0, _get_well_known_email_service.getWellKnownEmailServiceRoute)(router, licenseState);
}