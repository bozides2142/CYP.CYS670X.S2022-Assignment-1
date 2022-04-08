"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineLegacyRoutes = defineLegacyRoutes;

var _aggregate = require("./aggregate");

var _create = require("./create");

var _delete = require("./delete");

var _find = require("./find");

var _get = require("./get");

var _get_alert_state = require("./get_alert_state");

var _get_alert_instance_summary = require("./get_alert_instance_summary");

var _list_alert_types = require("./list_alert_types");

var _update = require("./update");

var _enable = require("./enable");

var _disable = require("./disable");

var _update_api_key = require("./update_api_key");

var _mute_instance = require("./mute_instance");

var _unmute_instance = require("./unmute_instance");

var _mute_all = require("./mute_all");

var _unmute_all = require("./unmute_all");

var _health = require("./health");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function defineLegacyRoutes(opts) {
  const {
    router,
    licenseState,
    encryptedSavedObjects,
    usageCounter
  } = opts;
  (0, _create.createAlertRoute)(opts);
  (0, _aggregate.aggregateAlertRoute)(router, licenseState, usageCounter);
  (0, _delete.deleteAlertRoute)(router, licenseState, usageCounter);
  (0, _find.findAlertRoute)(router, licenseState, usageCounter);
  (0, _get.getAlertRoute)(router, licenseState, usageCounter);
  (0, _get_alert_state.getAlertStateRoute)(router, licenseState, usageCounter);
  (0, _get_alert_instance_summary.getAlertInstanceSummaryRoute)(router, licenseState, usageCounter);
  (0, _list_alert_types.listAlertTypesRoute)(router, licenseState, usageCounter);
  (0, _update.updateAlertRoute)(router, licenseState, usageCounter);
  (0, _enable.enableAlertRoute)(router, licenseState, usageCounter);
  (0, _disable.disableAlertRoute)(router, licenseState, usageCounter);
  (0, _update_api_key.updateApiKeyRoute)(router, licenseState, usageCounter);
  (0, _mute_all.muteAllAlertRoute)(router, licenseState, usageCounter);
  (0, _unmute_all.unmuteAllAlertRoute)(router, licenseState, usageCounter);
  (0, _mute_instance.muteAlertInstanceRoute)(router, licenseState, usageCounter);
  (0, _unmute_instance.unmuteAlertInstanceRoute)(router, licenseState, usageCounter);
  (0, _health.healthRoute)(router, licenseState, encryptedSavedObjects, usageCounter);
}