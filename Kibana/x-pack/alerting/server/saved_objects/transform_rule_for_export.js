"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformRulesForExport = transformRulesForExport;

var _rule_execution_status = require("../lib/rule_execution_status");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function transformRulesForExport(rules) {
  const exportDate = new Date().toISOString();
  return rules.map(rule => transformRuleForExport(rule, exportDate));
}

function transformRuleForExport(rule, exportDate) {
  return { ...rule,
    attributes: { ...rule.attributes,
      legacyId: null,
      enabled: false,
      apiKey: null,
      apiKeyOwner: null,
      scheduledTaskId: null,
      executionStatus: (0, _rule_execution_status.getRuleExecutionStatusPending)(exportDate)
    }
  };
}