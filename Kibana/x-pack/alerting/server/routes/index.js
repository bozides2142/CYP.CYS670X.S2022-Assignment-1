"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineRoutes = defineRoutes;

var _legacy = require("./legacy");

var _create_rule = require("./create_rule");

var _get_rule = require("./get_rule");

var _update_rule = require("./update_rule");

var _delete_rule = require("./delete_rule");

var _aggregate_rules = require("./aggregate_rules");

var _disable_rule = require("./disable_rule");

var _enable_rule = require("./enable_rule");

var _find_rules = require("./find_rules");

var _get_rule_alert_summary = require("./get_rule_alert_summary");

var _get_rule_state = require("./get_rule_state");

var _health = require("./health");

var _resolve_rule = require("./resolve_rule");

var _rule_types = require("./rule_types");

var _mute_all_rule = require("./mute_all_rule");

var _mute_alert = require("./mute_alert");

var _unmute_all_rule = require("./unmute_all_rule");

var _unmute_alert = require("./unmute_alert");

var _update_rule_api_key = require("./update_rule_api_key");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function defineRoutes(opts) {
  const {
    router,
    licenseState,
    encryptedSavedObjects,
    usageCounter
  } = opts;
  (0, _legacy.defineLegacyRoutes)(opts);
  (0, _create_rule.createRuleRoute)(opts);
  (0, _get_rule.getRuleRoute)(router, licenseState);
  (0, _get_rule.getInternalRuleRoute)(router, licenseState);
  (0, _resolve_rule.resolveRuleRoute)(router, licenseState);
  (0, _update_rule.updateRuleRoute)(router, licenseState);
  (0, _delete_rule.deleteRuleRoute)(router, licenseState);
  (0, _aggregate_rules.aggregateRulesRoute)(router, licenseState);
  (0, _disable_rule.disableRuleRoute)(router, licenseState);
  (0, _enable_rule.enableRuleRoute)(router, licenseState);
  (0, _find_rules.findRulesRoute)(router, licenseState, usageCounter);
  (0, _find_rules.findInternalRulesRoute)(router, licenseState, usageCounter);
  (0, _get_rule_alert_summary.getRuleAlertSummaryRoute)(router, licenseState);
  (0, _get_rule_state.getRuleStateRoute)(router, licenseState);
  (0, _health.healthRoute)(router, licenseState, encryptedSavedObjects);
  (0, _rule_types.ruleTypesRoute)(router, licenseState);
  (0, _mute_all_rule.muteAllRuleRoute)(router, licenseState);
  (0, _mute_alert.muteAlertRoute)(router, licenseState);
  (0, _unmute_all_rule.unmuteAllRuleRoute)(router, licenseState);
  (0, _unmute_alert.unmuteAlertRoute)(router, licenseState);
  (0, _update_rule_api_key.updateRuleApiKeyRoute)(router, licenseState);
}