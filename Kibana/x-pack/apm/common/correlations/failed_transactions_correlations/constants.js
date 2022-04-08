"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FAILED_TRANSACTIONS_IMPACT_THRESHOLD = void 0;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const FAILED_TRANSACTIONS_IMPACT_THRESHOLD = {
  HIGH: _i18n.i18n.translate('xpack.apm.correlations.failedTransactions.highImpactText', {
    defaultMessage: 'High'
  }),
  MEDIUM: _i18n.i18n.translate('xpack.apm.correlations.failedTransactions.mediumImpactText', {
    defaultMessage: 'Medium'
  }),
  LOW: _i18n.i18n.translate('xpack.apm.correlations.failedTransactions.lowImpactText', {
    defaultMessage: 'Low'
  })
};
exports.FAILED_TRANSACTIONS_IMPACT_THRESHOLD = FAILED_TRANSACTIONS_IMPACT_THRESHOLD;