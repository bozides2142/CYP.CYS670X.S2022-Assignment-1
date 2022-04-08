"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GO_TO_RULES_BUTTON_LABLE = void 0;
exports.getImportWarnings = getImportWarnings;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getImportWarnings(rulesSavedObjects) {
  if (rulesSavedObjects.length === 0) {
    return [];
  }

  const message = _i18n.i18n.translate('xpack.alerting.savedObjects.onImportText', {
    defaultMessage: '{rulesSavedObjectsLength} {rulesSavedObjectsLength, plural, one {rule} other {rules}} must be enabled after the import.',
    values: {
      rulesSavedObjectsLength: rulesSavedObjects.length
    }
  });

  return [{
    type: 'action_required',
    message,
    actionPath: '/app/management/insightsAndAlerting/triggersActions/rules',
    buttonLabel: GO_TO_RULES_BUTTON_LABLE
  }];
}

const GO_TO_RULES_BUTTON_LABLE = _i18n.i18n.translate('xpack.alerting.savedObjects.goToRulesButtonText', {
  defaultMessage: 'Go to rules'
});

exports.GO_TO_RULES_BUTTON_LABLE = GO_TO_RULES_BUTTON_LABLE;