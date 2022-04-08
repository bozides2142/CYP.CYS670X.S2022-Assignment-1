"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.executionStatusFromError = executionStatusFromError;
exports.executionStatusFromState = executionStatusFromState;
exports.getRuleExecutionStatusPending = void 0;
exports.ruleExecutionStatusFromRaw = ruleExecutionStatusFromRaw;
exports.ruleExecutionStatusToRaw = ruleExecutionStatusToRaw;

var _error_with_reason = require("./error_with_reason");

var _errors = require("./errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function executionStatusFromState(state) {
  var _state$alertInstances, _state$triggeredActio, _state$triggeredActio2;

  const alertIds = Object.keys((_state$alertInstances = state.alertInstances) !== null && _state$alertInstances !== void 0 ? _state$alertInstances : {});
  return {
    numberOfTriggeredActions: (_state$triggeredActio = (_state$triggeredActio2 = state.triggeredActions) === null || _state$triggeredActio2 === void 0 ? void 0 : _state$triggeredActio2.length) !== null && _state$triggeredActio !== void 0 ? _state$triggeredActio : 0,
    lastExecutionDate: new Date(),
    status: alertIds.length === 0 ? 'ok' : 'active'
  };
}

function executionStatusFromError(error) {
  return {
    lastExecutionDate: new Date(),
    status: 'error',
    error: {
      reason: (0, _error_with_reason.getReasonFromError)(error),
      message: (0, _errors.getEsErrorMessage)(error)
    }
  };
}

function ruleExecutionStatusToRaw({
  lastExecutionDate,
  lastDuration,
  status,
  error
}) {
  return {
    lastExecutionDate: lastExecutionDate.toISOString(),
    lastDuration: lastDuration !== null && lastDuration !== void 0 ? lastDuration : 0,
    status,
    // explicitly setting to null (in case undefined) due to partial update concerns
    error: error !== null && error !== void 0 ? error : null
  };
}

function ruleExecutionStatusFromRaw(logger, ruleId, rawRuleExecutionStatus) {
  if (!rawRuleExecutionStatus) return undefined;
  const {
    lastExecutionDate,
    lastDuration,
    numberOfTriggeredActions,
    status = 'unknown',
    error
  } = rawRuleExecutionStatus;
  let parsedDateMillis = lastExecutionDate ? Date.parse(lastExecutionDate) : Date.now();

  if (isNaN(parsedDateMillis)) {
    logger.debug(`invalid ruleExecutionStatus lastExecutionDate "${lastExecutionDate}" in raw rule ${ruleId}`);
    parsedDateMillis = Date.now();
  }

  const executionStatus = {
    status,
    lastExecutionDate: new Date(parsedDateMillis)
  };

  if (null != lastDuration) {
    executionStatus.lastDuration = lastDuration;
  }

  if (null != numberOfTriggeredActions) {
    executionStatus.numberOfTriggeredActions = numberOfTriggeredActions;
  }

  if (error) {
    executionStatus.error = error;
  }

  return executionStatus;
}

const getRuleExecutionStatusPending = lastExecutionDate => ({
  status: 'pending',
  lastExecutionDate,
  error: null
});

exports.getRuleExecutionStatusPending = getRuleExecutionStatusPending;