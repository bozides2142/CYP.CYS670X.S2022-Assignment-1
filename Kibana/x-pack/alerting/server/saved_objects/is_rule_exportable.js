"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isRuleExportable = isRuleExportable;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function isRuleExportable(rule, ruleTypeRegistry, logger) {
  const ruleSO = rule;

  try {
    const ruleType = ruleTypeRegistry.get(ruleSO.attributes.alertTypeId);

    if (!ruleType.isExportable) {
      logger.warn(`Skipping export of rule "${ruleSO.id}" because rule type "${ruleSO.attributes.alertTypeId}" is not exportable through this interface.`);
    }

    return ruleType.isExportable;
  } catch (err) {
    logger.warn(`Skipping export of rule "${ruleSO.id}" because rule type "${ruleSO.attributes.alertTypeId}" is not recognized.`);
    return false;
  }
}